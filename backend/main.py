# main.py
"""
SkillProgress Dashboard Backend - Flask + MongoDB
==================================================
Installation:
pip install flask flask-cors pymongo werkzeug

Run server:
python main.py

Database: MongoDB Atlas
Session-based Authentication with HTTP-only cookies
Port: 8000
"""

from flask import Flask, request, jsonify, session
from flask_cors import CORS
from pymongo import MongoClient, errors
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from bson.objectid import ObjectId
import re
import os

# ============================================================================
# APP INITIALIZATION
# ============================================================================

app = Flask(__name__)

app.config['SECRET_KEY'] = 'your-secret-key-change-this-in-production-2025-skillprogress'
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)

MONGO_URI = os.environ.get('MONGO_URI', 'mongodb+srv://sahil5661:sahil1234@cluster0.ezqeu4d.mongodb.net/')
DATABASE_NAME = 'login'

# ============================================================================
# CORS CONFIGURATION
# ============================================================================

CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# ============================================================================
# MONGODB CONNECTION
# ============================================================================

try:
    mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    mongo_client.server_info()
    
    db = mongo_client[DATABASE_NAME]
    users_collection = db['users']
    skills_collection = db['skills']
    courses_collection = db['courses']
    achievements_collection = db['achievements']
    roadmap_collection = db['roadmap_steps']
    
    users_collection.create_index('email', unique=True)
    
    print("✅ Connected to MongoDB successfully!")
    
except errors.ServerSelectionTimeoutError as err:
    print(f"❌ MongoDB Connection Error: {err}")
    exit(1)
except Exception as e:
    print(f"❌ Error: {e}")
    exit(1)



def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    if len(password) < 6:
        return False, "Password must be at least 6 characters long"
    return True, "Valid password"

def validate_name(name):
    if not name or len(name.strip()) < 2:
        return False, "Name must be at least 2 characters long"
    if len(name) > 100:
        return False, "Name must be less than 100 characters"
    return True, "Valid name"

def create_response(success, message, data=None, status_code=200):
    response = {
        'success': success,
        'message': message,
        'timestamp': datetime.utcnow().isoformat()
    }
    if data:
        response['data'] = data
    return jsonify(response), status_code

def user_to_dict(user):
    if user:
        return {
            'id': str(user['_id']),
            'name': user['name'],
            'email': user['email'],
            'username': user.get('username', user['email'].split('@')[0]),
            'xp': user.get('xp', 2847),
            'level': user.get('level', 12),
            'streak': user.get('streak', 7),
            'created_at': user.get('created_at', '').isoformat() if isinstance(user.get('created_at'), datetime) else None
        }
    return None

