"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import select



api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200









@api.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        print("Received data:", data)

        if not data.get('email') or not data.get('password'):
            return jsonify({"error": "Missing email or password"}), 400

        stm = select(User).where(User.email == data['email'])
        existing_user = db.session.execute(stm).scalars().first()

        if existing_user:
            return jsonify({"error": "Email already taken"}), 400
        hashed_password  = generate_password_hash(data['password'])


        new_user = User(
            email=data['email'],
            password=hashed_password,
            is_active=True
        )

        db.session.add(new_user)
        db.session.commit()

        token = create_access_token(identity=str(new_user.id))

        return jsonify({"msg": "register ok", "token": token}), 200

    except Exception as e:
        print("Register error:", e)
        db.session.rollback()
        return jsonify({"error": "something went wrong"}), 400
@api.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print("Received data:", data)

        if not data.get('email') or not data.get('password'):
            return jsonify({"error": "Missing email or password"}), 400

        stm = select(User).where(User.email == data['email'])
        user = db.session.execute(stm).scalars().first()

        if not user:
            return jsonify({"error": "Email not found"}), 404

        if not check_password_hash(user.password, data['password']):
            return jsonify({"success": False, "msg": "email/password wrong"})

        token = create_access_token(identity=str(user.id))

        return jsonify({"msg": "login ok", "token": token}), 200 

    except Exception as e:
        print("Login error:", e)
        db.session.rollback()
        return jsonify({"error": "Something went wrong"}), 400
    
@api.route('/private', methods=['GET'])
@jwt_required() 
def get_user_inf():
    try:
        id = get_jwt_identity()
        
        stm = select(User).where(User.id == id)
        user = db.session.execute(stm).scalar_one_or_none()
        if not user:
            return jsonify({"msg": "What"}), 418
        
        return jsonify(user.serialize())
    except Exception as e:
        print(e)
        return jsonify({"error": "something went wrong"})