from flask import Flask, request, jsonify, session, redirect, url_for
from flask_cors import CORS
from pymongo import MongoClient, errors
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import re
import os
from bson.objectid import ObjectId

app = Flask(__name__)

app.config['SECRET_KEY'] = 'your-secret-key-change-this-in-production-2025'

# ✅ Updated Cookie Settings for Cross-Origin
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'None'   # Changed from 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False      # Added - False for localhost
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)

MONGO_URI = os.environ.get('MONGO_URI', 'mongodb+srv://sahil5661:sahil1234@cluster0.ezqeu4d.mongodb.net/')
DATABASE_NAME = 'login'
COLLECTION_NAME = 'login'

CORS(app, 
     supports_credentials=True, 
     origins=['http://localhost:3000'],
     allow_headers=['Content-Type', 'Authorization'],
     expose_headers=['Set-Cookie'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
)

# ============================================================================
# DATABASE CONNECTION
# ============================================================================
try:
    mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    mongo_client.server_info()

    db = mongo_client[DATABASE_NAME]
    users_collection = db[COLLECTION_NAME]
    users_collection.create_index('email', unique=True)
    
    # ============================================================================
    # NEW COLLECTIONS FOR SKILLPROGRESS DASHBOARD
    # ============================================================================
    skills_collection = db['skills']
    courses_collection = db['courses']
    user_courses_collection = db['user_courses']
    achievements_collection = db['achievements']
    user_achievements_collection = db['user_achievements']
    roadmaps_collection = db['roadmaps']
    roadmap_steps_collection = db['roadmap_steps']
    notifications_collection = db['notifications']
    xp_history_collection = db['xp_history']

    # Create indexes
    skills_collection.create_index([('user_id', 1)])
    user_courses_collection.create_index([('user_id', 1), ('course_id', 1)])
    notifications_collection.create_index([('user_id', 1), ('created_at', -1)])
    xp_history_collection.create_index([('user_id', 1), ('created_at', -1)])
    
    print("✅ Connected to MongoDB successfully!")
    print("✅ All collections initialized!")
    
except errors.ServerSelectionTimeoutError as err:
    print(f"❌ MongoDB Connection Error: {err}")
    print("Make sure MongoDB is running or check your MONGO_URI")
    exit(1)
except Exception as e:
    print(f"❌ Error: {e}")
    exit(1)

# ============================================================================
# VALIDATION FUNCTIONS (UNCHANGED)
# ============================================================================
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
            'created_at': user.get('created_at', '').isoformat() if isinstance(user.get('created_at'), datetime) else None
        }
    return None

# ============================================================================
# NEW HELPER FUNCTION - LOGIN REQUIRED DECORATOR
# ============================================================================
from functools import wraps

def login_required(f):
    """Decorator to protect routes that require authentication"""
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
    """Get current logged in user ID from session"""
    return session.get('user_id')