def init_user_data(user_id):
    """Initialize default skills, courses, achievements, and roadmap for a new user"""
    user_id_str = str(user_id)
    
    # Default skills
    default_skills = [
        {'user_id': user_id_str, 'skill_id': '1', 'name': 'React', 'level': 8, 'xp': 750, 'maxXp': 1000, 'category': 'Frontend', 'color': '#61dafb'},
        {'user_id': user_id_str, 'skill_id': '2', 'name': 'TypeScript', 'level': 7, 'xp': 600, 'maxXp': 1000, 'category': 'Languages', 'color': '#3178c6'},
        {'user_id': user_id_str, 'skill_id': '3', 'name': 'Node.js', 'level': 6, 'xp': 450, 'maxXp': 1000, 'category': 'Backend', 'color': '#339933'},
        {'user_id': user_id_str, 'skill_id': '4', 'name': 'Python', 'level': 9, 'xp': 850, 'maxXp': 1000, 'category': 'Languages', 'color': '#3776ab'},
        {'user_id': user_id_str, 'skill_id': '5', 'name': 'Docker', 'level': 5, 'xp': 300, 'maxXp': 1000, 'category': 'DevOps', 'color': '#2496ed'},
        {'user_id': user_id_str, 'skill_id': '6', 'name': 'AWS', 'level': 4, 'xp': 200, 'maxXp': 1000, 'category': 'Cloud', 'color': '#ff9900'},
    ]
    
    # Default courses
    default_courses = [
        {'user_id': user_id_str, 'course_id': '1', 'title': 'React Mastery: Advanced Patterns', 'progress': 78, 'xpReward': 500, 'thumbnail': '🎯', 'category': 'Frontend', 'lessons': 45, 'completedLessons': 35},
        {'user_id': user_id_str, 'course_id': '2', 'title': 'TypeScript Deep Dive', 'progress': 45, 'xpReward': 450, 'thumbnail': '📘', 'category': 'Languages', 'lessons': 30, 'completedLessons': 14},
        {'user_id': user_id_str, 'course_id': '3', 'title': 'System Design Fundamentals', 'progress': 92, 'xpReward': 800, 'thumbnail': '🏗️', 'category': 'Architecture', 'lessons': 25, 'completedLessons': 23},
        {'user_id': user_id_str, 'course_id': '4', 'title': 'Docker & Kubernetes', 'progress': 30, 'xpReward': 600, 'thumbnail': '🐳', 'category': 'DevOps', 'lessons': 40, 'completedLessons': 12},
    ]
    
    # Default achievements
    default_achievements = [
        {'user_id': user_id_str, 'achievement_id': '1', 'title': 'First Steps', 'description': 'Complete your first course', 'icon': '🎓', 'unlockedAt': '2025-09-15', 'rarity': 'common'},
        {'user_id': user_id_str, 'achievement_id': '2', 'title': 'Streak Master', 'description': '7-day learning streak', 'icon': '🔥', 'unlockedAt': '2025-10-01', 'rarity': 'rare'},
        {'user_id': user_id_str, 'achievement_id': '3', 'title': 'Code Warrior', 'description': 'Reach level 10', 'icon': '⚔️', 'unlockedAt': '2025-10-05', 'rarity': 'epic'},
        {'user_id': user_id_str, 'achievement_id': '4', 'title': 'Knowledge Seeker', 'description': 'Complete 5 courses', 'icon': '📚', 'unlockedAt': '2025-10-08', 'rarity': 'legendary'},
    ]
    
    # Default roadmap steps
    default_roadmap = [
        {'user_id': user_id_str, 'step_id': '1', 'title': 'Master React Hooks', 'completed': True, 'xp': 100, 'description': 'Learn all React hooks'},
        {'user_id': user_id_str, 'step_id': '2', 'title': 'Build 3 Projects', 'completed': True, 'xp': 150, 'description': 'Apply your skills'},
        {'user_id': user_id_str, 'step_id': '3', 'title': 'Learn State Management', 'completed': True, 'xp': 120, 'description': 'Redux & Context API'},
        {'user_id': user_id_str, 'step_id': '4', 'title': 'Advanced TypeScript', 'completed': False, 'xp': 180, 'description': 'Generics & Utility Types'},
        {'user_id': user_id_str, 'step_id': '5', 'title': 'Testing & TDD', 'completed': False, 'xp': 200, 'description': 'Jest & React Testing Library'},
        {'user_id': user_id_str, 'step_id': '6', 'title': 'Performance Optimization', 'completed': False, 'xp': 220, 'description': 'Optimize React apps'},
    ]
    
    if skills_collection.count_documents({'user_id': user_id_str}) == 0:
        skills_collection.insert_many(default_skills)
    
    if courses_collection.count_documents({'user_id': user_id_str}) == 0:
        courses_collection.insert_many(default_courses)
    
    if achievements_collection.count_documents({'user_id': user_id_str}) == 0:
        achievements_collection.insert_many(default_achievements)
    
    if roadmap_collection.count_documents({'user_id': user_id_str}) == 0:
        roadmap_collection.insert_many(default_roadmap)

# ============================================================================
# AUTHENTICATION ROUTES
# ============================================================================

