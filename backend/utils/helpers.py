from datetime import datetime
from flask import jsonify

def create_response(success, message, data=None, status_code=200):
    """Standardized API response format"""
    response = {
        'success': success,
        'message': message,
        'timestamp': datetime.utcnow().isoformat()
    }
    if data:
        response['data'] = data
    return jsonify(response), status_code

def calculate_level(total_xp):
    """Calculate user level based on total XP"""
    return (total_xp // 300) + 1

def xp_for_next_level(current_level):
    """Calculate XP needed for next level"""
    return current_level * 300