# ============================================================================
# AUTHENTICATION ROUTES (UNCHANGED - YOUR ORIGINAL CODE)
# ============================================================================
@app.route('/signup', methods=['POST'])
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
        
        # UPDATED: Added new fields for dashboard features
        new_user = {
            'name': name,
            'email': email,
            'password': hashed_password,
            'total_xp': 0,              # NEW
            'level': 1,                 # NEW
            'current_streak': 0,        # NEW
            'longest_streak': 0,        # NEW
            'last_active_date': datetime.utcnow(),  # NEW
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = users_collection.insert_one(new_user)
        created_user = users_collection.find_one({'_id': result.inserted_id})
        
        session.permanent = True
        session['user_id'] = str(result.inserted_id)
        session['user_email'] = email
        session['user_name'] = name
        session['logged_in'] = True
        
        return create_response(
            True, 
            "Account created successfully! Redirecting to dashboard...",
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


@app.route('/signin', methods=['POST'])
def signin():
    try:
        if session.get('logged_in'):
            return create_response(
                True,
                "Already logged in",
                data={
                    'user': {
                        'name': session.get('user_name'),
                        'email': session.get('user_email')
                    },
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
            "Login successful! Redirecting to dashboard...",
            data={
                'user': user_to_dict(user),
                'redirect': '/dashboard'
            },
            status_code=200
        )
        
    except Exception as e:
        print(f"Signin Error: {str(e)}")
        return create_response(False, f"Server error: {str(e)}", status_code=500)


@app.route('/logout', methods=['POST', 'GET'])
def logout():
    try:
        session.clear()
        return create_response(True, "Logged out successfully", data={'redirect': '/signin'})
    except Exception as e:
        print(f"Logout Error: {str(e)}")
        return create_response(False, f"Logout error: {str(e)}", status_code=500)


@app.route('/dashboard', methods=['GET'])
def dashboard():
    try:
        if not session.get('logged_in'):
            return create_response(
                False, 
                "Unauthorized. Please login first.",
                data={'redirect': './src/app/auth/signin'},
                status_code=401
            )
        
        user_id = session.get('user_id')
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        
        if not user:
            session.clear()
            return create_response(
                False,
                "User not found. Please login again.",
                data={'redirect': './src/app/auth/signin'},
                status_code=401
            )
        
        return create_response(
            True,
            f"Welcome to your dashboard, {user['name']}!",
            data={
                'user': user_to_dict(user),
                'session_info': {
                    'logged_in': True,
                    'user_name': session.get('user_name'),
                    'user_email': session.get('user_email')
                }
            }
        )
        
    except Exception as e:
        print(f"Dashboard Error: {str(e)}")
        return create_response(False, f"Server error: {str(e)}", status_code=500)


@app.route('/check-auth', methods=['GET'])
def check_auth():
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
        print(f"Check Auth Error: {str(e)}")
        return create_response(False, f"Server error: {str(e)}", status_code=500)


@app.route('/', methods=['GET'])
def home():
    return create_response(
        True,
        "Flask + MongoDB Authentication API is running!",
        data={
            'version': '2.0.0',
            'database': DATABASE_NAME,
            'collection': COLLECTION_NAME,
            'endpoints': {
                'POST /signup': 'Register new user',
                'POST /signin': 'Login existing user',
                'POST /logout': 'Logout user',
                'GET /dashboard': 'Protected dashboard (requires auth)',
                'GET /check-auth': 'Check authentication status',
                'GET /users': 'List all users (for testing)',
                'POST /init-db': 'Initialize database with test users',
                'GET /init-sample-data': 'Initialize sample dashboard data (requires login)',
                'GET /api/skills': 'Get user skills',
                'POST /api/skills': 'Create new skill',
                'POST /api/skills/<id>/practice': 'Practice skill and gain XP',
                'GET /api/courses': 'Get all courses',
                'GET /api/courses/user': 'Get enrolled courses',
                'GET /api/roadmaps': 'Get user roadmaps',
                'GET /api/notifications': 'Get notifications',
                'GET /api/stats/overview': 'Get dashboard stats'
            }
        }
    )


@app.route('/users', methods=['GET'])
def get_users():
    try:
        users = list(users_collection.find())
        users_list = [user_to_dict(user) for user in users]
        
        return create_response(
            True,
            f"Found {len(users_list)} users",
            data={'users': users_list}
        )
    except Exception as e:
        return create_response(False, f"Error: {str(e)}", status_code=500)


@app.route('/init-db', methods=['POST', 'GET'])
def init_db():
    try:
        existing_count = users_collection.count_documents({})
        
        if existing_count > 0:
            return create_response(
                True,
                f"Database already initialized with {existing_count} users"
            )
        
        test_users = [
            {
                'name': 'Aditya Srivastava',
                'email': 'aditya@example.com',
                'password': 'password123'
            },
            {
                'name': 'Test User',
                'email': 'test@example.com',
                'password': 'test123'
            },
            {
                'name': 'Demo User',
                'email': 'demo@example.com',
                'password': 'demo123'
            }
        ]
        
        created_users = []
        for user_data in test_users:
            user = {
                'name': user_data['name'],
                'email': user_data['email'],
                'password': generate_password_hash(user_data['password'], method='pbkdf2:sha256'),
                'total_xp': 0,
                'level': 1,
                'current_streak': 0,
                'longest_streak': 0,
                'last_active_date': datetime.utcnow(),
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            }
            users_collection.insert_one(user)
            created_users.append({
                'name': user_data['name'],
                'email': user_data['email'],
                'password': user_data['password']
            })
        
        return create_response(
            True,
            "Database initialized successfully with test users",
            data={
                'created_users': created_users,
                'note': 'Use these credentials to test signin'
            }
        )
        
    except Exception as e:
        return create_response(False, f"Error initializing database: {str(e)}", status_code=500)


@app.route('/delete-all-users', methods=['POST'])
def delete_all_users():
    try:
        result = users_collection.delete_many({})
        return create_response(
            True,
            f"Deleted {result.deleted_count} users",
            data={'deleted_count': result.deleted_count}
        )
    except Exception as e:
        return create_response(False, f"Error: {str(e)}", status_code=500)


# ============================================================================
# NEW ROUTE: INITIALIZE SAMPLE DATA FOR DASHBOARD
# ============================================================================
@app.route('/init-sample-data', methods=['POST', 'GET'])
@login_required
def init_sample_data():
    """Initialize sample data for current user"""
    try:
        user_id = get_current_user_id()
        
        # Update user with sample XP and level
        users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {
                'total_xp': 2847,
                'level': 12,
                'current_streak': 7,
                'longest_streak': 15
            }}
        )
        
        # Create sample courses
        sample_courses = [
            {
                'title': 'React Mastery: Advanced Patterns',
                'category': 'Frontend',
                'thumbnail': '🎯',
                'total_lessons': 45,
                'xp_reward': 500,
                'description': 'Master advanced React patterns',
                'created_at': datetime.utcnow()
            },
            {
                'title': 'TypeScript Deep Dive',
                'category': 'Languages',
                'thumbnail': '📘',
                'total_lessons': 30,
                'xp_reward': 450,
                'description': 'Learn TypeScript from scratch',
                'created_at': datetime.utcnow()
            },
            {
                'title': 'System Design Fundamentals',
                'category': 'Architecture',
                'thumbnail': '🏗️',
                'total_lessons': 25,
                'xp_reward': 800,
                'description': 'Design scalable systems',
                'created_at': datetime.utcnow()
            },
            {
                'title': 'Docker & Kubernetes',
                'category': 'DevOps',
                'thumbnail': '🐳',
                'total_lessons': 40,
                'xp_reward': 600,
                'description': 'Container orchestration',
                'created_at': datetime.utcnow()
            }
        ]
        
        course_ids = []
        for course in sample_courses:
            existing = courses_collection.find_one({'title': course['title']})
            if not existing:
                result = courses_collection.insert_one(course)
                course_ids.append(str(result.inserted_id))
            else:
                course_ids.append(str(existing['_id']))
        
        # Enroll user in courses
        if course_ids:
            # First course - 78% progress
            if not user_courses_collection.find_one({'user_id': user_id, 'course_id': course_ids[0]}):
                user_courses_collection.insert_one({
                    'user_id': user_id,
                    'course_id': course_ids[0],
                    'progress': 78,
                    'completed_lessons': 35,
                    'started_at': datetime.utcnow()
                })
            
            # Second course - 45% progress
            if len(course_ids) > 1 and not user_courses_collection.find_one({'user_id': user_id, 'course_id': course_ids[1]}):
                user_courses_collection.insert_one({
                    'user_id': user_id,
                    'course_id': course_ids[1],
                    'progress': 45,
                    'completed_lessons': 14,
                    'started_at': datetime.utcnow()
                })
            
            # Third course - 92% progress
            if len(course_ids) > 2 and not user_courses_collection.find_one({'user_id': user_id, 'course_id': course_ids[2]}):
                user_courses_collection.insert_one({
                    'user_id': user_id,
                    'course_id': course_ids[2],
                    'progress': 92,
                    'completed_lessons': 23,
                    'started_at': datetime.utcnow()
                })
            
            # Fourth course - 30% progress
            if len(course_ids) > 3 and not user_courses_collection.find_one({'user_id': user_id, 'course_id': course_ids[3]}):
                user_courses_collection.insert_one({
                    'user_id': user_id,
                    'course_id': course_ids[3],
                    'progress': 30,
                    'completed_lessons': 12,
                    'started_at': datetime.utcnow()
                })
        
        # Create sample achievements
        sample_achievements = [
            {
                'title': 'First Steps',
                'description': 'Complete your first course',
                'icon': '🎓',
                'rarity': 'common',
                'criteria': {'type': 'course_completed', 'count': 1},
                'created_at': datetime.utcnow()
            },
            {
                'title': 'Streak Master',
                'description': '7-day learning streak',
                'icon': '🔥',
                'rarity': 'rare',
                'criteria': {'type': 'streak', 'days': 7},
                'created_at': datetime.utcnow()
            },
            {
                'title': 'Code Warrior',
                'description': 'Reach level 10',
                'icon': '⚔️',
                'rarity': 'epic',
                'criteria': {'type': 'level', 'value': 10},
                'created_at': datetime.utcnow()
            },
            {
                'title': 'Knowledge Seeker',
                'description': 'Complete 5 courses',
                'icon': '📚',
                'rarity': 'legendary',
                'criteria': {'type': 'course_completed', 'count': 5},
                'created_at': datetime.utcnow()
            }
        ]
        
        achievement_ids = []
        for achievement in sample_achievements:
            existing = achievements_collection.find_one({'title': achievement['title']})
            if not existing:
                result = achievements_collection.insert_one(achievement)
                achievement_ids.append(str(result.inserted_id))
            else:
                achievement_ids.append(str(existing['_id']))
        
        # Unlock first 4 achievements for user
        for ach_id in achievement_ids:
            if not user_achievements_collection.find_one({'user_id': user_id, 'achievement_id': ach_id}):
                user_achievements_collection.insert_one({
                    'user_id': user_id,
                    'achievement_id': ach_id,
                    'unlocked_at': datetime.utcnow()
                })
        
        # Create sample roadmap
        existing_roadmap = roadmaps_collection.find_one({'user_id': user_id})
        
        if not existing_roadmap:
            roadmap_id = str(roadmaps_collection.insert_one({
                'user_id': user_id,
                'title': 'Frontend Developer Path',
                'description': 'Master modern frontend development',
                'created_at': datetime.utcnow()
            }).inserted_id)
            
            sample_steps = [
                {'title': 'Master React Hooks', 'description': 'Learn all React hooks', 'xp': 100, 'order': 1, 'completed': True},
                {'title': 'Build 3 Projects', 'description': 'Apply your skills', 'xp': 150, 'order': 2, 'completed': True},
                {'title': 'Learn State Management', 'description': 'Redux & Context API', 'xp': 120, 'order': 3, 'completed': True},
                {'title': 'Advanced TypeScript', 'description': 'Generics & Utility Types', 'xp': 180, 'order': 4, 'completed': False},
                {'title': 'Testing & TDD', 'description': 'Jest & React Testing Library', 'xp': 200, 'order': 5, 'completed': False},
                {'title': 'Performance Optimization', 'description': 'Optimize React apps', 'xp': 220, 'order': 6, 'completed': False}
            ]
            
            for step in sample_steps:
                step['roadmap_id'] = roadmap_id
                step['created_at'] = datetime.utcnow()
                if step['completed']:
                    step['completed_at'] = datetime.utcnow()
                roadmap_steps_collection.insert_one(step)
        
        # Add sample skills
        sample_skills = [
            {'name': 'React', 'level': 8, 'xp': 750, 'maxXp': 1000, 'category': 'Frontend', 'color': '#61dafb'},
            {'name': 'TypeScript', 'level': 7, 'xp': 600, 'maxXp': 1000, 'category': 'Languages', 'color': '#3178c6'},
            {'name': 'Node.js', 'level': 6, 'xp': 450, 'maxXp': 1000, 'category': 'Backend', 'color': '#339933'},
            {'name': 'Python', 'level': 9, 'xp': 850, 'maxXp': 1000, 'category': 'Languages', 'color': '#3776ab'},
            {'name': 'Docker', 'level': 5, 'xp': 300, 'maxXp': 1000, 'category': 'DevOps', 'color': '#2496ed'},
            {'name': 'AWS', 'level': 4, 'xp': 200, 'maxXp': 1000, 'category': 'Cloud', 'color': '#ff9900'}
        ]
        
        for skill in sample_skills:
            if not skills_collection.find_one({'user_id': user_id, 'name': skill['name']}):
                skill['user_id'] = user_id
                skill['created_at'] = datetime.utcnow()
                skill['updated_at'] = datetime.utcnow()
                skills_collection.insert_one(skill)
        
        # Add sample notifications
        sample_notifications = [
            {'message': 'New achievement unlocked!', 'type': 'achievement', 'read': False},
            {'message': 'Course "React Mastery" 80% complete', 'type': 'course', 'read': False}
        ]
        
        for notif in sample_notifications:
            notif['user_id'] = user_id
            notif['created_at'] = datetime.utcnow()
            if not notifications_collection.find_one({'user_id': user_id, 'message': notif['message']}):
                notifications_collection.insert_one(notif)
        
        return create_response(True, "Sample data initialized successfully! Refresh your dashboard.", data={
            'skills_added': len(sample_skills),
            'courses_added': len(sample_courses),
            'achievements_unlocked': len(achievement_ids),
            'roadmap_created': True
        })
    
    except Exception as e:
        print(f"Init Sample Data Error: {str(e)}")
        return create_response(False, f"Error: {str(e)}", status_code=500)


# ============================================================================
# ERROR HANDLERS (UNCHANGED)
# ============================================================================
@app.errorhandler(404)
def not_found(error):
    return create_response(False, "Endpoint not found", status_code=404)


@app.errorhandler(500)
def internal_error(error):
    return create_response(False, "Internal server error", status_code=500)


# ============================================================================
# REGISTER BLUEPRINTS FOR NEW FEATURES
# ============================================================================
# ============================================================================
# REGISTER BLUEPRINTS FOR NEW FEATURES
# ============================================================================
try:
    from routes.skills import skills_bp
    from routes.courses import courses_bp
    from routes.roadmaps import roadmaps_bp
    from routes.notifications import notifications_bp
    from routes.stats import stats_bp

    app.register_blueprint(skills_bp)
    app.register_blueprint(courses_bp)
    app.register_blueprint(roadmaps_bp)
    app.register_blueprint(notifications_bp)
    app.register_blueprint(stats_bp)

    print("✅ All API routes registered!")
except ImportError as e:
    print(f"⚠️  Warning: Could not import route blueprints: {e}")
    print("⚠️  Make sure route files exist in backend/routes/ directory")

# ============================================================================
# INLINE API ROUTES (No separate files needed)
# ============================================================================

@app.route('/api/skills', methods=['GET'])
@login_required
def get_skills():
    """Get all skills"""
    try:
        user_id = get_current_user_id()
        skills = list(skills_collection.find({'user_id': user_id}))
        
        for skill in skills:
            skill['id'] = str(skill.pop('_id'))
            skill['user_id'] = str(skill['user_id'])
        
        return create_response(True, f"Found {len(skills)} skills", data={'skills': skills})
    except Exception as e:
        return create_response(False, f"Error: {str(e)}", status_code=500)


@app.route('/api/skills/<skill_id>/practice', methods=['POST'])
@login_required
def practice_skill(skill_id):
    """Practice skill and add XP"""
    try:
        data = request.get_json()
        xp_gain = data.get('xp', 50)
        user_id = get_current_user_id()
        
        # Get skill
        skill = skills_collection.find_one({'_id': ObjectId(skill_id), 'user_id': user_id})
        if not skill:
            return create_response(False, "Skill not found", status_code=404)
        
        # Add XP
        skill['xp'] += xp_gain
        leveled_up = False
        
        while skill['xp'] >= skill['maxXp']:
            skill['xp'] -= skill['maxXp']
            skill['level'] += 1
            leveled_up = True
        
        # Update skill
        skills_collection.update_one(
            {'_id': ObjectId(skill_id)},
            {'$set': {'xp': skill['xp'], 'level': skill['level'], 'updated_at': datetime.utcnow()}}
        )
        
        # Update user XP
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        new_total_xp = user.get('total_xp', 0) + xp_gain
        new_level = (new_total_xp // 300) + 1
        
        users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {'total_xp': new_total_xp, 'level': new_level}}
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
        
        skill['id'] = str(skill.pop('_id'))
        skill['user_id'] = str(skill['user_id'])
        
        return create_response(True, "XP added", data={
            'skill': skill,
            'user': {'total_xp': new_total_xp, 'level': new_level},
            'leveled_up': leveled_up
        })
    except Exception as e:
        return create_response(False, f"Error: {str(e)}", status_code=500)


@app.route('/api/courses/user', methods=['GET'])
@login_required
def get_user_courses():
    """Get user's enrolled courses"""
    try:
        user_id = get_current_user_id()
        user_courses = list(user_courses_collection.find({'user_id': user_id}))
        
        result = []
        for uc in user_courses:
            course = courses_collection.find_one({'_id': ObjectId(uc['course_id'])})
            if course:
                course['id'] = str(course.pop('_id'))
                course['progress'] = uc.get('progress', 0)
                course['completedLessons'] = uc.get('completed_lessons', 0)
                course['lessons'] = course.get('total_lessons', 0)
                course['xpReward'] = course.get('xp_reward', 0)
                course['thumbnail'] = course.get('thumbnail', '📚')
                course['category'] = course.get('category', 'General')
                result.append(course)
        
        return create_response(True, f"Found {len(result)} courses", data={'courses': result})
    except Exception as e:
        return create_response(False, f"Error: {str(e)}", status_code=500)


@app.route('/api/roadmaps', methods=['GET'])
@login_required
def get_roadmaps():
    """Get user's roadmaps with steps"""
    try:
        user_id = get_current_user_id()
        roadmaps = list(roadmaps_collection.find({'user_id': user_id}))
        
        for roadmap in roadmaps:
            roadmap_id = str(roadmap['_id'])
            roadmap['id'] = roadmap_id
            roadmap.pop('_id')
            roadmap['user_id'] = str(roadmap['user_id'])
            
            # Get steps
            steps = list(roadmap_steps_collection.find({'roadmap_id': roadmap_id}))
            for step in steps:
                step['id'] = str(step.pop('_id'))
                step.pop('roadmap_id', None)
            
            roadmap['steps'] = sorted(steps, key=lambda x: x.get('order', 0))
        
        return create_response(True, f"Found {len(roadmaps)} roadmaps", data={'roadmaps': roadmaps})
    except Exception as e:
        return create_response(False, f"Error: {str(e)}", status_code=500)


@app.route('/api/roadmaps/<roadmap_id>/steps/<step_id>/complete', methods=['PUT'])
@login_required
def complete_step(roadmap_id, step_id):
    """Complete a roadmap step"""
    try:
        user_id = get_current_user_id()
        
        step = roadmap_steps_collection.find_one({'_id': ObjectId(step_id)})
        if not step:
            return create_response(False, "Step not found", status_code=404)
        
        if step.get('completed'):
            return create_response(False, "Step already completed", status_code=400)
        
        # Mark as completed
        roadmap_steps_collection.update_one(
            {'_id': ObjectId(step_id)},
            {'$set': {'completed': True, 'completed_at': datetime.utcnow()}}
        )
        
        # Award XP
        xp_reward = step.get('xp', 100)
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        new_total_xp = user.get('total_xp', 0) + xp_reward
        new_level = (new_total_xp // 300) + 1
        
        users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {'total_xp': new_total_xp, 'level': new_level}}
        )
        
        # Create notification
        notifications_collection.insert_one({
            'user_id': user_id,
            'type': 'achievement',
            'message': f"✅ Completed: {step['title']} (+{xp_reward} XP)",
            'read': False,
            'created_at': datetime.utcnow()
        })
        
        return create_response(True, "Step completed!", data={
            'user': {'total_xp': new_total_xp, 'level': new_level},
            'xp_gained': xp_reward
        })
    except Exception as e:
        return create_response(False, f"Error: {str(e)}", status_code=500)