@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        
        if not data:
            return create_response(False, "No data provided", status_code=400)
        
        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        is_valid_name, name_message = validate_name(name)
        if not is_valid_name:
            return create_response(False, name_message, status_code=400)
        
        if not email:
            return create_response(False, "Email is required", status_code=400)
        
        if not validate_email(email):
            return create_response(False, "Invalid email format", status_code=400)
        
        if not password:
            return create_response(False, "Password is required", status_code=400)
        
        is_valid_password, password_message = validate_password(password)
        if not is_valid_password:
            return create_response(False, password_message, status_code=400)
        
        existing_user = users_collection.find_one({'email': email})
        if existing_user:
            return create_response(False, "Email already registered. Please sign in.", status_code=409)
        
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        
        new_user = {
            'name': name,
            'email': email,
            'username': email.split('@')[0],
            'password': hashed_password,
            'xp': 0,
            'level': 1,
            'streak': 0,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = users_collection.insert_one(new_user)
        created_user = users_collection.find_one({'_id': result.inserted_id})
        
        # Initialize user data
        init_user_data(result.inserted_id)
        
        session.permanent = True
        session['user_id'] = str(result.inserted_id)
        session['user_email'] = email
        session['user_name'] = name
        session['logged_in'] = True
        
        return create_response(
            True, 
            "Account created successfully!",
            data={
                'user': user_to_dict(created_user),
                'redirect': '/dashboard'
            },
            status_code=201
        )
        
    except errors.DuplicateKeyError:
        return create_response(False, "Email already registered. Please sign in.", status_code=409)
    except Exception as e:
        print(f"Signup Error: {str(e)}")
        return create_response(False, f"Server error: {str(e)}", status_code=500)


@app.route('/api/login', methods=['POST'])
def login():
    try:
        if session.get('logged_in'):
            user_id = session.get('user_id')
            user = users_collection.find_one({'_id': ObjectId(user_id)})
            return create_response(
                True,
                "Already logged in",
                data={
                    'user': user_to_dict(user),
                    'redirect': '/dashboard'
                }
            )
        
        data = request.get_json()
        
        if not data:
            return create_response(False, "No data provided", status_code=400)
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return create_response(False, "Email and password are required", status_code=400)
        
        user = users_collection.find_one({'email': email})
        
        if not user:
            return create_response(False, "Invalid credentials", status_code=401)
        
        if not check_password_hash(user['password'], password):
            return create_response(False, "Incorrect password", status_code=401)
        
        # Initialize user data if not exists
        init_user_data(user['_id'])
        
        session.permanent = True
        session['user_id'] = str(user['_id'])
        session['user_email'] = user['email']
        session['user_name'] = user['name']
        session['logged_in'] = True
        
        users_collection.update_one(
            {'_id': user['_id']},
            {'$set': {'last_login': datetime.utcnow()}}
        )
        
        return create_response(
            True,
            "Login successful!",
            data={
                'user': user_to_dict(user),
                'redirect': '/dashboard'
            },
            status_code=200
        )
        
    except Exception as e:
        print(f"Login Error: {str(e)}")
        return create_response(False, f"Server error: {str(e)}", status_code=500)


@app.route('/api/logout', methods=['POST', 'GET'])
def logout():
    try:
        session.clear()
        return create_response(True, "Logged out successfully", data={'redirect': '/signin'})
    except Exception as e:
        print(f"Logout Error: {str(e)}")
        return create_response(False, f"Logout error: {str(e)}", status_code=500)


@app.route('/api/me', methods=['GET'])
def get_current_user():
    try:
        if not session.get('logged_in'):
            return create_response(
                False,
                "User is not authenticated",
                data={'authenticated': False},
                status_code=401
            )
        
        user_id = session.get('user_id')
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        
        if user:
            return create_response(
                True,
                "User is authenticated",
                data={
                    'authenticated': True,
                    'user': user_to_dict(user)
                }
            )
        
        session.clear()
        return create_response(
            False,
            "Session expired",
            data={'authenticated': False},
            status_code=401
        )
        
    except Exception as e:
        print(f"Get User Error: {str(e)}")
        return create_response(False, f"Server error: {str(e)}", status_code=500)

# ============================================================================
# DASHBOARD DATA ROUTES
# ============================================================================

@app.route('/api/skills', methods=['GET'])
def get_skills():
    try:
        if not session.get('logged_in'):
            return create_response(False, "Unauthorized", status_code=401)
        
        user_id = session.get('user_id')
        skills = list(skills_collection.find({'user_id': user_id}, {'_id': 0, 'user_id': 0}))
        
        # Convert skill_id to id for frontend
        for skill in skills:
            skill['id'] = skill.pop('skill_id')
        
        return create_response(True, "Skills retrieved", data={'skills': skills})
        
    except Exception as e:
        print(f"Get Skills Error: {str(e)}")
        return create_response(False, f"Server error: {str(e)}", status_code=500)


@app.route('/api/skills/<skill_id>', methods=['PUT'])
def update_skill(skill_id):
    try:
        if not session.get('logged_in'):
            return create_response(False, "Unauthorized", status_code=401)
        
        user_id = session.get('user_id')
        data = request.get_json()
        
        xp_gain = data.get('xpGain', 50)
        
        skill = skills_collection.find_one({'user_id': user_id, 'skill_id': skill_id})
        
        if not skill:
            return create_response(False, "Skill not found", status_code=404)
        
        new_xp = skill['xp'] + xp_gain
        leveled_up = new_xp >= skill['maxXp']
        
        update_data = {
            'xp': new_xp - skill['maxXp'] if leveled_up else new_xp,
            'level': skill['level'] + 1 if leveled_up else skill['level']
        }
        
        skills_collection.update_one(
            {'user_id': user_id, 'skill_id': skill_id},
            {'$set': update_data}
        )
        
        # Update user XP
        users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$inc': {'xp': xp_gain}}
        )
        
        updated_skill = skills_collection.find_one({'user_id': user_id, 'skill_id': skill_id}, {'_id': 0, 'user_id': 0})
        updated_skill['id'] = updated_skill.pop('skill_id')
        
        return create_response(True, "Skill updated", data={'skill': updated_skill})
        
    except Exception as e:
        print(f"Update Skill Error: {str(e)}")
        return create_response(False, f"Server error: {str(e)}", status_code=500)


