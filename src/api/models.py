from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, DateTime, JSON, ForeignKey,Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

db = SQLAlchemy()

class Finanzas (db.Model):
    __tablename__ = "finanzas"
    id: Mapped[int] = mapped_column(primary_key=True)
    monto: Mapped[int] = mapped_column(nullable=False)
    fecha: Mapped[datetime] = mapped_column(default=datetime.now)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    hogar_id: Mapped[int] = mapped_column(ForeignKey("hogar.id"))

    user = relationship("User", back_populates="finanzas", passive_deletes=True)
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


class Pagos(db.Model):
    __tablename__ = "pagos"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    hogar_id: Mapped[int] = mapped_column(ForeignKey("hogar.id"))
    finanzas_id: Mapped[int] = mapped_column(ForeignKey("finanzas.id"), nullable=True)
    monto: Mapped[int] = mapped_column(nullable=False)
    descripcion: Mapped[str] = mapped_column(String(255), nullable=True)
    compartido_con: Mapped[str] = mapped_column(String(255), nullable=True)
    categoria: Mapped[str] = mapped_column(String(100), nullable=True)
    frecuencia: Mapped[str] = mapped_column(String(50), nullable=True)
    fecha_limite: Mapped[Date] = mapped_column(Date, nullable=True)
    tipo: Mapped[str] = mapped_column(String(50), nullable=True)
    fecha: Mapped[Date] = mapped_column(Date, nullable=True)

    user = relationship("User", back_populates="pagos", passive_deletes=True)
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
            "monto": self.monto,
            "descripcion": self.descripcion,
            "compartido_con": self.compartido_con,
            "categoria": self.categoria,
            "frecuencia": self.frecuencia,
            "fecha_limite": self.fecha_limite.isoformat() if self.fecha_limite else None,
            "tipo": self.tipo,
            "fecha": self.fecha.isoformat() if self.fecha else None
        }

class User_pagos(db.Model):
    __tablename__ = "user_pagos"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    hogar_id: Mapped[int] = mapped_column(ForeignKey("hogar.id"), nullable=False)
    pagos_id: Mapped[int] = mapped_column(ForeignKey("pagos.id"), nullable=False)
    estado: Mapped[bool] = mapped_column(default=False, nullable=False) 

    user = relationship("User", back_populates="user_pagos", passive_deletes=True)
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
    user_id: Mapped[int]= mapped_column(ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    done_by: Mapped[int]= mapped_column(ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    hogar_id: Mapped[int]= mapped_column(ForeignKey ("hogar.id"))
    tarea: Mapped[str]= mapped_column(nullable = False)
    fecha:Mapped[datetime] = mapped_column( default=datetime.now)
    done: Mapped[bool]= mapped_column(Boolean)

    user = relationship(
        "User",
        back_populates="tareas",
        foreign_keys=[user_id],
        passive_deletes=True
    )
    done_by_user = relationship(
        "User",
        back_populates="tareas_done_by",
        foreign_keys=[done_by],
        passive_deletes=True
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
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    hogar_id: Mapped[int] = mapped_column(ForeignKey("hogar.id"))
    fecha: Mapped[datetime] = mapped_column(default=datetime.now)
    recetas: Mapped[dict] = mapped_column(JSON)

    user = relationship("User", back_populates="comidas", passive_deletes=True)
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
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    hogar_id: Mapped[int] = mapped_column(ForeignKey("hogar.id"))

    user = relationship("User", back_populates="favoritos_hogar", passive_deletes=True)
    hogar = relationship("Hogar", back_populates="favoritos")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "hogar_id": self.hogar_id
        }

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
    deseado_recetas: Mapped[dict] = mapped_column(JSON, nullable=True)
    favorito_peliculas: Mapped[dict] = mapped_column(JSON, nullable=True)
    hogar_id: Mapped[int] = mapped_column(ForeignKey("hogar.id", ondelete="SET NULL"), nullable=True)
    hogar = relationship("Hogar", back_populates="users", foreign_keys=[hogar_id], passive_deletes=True)
    finanzas = relationship("Finanzas", back_populates="user", cascade="all, delete-orphan", passive_deletes=True)
    pagos = relationship("Pagos", back_populates="user", cascade="all, delete-orphan", passive_deletes=True)
    user_pagos = relationship("User_pagos", back_populates="user", cascade="all, delete-orphan", passive_deletes=True)
    tareas = relationship("Tareas", back_populates="user", cascade="all, delete-orphan", passive_deletes=True, foreign_keys=[Tareas.user_id] )
    tareas_done_by = relationship("Tareas", back_populates="done_by_user", cascade="all, delete-orphan", passive_deletes=True, foreign_keys=[Tareas.done_by] )

    comidas = relationship("Comida", back_populates="user", cascade="all, delete-orphan", passive_deletes=True)
    favoritos_hogar = relationship("Favoritos_hogar", back_populates="user", cascade="all, delete-orphan", passive_deletes=True)

    def serialize(self):
        return {
            "id": self.id,
            "hogar_id": self.hogar_id,
            "hogar": self.hogar and self.hogar.hogar_name,
            "email": self.email,
            "user_name": self.user_name,
            "avatar_url": self.avatar_url,
            "admin": self.admin,
            "favorito_recetas": self.favorito_recetas or [],
            "deseado_recetas": self.deseado_recetas or [],
            "favorito_peliculas": self.favorito_peliculas,

        }

class Hogar (db.Model):
    __tablename__ = "hogar"
    id: Mapped[int] = mapped_column(primary_key=True)
    hogar_name: Mapped[str] = mapped_column(String(80), nullable=False)
    users = relationship("User", back_populates="hogar")
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
            "users": [u.serialize() for u in self.users] or None
        }
