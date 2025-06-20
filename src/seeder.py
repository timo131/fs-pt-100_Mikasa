from api.models import db, User, Hogar, Finanzas, Pagos, User_pagos, Tareas, Comida, Favoritos_hogar
from flask_sqlalchemy import SQLAlchemy
from app import app
from werkzeug.security import generate_password_hash
from sqlalchemy import text
from datetime import datetime, date

def seed_data():
    
    db.drop_all()
    db.create_all()

    # Crear hogar
    hogar1 = Hogar(hogar_name="Casa Seiglie")
    hogar2 = Hogar(hogar_name="Piso Compartido")
    db.session.add_all([hogar1, hogar2])
    db.session.commit()

    # Crear usuarios
    user1 = User(
        user_name="pepe",
        email="pepe@example.com",
        password=generate_password_hash("pepe123"),
        avatar_url=None,
        admin=True,
        favorito_recetas=[],
        deseado_recetas=[],
        favorito_peliculas=[],
        hogar_id=hogar1.id
    )

    user2 = User(
        user_name="lola",
        email="lola@example.com",
        password=generate_password_hash("pepe123"),
        avatar_url=None,
        admin=False,
        favorito_recetas=[],
        deseado_recetas=[],
        favorito_peliculas=[],
        hogar_id=hogar1.id
    )

    db.session.add_all([user1, user2])
    db.session.commit()

    # Finanzas
    finanza1 = Finanzas(monto=500, user_id=user1.id, hogar_id=hogar1.id)
    finanza2 = Finanzas(monto=300, user_id=user2.id, hogar_id=hogar1.id)
    db.session.add_all([finanza1, finanza2])
    db.session.commit()

    # Pagos
    pago1 = Pagos(
        user_id=user1.id,
        hogar_id=hogar1.id,
        finanzas_id=finanza1.id,
        monto=100,
        descripcion="Compra de supermercado",
        compartido_con="lola",
        categoria="Alimentos",
        frecuencia="mensual",
        fecha_limite=date(2025, 7, 1),
        tipo="gasto",
        fecha=date.today()
    )
    db.session.add(pago1)
    db.session.commit()

    # User_pagos
    user_pago1 = User_pagos(
        user_id=user2.id,
        hogar_id=hogar1.id,
        pagos_id=pago1.id,
        estado=False
    )
    db.session.add(user_pago1)

    # Tareas
    tarea1 = Tareas(
        user_id=user1.id,
        done_by=user2.id,
        hogar_id=hogar1.id,
        tarea="Sacar la basura",
        done=True
    )

    db.session.add(tarea1)

    # Comida
    comida1 = Comida(
        user_id=user1.id,
        hogar_id=hogar1.id,
        recetas={"almuerzo": "arroz con pollo", "cena": "ensalada y sopa"}
    )

    db.session.add(comida1)

    # Favoritos Hogar
    fav1 = Favoritos_hogar(user_id=user1.id, hogar_id=hogar1.id)
    fav2 = Favoritos_hogar(user_id=user2.id, hogar_id=hogar1.id)
    db.session.add_all([fav1, fav2])

    db.session.commit()
    print("✅ Base de datos poblada exitosamente.")

if __name__ == "__main__":
    from app import app  # Asegúrate de importar tu app Flask correctamente
    with app.app_context():
        seed_data()