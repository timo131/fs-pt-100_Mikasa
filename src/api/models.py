from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, DateTime, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "user"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_name: Mapped[str] = mapped_column(
        String(20), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    avatar_url: Mapped[str] = mapped_column(nullable=True)
    admin: Mapped[bool] = mapped_column(Boolean, nullable=False)
    favorito_recetas: Mapped[dict] = mapped_column(JSON, nullable=True)
    favorito_peliculas: Mapped[dict] = mapped_column(JSON, nullable=True)

    hogares = relationship("Hogar", back_populates="user")
    finanzas = relationship("Finanzas", back_populates="user")
    pagos = relationship("Pagos", back_populates="user")
    user_pagos = relationship("User_pagos", back_populates="user")

    tareas = relationship(
        "Tareas",
        back_populates="user",
       
                          foreign_keys="Tareas.user_id"
    )

    tareas_done_by = relationship(
        
        "Tareas",
        back_populates="done_by_user",
        foreign_keys="Tareas.done_by"
    )

    comidas = relationship("Comida", back_populates="user")
    favoritos_hogar = relationship("Favoritos_hogar", back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "hogar_id": self.hogares[0].id if self.hogares else None,
            "email": self.email,
            "user_name": self.user_name,
            "avatar_url": self.avatar_url,
            "admin": self.admin,
            "favorito_receta": self.favorito_recetas,
            "favorito_peliculas": self.favorito_peliculas,

        }


class Hogar (db.Model):
    __tablename__ = "hogar"
    id: Mapped[int] = mapped_column(primary_key=True)
    hogar_name: Mapped[str] = mapped_column(String(80), nullable=False)
    user_id: Mapped[int]= mapped_column(ForeignKey ("user.id"))


    user = relationship("User", back_populates="hogares")
    finanzas = relationship("Finanzas", back_populates="hogar")
    pagos = relationship("Pagos", back_populates="hogar")
    user_pagos = relationship("User_pagos", back_populates="hogar")
    tareas = relationship("Tareas", back_populates="hogar")
    comidas = relationship("Comida", back_populates="hogar")
    favoritos = relationship("Favoritos_hogar", back_populates="hogar")

    def serialize(self):
        return {
            "id": self.id,
            "hogar_name": self.hogar_name,
            "user_id": self.user_id
        }


class Finanzas (db.Model):
    __tablename__ = "finanzas"
    id: Mapped[int] = mapped_column(primary_key=True)
    monto: Mapped[int] = mapped_column(nullable=False)
    fecha: Mapped[datetime] = mapped_column(default=datetime.now)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    hogar_id: Mapped[int] = mapped_column(ForeignKey("hogar.id"))

    user = relationship("User", back_populates="finanzas")
    hogar = relationship("Hogar", back_populates="finanzas")
    pagos = relationship("Pagos", back_populates="finanzas")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "hogar_id": self.hogar_id,
            "monto": self.monto,
            "fecha": self.fecha.isoformat()
        }


class Pagos (db.Model):
    __tablename__ = "pagos"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    hogar_id: Mapped[int] = mapped_column(ForeignKey("hogar.id"))
    finanzas_id: Mapped[int] = mapped_column(ForeignKey("finanzas.id"))
    monto: Mapped[int] = mapped_column(nullable=False)

    user = relationship("User", back_populates="pagos")
    hogar = relationship("Hogar", back_populates="pagos")
    finanzas = relationship("Finanzas", back_populates="pagos")
    user_pagos = relationship("User_pagos", back_populates="pagos")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "hogar_id": self.hogar_id,
            "user_name": self.user.user_name,
            "finanzas_id": self.finanzas_id,
            "monto": self.monto
        }


class User_pagos(db.Model):
    __tablename__ = "user_pagos"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    hogar_id: Mapped[int] = mapped_column(ForeignKey("hogar.id"), nullable=False)
    pagos_id: Mapped[int] = mapped_column(ForeignKey("pagos.id"), nullable=False)
    estado: Mapped[bool] = mapped_column(default=False, nullable=False) 

    user = relationship("User", back_populates="user_pagos")
    hogar = relationship("Hogar", back_populates="user_pagos")
    pagos = relationship("Pagos", back_populates="user_pagos")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "hogar_id": self.hogar_id,
            "pagos_id": self.pagos_id,
            "estado": self.estado,
            "user_name": self.user.user_name,
            "monto": self.pagos.monto,
            "finanzas_id": self.pagos.finanzas_id,
            "fecha": self.pagos.finanzas.fecha.isoformat() if self.pagos.finanzas else None
        }



class Tareas (db.Model):
    __tablename__ = "tareas"
    id: Mapped[int] = mapped_column(primary_key = True)
    user_id: Mapped[int]= mapped_column(ForeignKey ("user.id"))
    done_by: Mapped[int]= mapped_column(ForeignKey("user.id"))
    hogar_id: Mapped[int]= mapped_column(ForeignKey ("hogar.id"))
    tarea: Mapped[str]= mapped_column(nullable = False)
    fecha:Mapped[datetime] = mapped_column( default=datetime.now)
    done: Mapped[bool]= mapped_column(Boolean)

    user = relationship(
        "User",
        back_populates="tareas",
        foreign_keys=[user_id]
    )
    done_by_user = relationship(
        "User",
        back_populates="tareas_done_by",
        foreign_keys=[done_by]
    )
    hogar = relationship("Hogar", back_populates="tareas")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "hogar_id": self.hogar_id,
            "tarea": self.tarea,
            "fecha": self.fecha.isoformat(),
            "done": self.done,
            "done_by": self.done_by
        }


class Comida (db.Model):
    __tablename__ = "comida"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    hogar_id: Mapped[int] = mapped_column(ForeignKey("hogar.id"))
    fecha: Mapped[datetime] = mapped_column(default=datetime.now)
    recetas: Mapped[dict] = mapped_column(JSON)

    user = relationship("User", back_populates="comidas")
    hogar = relationship("Hogar", back_populates="comidas")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "hogar_id": self.hogar_id,
            "fecha": self.fecha.isoformat(),
            "recetas": self.recetas
        }


class Favoritos_hogar (db.Model):
    __tablename__ = "favoritos_hogar"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    hogar_id: Mapped[int] = mapped_column(ForeignKey("hogar.id"))

    user = relationship("User", back_populates="favoritos_hogar")
    hogar = relationship("Hogar", back_populates="favoritos")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "hogar_id": self.hogar_id
        }
