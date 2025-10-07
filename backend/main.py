
from flask import Flask, request, jsonify, session, redirect, url_for
from flask_cors import CORS
from pymongo import MongoClient, errors
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import re
import os


app = Flask(__name__)

app.config['SECRET_KEY'] = 'your-secret-key-change-this-in-production-2025'


app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)

MONGO_URI = os.environ.get('MONGO_URI', 'mongodb+srv://sahil5661:sahil1234@cluster0.ezqeu4d.mongodb.net/')
DATABASE_NAME = 'login'
COLLECTION_NAME = 'login'


CORS(app, supports_credentials=True, origins=['http://localhost:3000', 'http://localhost:3001'])


try:

    mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    

    mongo_client.server_info()

    db = mongo_client[DATABASE_NAME]
    users_collection = db[COLLECTION_NAME]

    users_collection.create_index('email', unique=True)
    
    print("✅ Connected to MongoDB successfully!")
    
except errors.ServerSelectionTimeoutError as err:
    print(f"❌ MongoDB Connection Error: {err}")
    print("Make sure MongoDB is running on localhost:27017")
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
            'created_at': user.get('created_at', '').isoformat() if isinstance(user.get('created_at'), datetime) else None
        }
    return None



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
  
        new_user = {
            'name': name,
            'email': email,
            'password': hashed_password,
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
        
        # Return success response
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
        # Clear all session data
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
        
       
        from bson.objectid import ObjectId
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
        
        
        from bson.objectid import ObjectId
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
            'version': '1.0.0',
            'database': DATABASE_NAME,
            'collection': COLLECTION_NAME,
            'endpoints': {
                'POST /signup': 'Register new user',
                'POST /signin': 'Login existing user',
                'POST /logout': 'Logout user',
                'GET /dashboard': 'Protected dashboard (requires auth)',
                'GET /check-auth': 'Check authentication status',
                'GET /users': 'List all users (for testing)',
                'POST /init-db': 'Initialize database with test users'
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
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            }
            users_collection.insert_one(user)
            created_users.append({
                'name': user_data['name'],
                'email': user_data['email'],
                'password': user_data['password']  # Only for testing!
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




@app.errorhandler(404)
def not_found(error):
 
    return create_response(False, "Endpoint not found", status_code=404)


@app.errorhandler(500)
def internal_error(error):
   
    return create_response(False, "Internal server error", status_code=500)




if __name__ == '__main__':
    # Print startup information
    print("\n" + "="*70)
    print("🚀 Flask + MongoDB Authentication Backend Server Starting...")
    print("="*70)
    print(f"📍 Server running at: http://localhost:5000")
    print(f"📚 API Documentation: http://localhost:5000/")
    print(f"🔐 Initialize DB: http://localhost:5000/init-db")
    print(f"💾 Database: {DATABASE_NAME}")
    print(f"📦 Collection: {COLLECTION_NAME}")
    print(f"🔌 MongoDB URI: {MONGO_URI}")
    print("="*70 + "\n")
    
   
    app.run(
        host='0.0.0.0',
        port=8000,
        debug=True,  
        threaded=True
    )