from functools import wraps
from flask import session, jsonify
from datetime import datetime

def login_required(f):

    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('logged_in'):
            return jsonify({
                'success': False,
                'message': 'Unauthorized. Please login first.',
                'timestamp': datetime.utcnow().isoformat()
            }), 401
        return f(*args, **kwargs)
    return decorated_function

def get_current_user_id():
   
    return session.get('user_id')