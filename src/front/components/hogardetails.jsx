import { useState, useEffect, useRef } from "react";
import userServices from "../services/userServices";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/User.css";
import { Link, useNavigate } from "react-router-dom";
const CLOUD_NAME = "daavddex7";
const UPLOAD_PRESET = "avatar_unsigned";

export const HogarDetails = () => {
  const navigate = useNavigate()
  const { store, dispatch } = useGlobalReducer();

  return (
    <div className="register-container">
      <h2 className="ivory">Tu hogar</h2>
        <div className="row">
          <div className="col-4 d-flex align-items-center justify-content-end">
            <label htmlFor="hogar_name" className="ivory fw-bold">Nombre del hogar</label>
          </div>
        </div>
        <div className="row">
          <div className="col-4 d-flex align-items-center justify-content-end">
            <label htmlFor="miembros" className="ivory fw-bold">Miembros</label>
          </div>
        </div>
        <div className="row justify-content-center">
          <button type="submit" className="user-button col-3">Editar</button>
        </div>
    </div>
  );
};
