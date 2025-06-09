import { useState, useEffect, useRef } from "react";
import userServices from "../services/userServices";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/User.css";
import { Link, useNavigate } from "react-router-dom";
import EmailTagsInput from "../components/EmailTagsInput";
import placeholder from "../assets/img/avatar-placeholder.jpg";
const CLOUD_NAME = "daavddex7";
const UPLOAD_PRESET = "avatar_unsigned";

export const UserDetails = () => {
  const navigate = useNavigate()
  const { store, dispatch } = useGlobalReducer();

  return (
    <div className="register-container">
      <h2 className="ivory">Tu cuenta</h2>
              <div className="row">
          <div className="col-4 d-flex align-items-center justify-content-end">
            <label htmlFor="user_name" className="ivory fw-bold">Nombre de usuario</label>
          </div>
        </div>
        <div className="row">
          <div className="col-4 d-flex align-items-center justify-content-end">
            <label htmlFor="email" className="ivory fw-bold">Correo electrónico</label>
          </div>
        </div>
        <div className="row align-items-center my-2">
          <div className="col-4 d-flex justify-content-end">
            <label className="ivory fw-bold">
              Imagen de perfil
            </label>
          </div>
          <div className="col-6">
            <div>
              <img
                src={placeholder}
                alt="Avatar Preview"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          </div>

        </div >

        <div className="row justify-content-center">
          <button type="submit" className="user-button col-3">Editar</button>
        </div>
    </div>
  );
};
