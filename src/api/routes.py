"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Hogar, Finanzas, Pagos, User_pagos, Tareas, Comida, Favoritos_hogar
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import select


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)



@api.route("/users", methods=["GET"])
@jwt_required()
def get_all_users():
    stm = select(User)
    users = db.session.execute(stm).scalars().all()
    return jsonify([u.serialize() for u in users]), 200

@api.route("/users/<int:user_id>", methods=["GET"])
@jwt_required()
def get_user(user_id):
    stm = select(User).where(User.id == user_id)
    user = db.session.execute(stm).scalar_one_or_none()
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify(user.serialize()), 200

@api.route("/users", methods=["POST"])
@jwt_required()
def create_user():
    data = request.get_json()
    try:
        user = User(
            user_name=data.get("user_name"),
            email=data.get("email"),
            password=data.get("password"),
            favorito_recetas=data.get("favorito_recetas"),
            favorito_peliculas=data.get("favorito_peliculas"),
        )
        db.session.add(user)
        db.session.commit()
        return jsonify(user.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating user"}), 500

@api.route("/users", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    data = request.get_json()
    stm = select(User).where(User.id == user_id)
    user = db.session.execute(stm).scalar_one_or_none()
    if not user:
        return jsonify({"message": "User not found"}), 404
    try:
        user.user_name = data.get("user_name", user.user_name)
        user.email = data.get("email", user.email)
        user.password = data.get("password", user.password)
        user.favorito_recetas = data.get("favorito_recetas", user.favorito_recetas)
        user.favorito_peliculas = data.get("favorito_peliculas", user.favorito_peliculas)
        db.session.commit()
        return jsonify(user.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating user"}), 500

@api.route("/users/", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    stm = select(User).where(User.id == user_id)
    user = db.session.execute(stm).scalar_one_or_none()
    if not user:
        return jsonify({"message": "User not found"}), 404
    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting user"}), 500


@api.route("/hogares", methods=["GET"])
@jwt_required()
def get_all_hogares():
    stm = select(Hogar)
    hogares = db.session.execute(stm).scalars().all()
    return jsonify([h.serialize() for h in hogares]), 200

@api.route("/hogares/<int:hogar_id>", methods=["GET"])
@jwt_required()
def get_hogar(hogar_id):
    stm = select(Hogar).where(Hogar.id == hogar_id)
    hogar = db.session.execute(stm).scalar_one_or_none()
    if not hogar:
        return jsonify({"message": "Hogar not found"}), 404
    return jsonify(hogar.serialize()), 200

@api.route("/hogares", methods=["POST"])
@jwt_required()
def create_hogar():
    data = request.get_json()
    try:
        user_id = get_jwt_identity()
        hogar = Hogar(
            hogar_name=data.get("hogar_name"),
            user_id=user_id
        )
        db.session.add(hogar)
        db.session.commit()
        return jsonify(hogar.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating hogar"}), 500

@api.route("/hogares/<int:hogar_id>", methods=["PUT"])
@jwt_required()
def update_hogar(hogar_id):
    data = request.get_json()
    stm = select(Hogar).where(Hogar.id == hogar_id)
    hogar = db.session.execute(stm).scalar_one_or_none()
    if not hogar:
        return jsonify({"message": "Hogar not found"}), 404
    try:
        user_id = get_jwt_identity()
        hogar.hogar_name = data.get("hogar_name", hogar.hogar_name)
        hogar.user_id = user_id  # Actualizamos con el user_id del token
        db.session.commit()
        return jsonify(hogar.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating hogar"}), 500

@api.route("/hogares/<int:hogar_id>", methods=["DELETE"])
@jwt_required()
def delete_hogar(hogar_id):
    stm = select(Hogar).where(Hogar.id == hogar_id)
    hogar = db.session.execute(stm).scalar_one_or_none()
    if not hogar:
        return jsonify({"message": "Hogar not found"}), 404
    try:
        db.session.delete(hogar)
        db.session.commit()
        return jsonify({"message": "Hogar deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting hogar"}), 500


@api.route("/finanzas", methods=["GET"])
@jwt_required()
def get_all_finanzas():
    stm = select(Finanzas)
    finanzas = db.session.execute(stm).scalars().all()
    return jsonify([f.serialize() for f in finanzas]), 200

@api.route("/finanzas/<int:finanza_id>", methods=["GET"])
@jwt_required()
def get_finanza(finanza_id):
    stm = select(Finanzas).where(Finanzas.id == finanza_id)
    finanza = db.session.execute(stm).scalar_one_or_none()
    if not finanza:
        return jsonify({"message": "Finanza not found"}), 404
    return jsonify(finanza.serialize()), 200

@api.route("/finanzas", methods=["POST"])
@jwt_required()
def create_finanza():
    data = request.get_json()
    try:
        user_id = get_jwt_identity()
        finanza = Finanzas(
            monto=data.get("monto"),
            user_id=user_id,
            hogar_id=data.get("hogar_id"),
            fecha=data.get("fecha")
        )
        db.session.add(finanza)
        db.session.commit()
        return jsonify(finanza.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating finanza"}), 500

@api.route("/finanzas/<int:finanza_id>", methods=["PUT"])
@jwt_required()
def update_finanza(finanza_id):
    data = request.get_json()
    stm = select(Finanzas).where(Finanzas.id == finanza_id)
    finanza = db.session.execute(stm).scalar_one_or_none()
    if not finanza:
        return jsonify({"message": "Finanza not found"}), 404
    try:
        user_id = get_jwt_identity()
        finanza.monto = data.get("monto", finanza.monto)
        finanza.user_id = user_id
        finanza.hogar_id = data.get("hogar_id", finanza.hogar_id)
        finanza.fecha = data.get("fecha", finanza.fecha)
        db.session.commit()
        return jsonify(finanza.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating finanza"}), 500

@api.route("/finanzas/<int:finanza_id>", methods=["DELETE"])
@jwt_required()
def delete_finanza(finanza_id):
    stm = select(Finanzas).where(Finanzas.id == finanza_id)
    finanza = db.session.execute(stm).scalar_one_or_none()
    if not finanza:
        return jsonify({"message": "Finanza not found"}), 404
    try:
        db.session.delete(finanza)
        db.session.commit()
        return jsonify({"message": "Finanza deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting finanza"}), 500


@api.route("/pagos", methods=["GET"])
@jwt_required()
def get_all_pagos():
    stm = select(Pagos)
    pagos = db.session.execute(stm).scalars().all()
    return jsonify([p.serialize() for p in pagos]), 200

@api.route("/pagos/<int:pago_id>", methods=["GET"])
@jwt_required()
def get_pago(pago_id):
    stm = select(Pagos).where(Pagos.id == pago_id)
    pago = db.session.execute(stm).scalar_one_or_none()
    if not pago:
        return jsonify({"message": "Pago not found"}), 404
    return jsonify(pago.serialize()), 200

@api.route("/pagos", methods=["POST"])
@jwt_required()
def create_pago():
    data = request.get_json()
    try:
        user_id = get_jwt_identity()
        pago = Pagos(
            tipo=data.get("tipo"),
            monto=data.get("monto"),
            fecha=data.get("fecha"),
            hogar_id=data.get("hogar_id"),
            user_id=user_id
        )
        db.session.add(pago)
        db.session.commit()
        return jsonify(pago.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating pago"}), 500

@api.route("/pagos/<int:pago_id>", methods=["PUT"])
@jwt_required()
def update_pago(pago_id):
    data = request.get_json()
    stm = select(Pagos).where(Pagos.id == pago_id)
    pago = db.session.execute(stm).scalar_one_or_none()
    if not pago:
        return jsonify({"message": "Pago not found"}), 404
    try:
        user_id = get_jwt_identity()
        pago.tipo = data.get("tipo", pago.tipo)
        pago.monto = data.get("monto", pago.monto)
        pago.fecha = data.get("fecha", pago.fecha)
        pago.hogar_id = data.get("hogar_id", pago.hogar_id)
        pago.user_id = user_id
        db.session.commit()
        return jsonify(pago.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating pago"}), 500

@api.route("/pagos/<int:pago_id>", methods=["DELETE"])
@jwt_required()
def delete_pago(pago_id):
    stm = select(Pagos).where(Pagos.id == pago_id)
    pago = db.session.execute(stm).scalar_one_or_none()
    if not pago:
        return jsonify({"message": "Pago not found"}), 404
    try:
        db.session.delete(pago)
        db.session.commit()
        return jsonify({"message": "Pago deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting pago"}), 500


@api.route("/user_pagos", methods=["GET"])
@jwt_required()
def get_all_user_pagos():
    stm = select(User_pagos)
    user_pagos = db.session.execute(stm).scalars().all()
    return jsonify([up.serialize() for up in user_pagos]), 200

@api.route("/user_pagos/<int:user_pago_id>", methods=["GET"])
@jwt_required()
def get_user_pago(user_pago_id):
    stm = select(User_pagos).where(User_pagos.id == user_pago_id)
    user_pago = db.session.execute(stm).scalar_one_or_none()
    if not user_pago:
        return jsonify({"message": "User_pago not found"}), 404
    return jsonify(user_pago.serialize()), 200

@api.route("/user_pagos", methods=["POST"])
@jwt_required()
def create_user_pago():
    data = request.get_json()
    try:
        user_id = get_jwt_identity()
        user_pago = User_pagos(
            user_id=user_id,
            pago_id=data.get("pago_id"),
            estado=data.get("estado")
        )
        db.session.add(user_pago)
        db.session.commit()
        return jsonify(user_pago.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating user_pago"}), 500

@api.route("/user_pagos/<int:user_pago_id>", methods=["PUT"])
@jwt_required()
def update_user_pago(user_pago_id):
    data = request.get_json()
    stm = select(User_pagos).where(User_pagos.id == user_pago_id)
    user_pago = db.session.execute(stm).scalar_one_or_none()
    if not user_pago:
        return jsonify({"message": "User_pago not found"}), 404
    try:
        user_id = get_jwt_identity()
        user_pago.user_id = user_id
        user_pago.pago_id = data.get("pago_id", user_pago.pago_id)
        user_pago.estado = data.get("estado", user_pago.estado)
        db.session.commit()
        return jsonify(user_pago.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating user_pago"}), 500

@api.route("/user_pagos/<int:user_pago_id>", methods=["DELETE"])
@jwt_required()
def delete_user_pago(user_pago_id):
    stm = select(User_pagos).where(User_pagos.id == user_pago_id)
    user_pago = db.session.execute(stm).scalar_one_or_none()
    if not user_pago:
        return jsonify({"message": "User_pago not found"}), 404
    try:
        db.session.delete(user_pago)
        db.session.commit()
        return jsonify({"message": "User_pago deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting user_pago"}), 500


@api.route("/tareas", methods=["GET"])
@jwt_required()
def get_all_tareas():
    stm = select(Tareas)
    tareas = db.session.execute(stm).scalars().all()
    return jsonify([t.serialize() for t in tareas]), 200

@api.route("/tareas/<int:tarea_id>", methods=["GET"])
@jwt_required()
def get_tarea(tarea_id):
    stm = select(Tareas).where(Tareas.id == tarea_id)
    tarea = db.session.execute(stm).scalar_one_or_none()
    if not tarea:
        return jsonify({"message": "Tarea not found"}), 404
    return jsonify(tarea.serialize()), 200

@api.route("/tareas", methods=["POST"])
@jwt_required()
def create_tarea():
    data = request.get_json()
    try:
        user_id = get_jwt_identity()
        tarea = Tareas(
            tarea_name=data.get("tarea_name"),
            hogar_id=data.get("hogar_id"),
            user_id=user_id,
            estado=data.get("estado")
        )
        db.session.add(tarea)
        db.session.commit()
        return jsonify(tarea.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating tarea"}), 500

@api.route("/tareas/<int:tarea_id>", methods=["PUT"])
@jwt_required()
def update_tarea(tarea_id):
    data = request.get_json()
    stm = select(Tareas).where(Tareas.id == tarea_id)
    tarea = db.session.execute(stm).scalar_one_or_none()
    if not tarea:
        return jsonify({"message": "Tarea not found"}), 404
    try:
        user_id = get_jwt_identity()
        tarea.tarea_name = data.get("tarea_name", tarea.tarea_name)
        tarea.hogar_id = data.get("hogar_id", tarea.hogar_id)
        tarea.user_id = user_id
        tarea.estado = data.get("estado", tarea.estado)
        db.session.commit()
        return jsonify(tarea.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating tarea"}), 500

@api.route("/tareas/<int:tarea_id>", methods=["DELETE"])
@jwt_required()
def delete_tarea(tarea_id):
    stm = select(Tareas).where(Tareas.id == tarea_id)
    tarea = db.session.execute(stm).scalar_one_or_none()
    if not tarea:
        return jsonify({"message": "Tarea not found"}), 404
    try:
        db.session.delete(tarea)
        db.session.commit()
        return jsonify({"message": "Tarea deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting tarea"}), 500


@api.route("/comida", methods=["GET"])
@jwt_required()
def get_all_comida():
    stm = select(Comida)
    comida = db.session.execute(stm).scalars().all()
    return jsonify([c.serialize() for c in comida]), 200

@api.route("/comida/<int:comida_id>", methods=["GET"])
@jwt_required()
def get_comida(comida_id):
    stm = select(Comida).where(Comida.id == comida_id)
    comida = db.session.execute(stm).scalar_one_or_none()
    if not comida:
        return jsonify({"message": "Comida not found"}), 404
    return jsonify(comida.serialize()), 200

@api.route("/comida", methods=["POST"])
@jwt_required()
def create_comida():
    data = request.get_json()
    try:
        user_id = get_jwt_identity()
        comida = Comida(
            comida_name=data.get("comida_name"),
            descripcion=data.get("descripcion"),
            fecha=data.get("fecha"),
            hogar_id=data.get("hogar_id"),
            user_id=user_id
        )
        db.session.add(comida)
        db.session.commit()
        return jsonify(comida.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating comida"}), 500

@api.route("/comida/<int:comida_id>", methods=["PUT"])
@jwt_required()
def update_comida(comida_id):
    data = request.get_json()
    stm = select(Comida).where(Comida.id == comida_id)
    comida = db.session.execute(stm).scalar_one_or_none()
    if not comida:
        return jsonify({"message": "Comida not found"}), 404
    try:
        user_id = get_jwt_identity()
        comida.comida_name = data.get("comida_name", comida.comida_name)
        comida.descripcion = data.get("descripcion", comida.descripcion)
        comida.fecha = data.get("fecha", comida.fecha)
        comida.hogar_id = data.get("hogar_id", comida.hogar_id)
        comida.user_id = user_id
        db.session.commit()
        return jsonify(comida.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating comida"}), 500

@api.route("/comida/<int:comida_id>", methods=["DELETE"])
@jwt_required()
def delete_comida(comida_id):
    stm = select(Comida).where(Comida.id == comida_id)
    comida = db.session.execute(stm).scalar_one_or_none()
    if not comida:
        return jsonify({"message": "Comida not found"}), 404
    try:
        db.session.delete(comida)
        db.session.commit()
        return jsonify({"message": "Comida deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting comida"}), 500


@api.route("/favoritos_hogar", methods=["GET"])
@jwt_required()
def get_all_favoritos_hogar():
    stm = select(Favoritos_hogar)
    favoritos = db.session.execute(stm).scalars().all()
    return jsonify([f.serialize() for f in favoritos]), 200

@api.route("/favoritos_hogar/<int:favorito_id>", methods=["GET"])
@jwt_required()
def get_favorito_hogar(favorito_id):
    stm = select(Favoritos_hogar).where(Favoritos_hogar.id == favorito_id)
    favorito = db.session.execute(stm).scalar_one_or_none()
    if not favorito:
        return jsonify({"message": "Favorito not found"}), 404
    return jsonify(favorito.serialize()), 200

@api.route("/favoritos_hogar", methods=["POST"])
@jwt_required()
def create_favorito_hogar():
    data = request.get_json()
    try:
        user_id = get_jwt_identity()
        favorito = Favoritos_hogar(
            hogar_id=data.get("hogar_id"),
            user_id=user_id
        )
        db.session.add(favorito)
        db.session.commit()
        return jsonify(favorito.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating favorito"}), 500

@api.route("/favoritos_hogar/<int:favorito_id>", methods=["DELETE"])
@jwt_required()
def delete_favorito_hogar(favorito_id):
    stm = select(Favoritos_hogar).where(Favoritos_hogar.id == favorito_id)
    favorito = db.session.execute(stm).scalar_one_or_none()
    if not favorito:
        return jsonify({"message": "Favorito not found"}), 404
    try:
        db.session.delete(favorito)
        db.session.commit()
        return jsonify({"message": "Favorito deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting favorito"}), 500








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