from flask import Blueprint, request
from datetime import datetime, timedelta
from bson.objectid import ObjectId
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.auth_decorator import login_required, get_current_user_id
from utils.helpers import create_response

stats_bp = Blueprint('stats', __name__, url_prefix='/api/stats')

@stats_bp.route('/overview', methods=['GET'])
@login_required
def get_overview():
    """Get dashboard overview stats"""
    try:
        from main import users_collection, skills_collection, user_courses_collection, user_achievements_collection, achievements_collection
        
        user_id = get_current_user_id()
        
        # Get user
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        
        # Get skills count
        skills_count = skills_collection.count_documents({'user_id': user_id})
        
        # Get enrolled courses count
        courses_count = user_courses_collection.count_documents({'user_id': user_id})
        
        # Get achievements
        user_achievement_ids = [ua['achievement_id'] for ua in user_achievements_collection.find({'user_id': user_id})]
        achievements = []
        
        if user_achievement_ids:
            achievements = list(achievements_collection.find({'_id': {'$in': [ObjectId(id) for id in user_achievement_ids]}}))
            
            for achievement in achievements:
                achievement['id'] = str(achievement.pop('_id'))
        
        return create_response(
            True,
            "Overview retrieved",
            data={
                'totalXP': user.get('total_xp', 0),
                'level': user.get('level', 1),
                'current_streak': user.get('current_streak', 0),
                'skills_count': skills_count,
                'courses_count': courses_count,
                'achievements': achievements
            }
        )
    
    except Exception as e:
        return create_response(False, f"Error: {str(e)}", status_code=500)


@stats_bp.route('/skills-by-category', methods=['GET'])
@login_required
def get_skills_by_category():
    """Get skills grouped by category"""
    try:
        from main import skills_collection
        
        user_id = get_current_user_id()
        
        pipeline = [
            {'$match': {'user_id': user_id}},
            {'$group': {
                '_id': '$category',
                'total_level': {'$sum': '$level'},
                'count': {'$sum': 1}
            }}
        ]
        
        result = list(skills_collection.aggregate(pipeline))
        
        categories = {}
        for item in result:
            categories[item['_id']] = {
                'total_level': item['total_level'],
                'count': item['count']
            }
        
        return create_response(True, "Skills by category", data={'categories': categories})
    
    except Exception as e:
        return create_response(False, f"Error: {str(e)}", status_code=500)


@stats_bp.route('/xp-history', methods=['GET'])
@login_required
def get_xp_history():
    """Get XP history"""
    try:
        from main import xp_history_collection
        
        user_id = get_current_user_id()
        days = int(request.args.get('days', 30))
        
        start_date = datetime.utcnow() - timedelta(days=days)
        
        history = list(xp_history_collection.find({
            'user_id': user_id,
            'created_at': {'$gte': start_date}
        }).sort('created_at', 1))
        
        for entry in history:
            entry['id'] = str(entry.pop('_id'))
            entry.pop('user_id', None)
        
        return create_response(True, f"XP history for last {days} days", data={'history': history})
    
    except Exception as e:
        return create_response(False, f"Error: {str(e)}", status_code=500)