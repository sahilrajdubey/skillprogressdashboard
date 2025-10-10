from flask import Blueprint, request
from datetime import datetime
from bson.objectid import ObjectId
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.auth_decorator import login_required, get_current_user_id
from utils.helpers import create_response

courses_bp = Blueprint('courses', __name__, url_prefix='/api/courses')

@courses_bp.route('/', methods=['GET'])
def get_all_courses():
    """Get all available courses (public)"""
    try:
        from main import courses_collection
        
        courses = list(courses_collection.find())
        
        for course in courses:
            course['id'] = str(course.pop('_id'))
        
        return create_response(True, f"Found {len(courses)} courses", data={'courses': courses})
    
    except Exception as e:
        return create_response(False, f"Error: {str(e)}", status_code=500)


@courses_bp.route('/user', methods=['GET'])
@login_required
def get_user_courses():
    """Get courses the user is enrolled in"""
    try:
        from main import user_courses_collection, courses_collection
        
        user_id = get_current_user_id()
        
        # Get user's enrolled courses
        user_courses = list(user_courses_collection.find({'user_id': user_id}))
        
        result = []
        for uc in user_courses:
            # Get course details
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
        
        return create_response(True, f"Found {len(result)} enrolled courses", data={'courses': result})
    
    except Exception as e:
        return create_response(False, f"Error: {str(e)}", status_code=500)


@courses_bp.route('/<course_id>/enroll', methods=['POST'])
@login_required
def enroll_course(course_id):
    """Enroll in a course"""
    try:
        from main import user_courses_collection, courses_collection
        
        user_id = get_current_user_id()
        
        # Check if course exists
        course = courses_collection.find_one({'_id': ObjectId(course_id)})
        if not course:
            return create_response(False, "Course not found", status_code=404)
        
        # Check if already enrolled
        existing = user_courses_collection.find_one({
            'user_id': user_id,
            'course_id': course_id
        })
        
        if existing:
            return create_response(False, "Already enrolled in this course", status_code=400)
        
        # Enroll user
        user_courses_collection.insert_one({
            'user_id': user_id,
            'course_id': course_id,
            'progress': 0,
            'completed_lessons': 0,
            'started_at': datetime.utcnow()
        })
        
        return create_response(True, "Enrolled successfully", status_code=201)
    
    except Exception as e:
        return create_response(False, f"Error: {str(e)}", status_code=500)


@courses_bp.route('/<course_id>/progress', methods=['PUT'])
@login_required
def update_progress(course_id):
    """Update course progress"""
    try:
        from main import user_courses_collection, courses_collection, notifications_collection, users_collection, xp_history_collection
        
        data = request.get_json()
        user_id = get_current_user_id()
        
        completed_lessons = data.get('completed_lessons', 0)
        
        # Get course
        course = courses_collection.find_one({'_id': ObjectId(course_id)})
        if not course:
            return create_response(False, "Course not found", status_code=404)
        
        total_lessons = course.get('total_lessons', 1)
        progress = int((completed_lessons / total_lessons) * 100)
        
        # Update progress
        user_courses_collection.update_one(
            {'user_id': user_id, 'course_id': course_id},
            {'$set': {
                'completed_lessons': completed_lessons,
                'progress': progress,
                'updated_at': datetime.utcnow()
            }}
        )
        
        # If course completed, award XP
        if progress >= 100:
            xp_reward = course.get('xp_reward', 500)
            
            # Update user XP
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
                'type': 'course',
                'message': f"🎓 Congratulations! You completed {course['title']}! (+{xp_reward} XP)",
                'read': False,
                'created_at': datetime.utcnow()
            })
            
            # Log XP history
            xp_history_collection.insert_one({
                'user_id': user_id,
                'amount': xp_reward,
                'source_type': 'course',
                'source_id': course_id,
                'description': f"Completed course: {course['title']}",
                'created_at': datetime.utcnow()
            })
        
        return create_response(True, "Progress updated", data={'progress': progress})
    
    except Exception as e:
        return create_response(False, f"Error: {str(e)}", status_code=500)