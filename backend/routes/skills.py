from flask import Blueprint, request, session
from datetime import datetime
from bson.objectid import ObjectId
import sys
import os

# Add parent directory to path to import from main
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.auth_decorator import login_required, get_current_user_id
from utils.helpers import create_response

skills_bp = Blueprint('skills', __name__, url_prefix='/api/skills')

@skills_bp.route('/', methods=['GET'])
@login_required
def get_skills():
    """Get all skills for the logged-in user"""
    try:
        from main import skills_collection
        
        user_id = get_current_user_id()
        skills = list(skills_collection.find({'user_id': user_id}))
        
        # Convert ObjectId to string
        for skill in skills:
            skill['id'] = str(skill.pop('_id'))
            skill['user_id'] = str(skill['user_id'])
        
        return create_response(True, f"Found {len(skills)} skills", data={'skills': skills})
    
    except Exception as e:
        return create_response(False, f"Error: {str(e)}", status_code=500)


@skills_bp.route('/', methods=['POST'])
@login_required
def create_skill():
    """Create a new skill"""
    try:
        from main import skills_collection
        
        data = request.get_json()
        user_id = get_current_user_id()
        
        # Validate input
        if not data.get('name') or not data.get('category'):
            return create_response(False, "Name and category are required", status_code=400)
        
        new_skill = {
            'user_id': user_id,
            'name': data['name'],
            'level': 1,
            'xp': 0,
            'maxXp': 1000,
            'category': data['category'],
            'color': data.get('color', '#667eea'),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = skills_collection.insert_one(new_skill)
        new_skill['id'] = str(result.inserted_id)
        new_skill.pop('_id')
        new_skill['user_id'] = str(new_skill['user_id'])
        
        return create_response(True, "Skill created successfully", data={'skill': new_skill}, status_code=201)
    
    except Exception as e:
        return create_response(False, f"Error: {str(e)}", status_code=500)


@skills_bp.route('/<skill_id>', methods=['DELETE'])
@login_required
def delete_skill(skill_id):
    """Delete a skill"""
    try:
        from main import skills_collection
        
        user_id = get_current_user_id()
        
        result = skills_collection.delete_one({
            '_id': ObjectId(skill_id),
            'user_id': user_id
        })
        
        if result.deleted_count == 0:
            return create_response(False, "Skill not found", status_code=404)
        
        return create_response(True, "Skill deleted successfully")
    
    except Exception as e:
        return create_response(False, f"Error: {str(e)}", status_code=500)


@skills_bp.route('/<skill_id>/practice', methods=['POST'])
@login_required
def practice_skill(skill_id):
    """Add XP to a skill (handles leveling up)"""
    try:
        from main import skills_collection, users_collection, notifications_collection, xp_history_collection
        
        data = request.get_json()
        xp_gain = data.get('xp', 50)
        user_id = get_current_user_id()
        
        # Get skill
        skill = skills_collection.find_one({
            '_id': ObjectId(skill_id),
            'user_id': user_id
        })
        
        if not skill:
            return create_response(False, "Skill not found", status_code=404)
        
        # Add XP and handle leveling
        skill['xp'] += xp_gain
        leveled_up = False
        
        while skill['xp'] >= skill['maxXp']:
            skill['xp'] -= skill['maxXp']
            skill['level'] += 1
            leveled_up = True
        
        # Update skill
        skills_collection.update_one(
            {'_id': ObjectId(skill_id)},
            {'$set': {
                'xp': skill['xp'],
                'level': skill['level'],
                'updated_at': datetime.utcnow()
            }}
        )
        
        # Update user total XP
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        new_total_xp = user.get('total_xp', 0) + xp_gain
        previous_level = user.get('level', 1)
        new_level = (new_total_xp // 300) + 1
        
        users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {
                'total_xp': new_total_xp,
                'level': new_level
            }}
        )
        
        # Create notification if leveled up
        if leveled_up:
            notifications_collection.insert_one({
                'user_id': user_id,
                'type': 'levelup',
                'message': f"🎉 {skill['name']} leveled up to Level {skill['level']}!",
                'read': False,
                'created_at': datetime.utcnow()
            })
        
        # Log XP history
        xp_history_collection.insert_one({
            'user_id': user_id,
            'amount': xp_gain,
            'source_type': 'skill',
            'source_id': str(skill_id),
            'description': f"Practiced {skill['name']}",
            'created_at': datetime.utcnow()
        })
        
        # Prepare response
        skill['id'] = str(skill.pop('_id'))
        skill['user_id'] = str(skill['user_id'])
        
        return create_response(
            True,
            "XP added successfully",
            data={
                'skill': skill,
                'user': {
                    'total_xp': new_total_xp,
                    'level': new_level
                },
                'leveled_up': leveled_up,
                'user_leveled_up': new_level > previous_level
            }
        )
    
    except Exception as e:
        return create_response(False, f"Error: {str(e)}", status_code=500)