@app.route('/api/courses', methods=['GET'])
def get_courses():
    try:
        if not session.get('logged_in'):
            return create_response(False, "Unauthorized", status_code=401)
        
        user_id = session.get('user_id')
        courses = list(courses_collection.find({'user_id': user_id}, {'_id': 0, 'user_id': 0}))
        
        for course in courses:
            course['id'] = course.pop('course_id')
        
        return create_response(True, "Courses retrieved", data={'courses': courses})
        
    except Exception as e:
        print(f"Get Courses Error: {str(e)}")
        return create_response(False, f"Server error: {str(e)}", status_code=500)


@app.route('/api/achievements', methods=['GET'])
def get_achievements():
    try:
        if not session.get('logged_in'):
            return create_response(False, "Unauthorized", status_code=401)
        
        user_id = session.get('user_id')
        achievements = list(achievements_collection.find({'user_id': user_id}, {'_id': 0, 'user_id': 0}))
        
        for achievement in achievements:
            achievement['id'] = achievement.pop('achievement_id')
        
        return create_response(True, "Achievements retrieved", data={'achievements': achievements})
        
    except Exception as e:
        print(f"Get Achievements Error: {str(e)}")
        return create_response(False, f"Server error: {str(e)}", status_code=500)


@app.route('/api/roadmap', methods=['GET'])
def get_roadmap():
    try:
        if not session.get('logged_in'):
            return create_response(False, "Unauthorized", status_code=401)
        
        user_id = session.get('user_id')
        roadmap_steps = list(roadmap_collection.find({'user_id': user_id}, {'_id': 0, 'user_id': 0}))
        
        for step in roadmap_steps:
            step['id'] = step.pop('step_id')
        
        return create_response(True, "Roadmap retrieved", data={'roadmapSteps': roadmap_steps})
        
    except Exception as e:
        print(f"Get Roadmap Error: {str(e)}")
        return create_response(False, f"Server error: {str(e)}", status_code=500)


@app.route('/api/roadmap/<step_id>/complete', methods=['POST'])
def complete_roadmap_step(step_id):
    try:
        if not session.get('logged_in'):
            return create_response(False, "Unauthorized", status_code=401)
        
        user_id = session.get('user_id')
        
        step = roadmap_collection.find_one({'user_id': user_id, 'step_id': step_id})
        
        if not step:
            return create_response(False, "Roadmap step not found", status_code=404)
        
        if step['completed']:
            return create_response(False, "Step already completed", status_code=400)
        
        roadmap_collection.update_one(
            {'user_id': user_id, 'step_id': step_id},
            {'$set': {'completed': True}}
        )
        
        # Update user XP
        users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$inc': {'xp': step['xp']}}
        )
        
        updated_step = roadmap_collection.find_one({'user_id': user_id, 'step_id': step_id}, {'_id': 0, 'user_id': 0})
        updated_step['id'] = updated_step.pop('step_id')
        
        return create_response(True, "Roadmap step completed", data={'step': updated_step, 'xpGained': step['xp']})
        
    except Exception as e:
        print(f"Complete Roadmap Step Error: {str(e)}")
        return create_response(False, f"Server error: {str(e)}", status_code=500)


