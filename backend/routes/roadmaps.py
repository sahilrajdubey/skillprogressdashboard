from flask import Blueprint, request
from datetime import datetime
from bson.objectid import ObjectId
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.auth_decorator import login_required, get_current_user_id
from utils.helpers import create_response

roadmaps_bp = Blueprint('roadmaps', __name__, url_prefix='/api/roadmaps')

@roadmaps_bp.route('/', methods=['GET'])
@login_required
def get_roadmaps():
    """Get user's roadmaps with steps"""
    try:
        from main import roadmaps_collection, roadmap_steps_collection
        
        user_id = get_current_user_id()
        
        roadmaps = list(roadmaps_collection.find({'user_id': user_id}))
        
        for roadmap in roadmaps:
            roadmap_id = str(roadmap['_id'])
            roadmap['id'] = roadmap_id
            roadmap.pop('_id')
            roadmap['user_id'] = str(roadmap['user_id'])
            
            # Get steps for this roadmap
            steps = list(roadmap_steps_collection.find({'roadmap_id': roadmap_id}))
            for step in steps:
                step['id'] = str(step.pop('_id'))
                step.pop('roadmap_id', None)
            
            roadmap['steps'] = sorted(steps, key=lambda x: x.get('order', 0))
        
        return create_response(True, f"Found {len(roadmaps)} roadmaps", data={'roadmaps': roadmaps})
    
    except Exception as e:
        return create_response(False, f"Error: {str(e)}", status_code=500)


@roadmaps_bp.route('/<roadmap_id>/steps/<step_id>/complete', methods=['PUT'])
@login_required
def complete_step(roadmap_id, step_id):
    """Complete a roadmap step"""
    try:
        from main import roadmap_steps_collection, users_collection, notifications_collection, xp_history_collection
        
        user_id = get_current_user_id()
        
        # Get step
        step = roadmap_steps_collection.find_one({'_id': ObjectId(step_id)})
        if not step:
            return create_response(False, "Step not found", status_code=404)
        
        if step.get('completed'):
            return create_response(False, "Step already completed", status_code=400)
        
        # Mark as completed
        roadmap_steps_collection.update_one(
            {'_id': ObjectId(step_id)},
            {'$set': {
                'completed': True,
                'completed_at': datetime.utcnow()
            }}
        )
        
        # Award XP
        xp_reward = step.get('xp', 100)
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        new_total_xp = user.get('total_xp', 0) + xp_reward
        new_level = (new_total_xp // 300) + 1
        
        users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {
                'total_xp': new_total_xp,
                'level': new_level
            }}
        )
        
        # Create notification
        notifications_collection.insert_one({
            'user_id': user_id,
            'type': 'achievement',
            'message': f"✅ Completed: {step['title']} (+{xp_reward} XP)",
            'read': False,
            'created_at': datetime.utcnow()
        })
        
        # Log XP history
        xp_history_collection.insert_one({
            'user_id': user_id,
            'amount': xp_reward,
            'source_type': 'roadmap',
            'source_id': step_id,
            'description': f"Completed roadmap step: {step['title']}",
            'created_at': datetime.utcnow()
        })
        
        return create_response(
            True,
            "Step completed!",
            data={
                'user': {
                    'total_xp': new_total_xp,
                    'level': new_level
                },
                'xp_gained': xp_reward
            }
        )
    
    except Exception as e:
        return create_response(False, f"Error: {str(e)}", status_code=500)