from flask import Blueprint
from bson.objectid import ObjectId
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.auth_decorator import login_required, get_current_user_id
from utils.helpers import create_response

notifications_bp = Blueprint('notifications', __name__, url_prefix='/api/notifications')

@notifications_bp.route('/', methods=['GET'])
@login_required
def get_notifications():
    """Get user notifications"""
    try:
        from main import notifications_collection
        
        user_id = get_current_user_id()
        
        notifications = list(notifications_collection.find({'user_id': user_id}).sort('created_at', -1).limit(50))
        
        for notif in notifications:
            notif['id'] = str(notif.pop('_id'))
            notif.pop('user_id', None)
        
        return create_response(True, f"Found {len(notifications)} notifications", data={'notifications': notifications})
    
    except Exception as e:
        return create_response(False, f"Error: {str(e)}", status_code=500)


@notifications_bp.route('/<notif_id>/read', methods=['PUT'])
@login_required
def mark_as_read(notif_id):
    """Mark notification as read"""
    try:
        from main import notifications_collection
        
        user_id = get_current_user_id()
        
        notifications_collection.update_one(
            {'_id': ObjectId(notif_id), 'user_id': user_id},
            {'$set': {'read': True}}
        )
        
        return create_response(True, "Marked as read")
    
    except Exception as e:
        return create_response(False, f"Error: {str(e)}", status_code=500)


@notifications_bp.route('/read-all', methods=['PUT'])
@login_required
def mark_all_as_read():
    """Mark all notifications as read"""
    try:
        from main import notifications_collection
        
        user_id = get_current_user_id()
        
        result = notifications_collection.update_many(
            {'user_id': user_id, 'read': False},
            {'$set': {'read': True}}
        )
        
        return create_response(True, f"Marked {result.modified_count} notifications as read")
    
    except Exception as e:
        return create_response(False, f"Error: {str(e)}", status_code=500)