@app.route('/api/dashboard', methods=['GET'])
def get_dashboard_data():
    try:
        if not session.get('logged_in'):
            return create_response(False, "Unauthorized", status_code=401)
        
        user_id = session.get('user_id')
        
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        if not user:
            return create_response(False, "User not found", status_code=404)
        
        skills = list(skills_collection.find({'user_id': user_id}, {'_id': 0, 'user_id': 0}))
        courses = list(courses_collection.find({'user_id': user_id}, {'_id': 0, 'user_id': 0}))
        achievements = list(achievements_collection.find({'user_id': user_id}, {'_id': 0, 'user_id': 0}))
        roadmap_steps = list(roadmap_collection.find({'user_id': user_id}, {'_id': 0, 'user_id': 0}))
        
        for skill in skills:
            skill['id'] = skill.pop('skill_id')
        for course in courses:
            course['id'] = course.pop('course_id')
        for achievement in achievements:
            achievement['id'] = achievement.pop('achievement_id')
        for step in roadmap_steps:
            step['id'] = step.pop('step_id')
        
        return create_response(
            True,
            f"Welcome to your dashboard, {user['name']}!",
            data={
                'user': user_to_dict(user),
                'skills': skills,
                'courses': courses,
                'achievements': achievements,
                'roadmapSteps': roadmap_steps
            }
        )
        
    except Exception as e:
        print(f"Dashboard Error: {str(e)}")
        return create_response(False, f"Server error: {str(e)}", status_code=500)

# ============================================================================
# UTILITY ROUTES
# ============================================================================

@app.route('/', methods=['GET'])
def home():
    return create_response(
        True,
        "SkillProgress Dashboard API is running!",
        data={
            'version': '2.0.0',
            'database': DATABASE_NAME,
            'endpoints': {
                'POST /api/signup': 'Register new user',
                'POST /api/login': 'Login existing user',
                'POST /api/logout': 'Logout user',
                'GET /api/me': 'Get current user info',
                'GET /api/dashboard': 'Get all dashboard data',
                'GET /api/skills': 'Get user skills',
                'PUT /api/skills/<id>': 'Update skill progress',
                'GET /api/courses': 'Get user courses',
                'GET /api/achievements': 'Get user achievements',
                'GET /api/roadmap': 'Get user roadmap',
                'POST /api/roadmap/<id>/complete': 'Complete roadmap step'
            }
        }
    )


@app.errorhandler(404)
def not_found(error):
    return create_response(False, "Endpoint not found", status_code=404)


@app.errorhandler(500)
def internal_error(error):
    return create_response(False, "Internal server error", status_code=500)

# ============================================================================
# RUN SERVER
# ============================================================================

if __name__ == '__main__':
    print("\n" + "="*70)
    print("🚀 SkillProgress Dashboard Backend Server Starting...")
    print("="*70)
    print(f"📍 Server running at: http://localhost:8000")
    print(f"📚 API Documentation: http://localhost:8000/")
    print(f"💾 Database: {DATABASE_NAME}")
    print(f"🔌 MongoDB URI: {MONGO_URI}")
    print("="*70)
    print("\n📝 API Endpoints:")
    print("   POST   http://localhost:8000/api/signup")
    print("   POST   http://localhost:8000/api/login")
    print("   POST   http://localhost:8000/api/logout")
    print("   GET    http://localhost:8000/api/me")
    print("   GET    http://localhost:8000/api/dashboard")
    print("   GET    http://localhost:8000/api/skills")
    print("   PUT    http://localhost:8000/api/skills/<id>")
    print("   GET    http://localhost:8000/api/courses")
    print("   GET    http://localhost:8000/api/achievements")
    print("   GET    http://localhost:8000/api/roadmap")
    print("   POST   http://localhost:8000/api/roadmap/<id>/complete")
    print("="*70 + "\n")
    
    app.run(
        host='0.0.0.0',
        port=8000,
        debug=True,
        threaded=True
    )