@app.route('/api/notifications', methods=['GET'])
@login_required
def get_notifications():
    """Get user notifications"""
    try:
        user_id = get_current_user_id()
        notifications = list(notifications_collection.find({'user_id': user_id}).sort('created_at', -1).limit(50))
        
        for notif in notifications:
            notif['id'] = str(notif.pop('_id'))
            notif.pop('user_id', None)
        
        return create_response(True, f"Found {len(notifications)} notifications", data={'notifications': notifications})
    except Exception as e:
        return create_response(False, f"Error: {str(e)}", status_code=500)


@app.route('/api/stats/overview', methods=['GET'])
@login_required
def get_stats():
    """Get dashboard stats"""
    try:
        user_id = get_current_user_id()
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        
        skills_count = skills_collection.count_documents({'user_id': user_id})
        courses_count = user_courses_collection.count_documents({'user_id': user_id})
        
        # Get achievements
        user_achievement_ids = [ua['achievement_id'] for ua in user_achievements_collection.find({'user_id': user_id})]
        achievements = []
        
        if user_achievement_ids:
            achievements = list(achievements_collection.find({'_id': {'$in': [ObjectId(id) for id in user_achievement_ids]}}))
            for achievement in achievements:
                achievement['id'] = str(achievement.pop('_id'))
        
        return create_response(True, "Stats retrieved", data={
            'totalXP': user.get('total_xp', 0),
            'level': user.get('level', 1),
            'current_streak': user.get('current_streak', 0),
            'skills_count': skills_count,
            'courses_count': courses_count,
            'achievements': achievements
        })
    except Exception as e:
        return create_response(False, f"Error: {str(e)}", status_code=500)


