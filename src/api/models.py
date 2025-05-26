from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, DateTime, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column,relationship
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "user"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_name: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    favorito_recetas: Mapped[dict] = mapped_column(JSON, nullable=True)
    favorito_peliculas: Mapped[dict] = mapped_column(JSON, nullable=True)
    
    
    hogares = relationship(back_populates="user")
    finanzas = relationship(back_populates="user")
    pagos = relationship(back_populates="user")
    user_pagos = relationship(back_populates="user")
    tareas = relationship(back_populates="user", foreign_keys="Tareas.userId")
    tareas_dom_by = relationship(back_populates="dom_by_user", foreign_keys="Tareas.dom_by")
    comidas = relationship(back_populates="user")
    favoritos_hogar = relationship(back_populates="user")
    
    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "user_name": self.user_name,
            "favorito_receta": self.favorito_recetas,
            "favorito_peliculas": self.favorito_peliculas,
        }

class Hogar (db.Model):
    __tablename__ = "hogar"
    id: Mapped[int] = mapped_column(primary_key=True)
    hogar_name: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    userId: Mapped[int]= mapped_column(ForeignKey ("user.id"))


    user = relationship(back_populates="hogares")
    finanzas = relationship(back_populates="hogar")
    pagos = relationship(back_populates="hogar")
    user_pagos = relationship(back_populates="hogar")
    tareas = relationship(back_populates="hogar")
    comidas = relationship(back_populates="hogar")
    favoritos = relationship(back_populates="hogar")
    
    def serialize(self):
        return {
            "id": self.id,
            "hogar_name": self.hogar_name,
            "userId": self.userId
        }
    
class Finanzas (db.Model):
    __tablename__ = "finanzas"
    id: Mapped[int] = mapped_column(primary_key=True)
    monto: Mapped[int] = mapped_column(nullable=False)
    fecha:Mapped[datetime] = mapped_column( default=datetime.now)
    userId: Mapped[int]= mapped_column(ForeignKey ("user.id"))
    hogarId: Mapped[int]= mapped_column(ForeignKey ("hogar.id"))


    user = relationship(back_populates="finanzas")
    hogar = relationship(back_populates="finanzas")
    pagos = relationship(back_populates="finanzas")
    
    def serialize(self):
        return {
            "id": self.id,
            "userId": self.userId,
            "hogarId": self.hogarId,
            "monto": self.monto,
            "fecha": self.fecha.isoformat()
        }
    
class Pagos (db.Model):
    __tablename__ = "pagos"
    id: Mapped[int] = mapped_column(primary_key = True)
    userId: Mapped[int]= mapped_column(ForeignKey ("user.id"))
    hogarId: Mapped[int]= mapped_column(ForeignKey ("hogar.id"))
    finanzasId: Mapped[int]= mapped_column(ForeignKey("finanzas.id"))
    monto: Mapped[int]= mapped_column(nullable = False)

    user = relationship(back_populates="pagos")
    hogar = relationship(back_populates="pagos")
    finanzas = relationship(back_populates="pagos")
    user_pagos = relationship(back_populates="pagos")
    
    def serialize(self):
        return {
            "id": self.id,
            "userId": self.userId,
            "hogarId": self.hogarId,
            "finanzasId": self.finanzasId,
            "monto": self.monto
        }


class UserPagos (db.Model):
    __tablename__ = "userPagos"
    id: Mapped[int] = mapped_column(primary_key = True)
    userId: Mapped[int]= mapped_column(ForeignKey ("user.id"))
    hogarId: Mapped[int]= mapped_column(ForeignKey ("hogar.id"))
    pagosId: Mapped[int]= mapped_column(ForeignKey("pagos.id"))

    user = relationship(back_populates="user_pagos")
    hogar = relationship(back_populates="user_pagos")
    pagos = relationship(back_populates="user_pagos")

    def serialize(self):
        return {
            "id": self.id,
            "userId": self.userId,
            "hogarId": self.hogarId,
            "pagosId": self.pagosId
        }

class Tareas (db.Model):
    __tablename__ = "tareas"
    id: Mapped[int] = mapped_column(primary_key = True)
    userId: Mapped[int]= mapped_column(ForeignKey ("user.id"))
    hogarId: Mapped[int]= mapped_column(ForeignKey ("hogar.id"))
    tarea: Mapped[str]= mapped_column(nullable = False)
    fecha:Mapped[datetime] = mapped_column( default=datetime.now)
    dom: Mapped[bool]= mapped_column(Boolean)
    dom_by: Mapped[int]= mapped_column(ForeignKey("user.id"))

    user = relationship(back_populates="tareas")
    hogar = relationship(back_populates="tareas")
    dom_by_user = relationship(back_populates="tareas_dom_by")

    def serialize(self):
        return {
            "id": self.id,
            "userId": self.userId,
            "hogarId": self.hogarId,
            "tarea": self.tarea,
            "fecha": self.fecha.isoformat(),
            "dom": self.dom,
            "domBy": self.domBy
        }


class Comida (db.Model):
    __tablename__ = "comida"
    id: Mapped[int]= mapped_column(primary_key=True)
    userId: Mapped[int]= mapped_column(ForeignKey ("user.id"))
    hogarId: Mapped[int]= mapped_column(ForeignKey ("hogar.id"))
    fecha:Mapped[datetime] = mapped_column( default=datetime.now)
    recetas:Mapped[dict]= mapped_column(JSON)

    user = relationship(back_populates="comidas")
    hogar = relationship(back_populates="comidas")

    def serialize(self):
        return {
            "id": self.id,
            "userId": self.userId,
            "hogarId": self.hogarId,
            "fecha": self.fecha.isoformat(),
            "recetas": self.recetas
        }

class FavoritosHogar (db.Model):
    __tablename__ = "favoritosHogar"
    id: Mapped[int] = mapped_column(primary_key=True)
    userId: Mapped[int] = mapped_column(ForeignKey("user.id"))
    hogarId: Mapped[int] = mapped_column(ForeignKey("hogar.id"))

    user = relationship(back_populates="favoritos_hogar")
    hogar = relationship(back_populates="favoritos")

    def serialize(self):
        return {
            "id": self.id,
            "userId": self.userId,
            "hogarId": self.hogarId
        }