print("✅ All inline API routes registered!")




# ============================================================================
# START SERVER
# ============================================================================
if __name__ == '__main__':
    print("\n" + "="*70)
    print("🚀 Flask + MongoDB SkillProgress Backend Server Starting...")
    print("="*70)
    print(f"📍 Server running at: http://localhost:8000")
    print(f"📚 API Documentation: http://localhost:8000/")
    print(f"🔐 Initialize DB: http://localhost:8000/init-db")
    print(f"🎯 Initialize Sample Data: http://localhost:8000/init-sample-data (after login)")
    print(f"💾 Database: {DATABASE_NAME}")
    print(f"📦 Main Collection: {COLLECTION_NAME}")
    print(f"🔌 MongoDB URI: {MONGO_URI[:50]}...")
    print("="*70)
    print("\n📋 Available Endpoints:")
    print("  Auth: /signup, /signin, /logout, /check-auth")
    print("  Skills: /api/skills (GET, POST)")
    print("  Courses: /api/courses, /api/courses/user")
    print("  Roadmaps: /api/roadmaps")
    print("  Notifications: /api/notifications")
    print("  Stats: /api/stats/overview")
    print("="*70 + "\n")
    
    app.run(
        host='0.0.0.0',
        port=8000,
        debug=True,
        threaded=True
    )