import { useState, useEffect, useRef } from "react";
import userServices from "../services/userServices";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/User.css";
import { Link, useNavigate } from "react-router-dom";
import EmailTagsInput from "../components/EmailTagsInput";
import placeholder from "../assets/img/avatar-placeholder.jpg";
import { EditAccount } from "./modals/editaccount";
const CLOUD_NAME = "daavddex7";
const UPLOAD_PRESET = "avatar_unsigned";

export const UserDetails = () => {
  const navigate = useNavigate()
  const { store } = useGlobalReducer();

  const avatarSrc = store.user?.avatar_url
    ? store.user.avatar_url
    : placeholder;

  const [showEditModal, setShowEditModal] = useState(false);

  const openEditAccountModal = () => setShowEditModal(true);
  const closeEditAccountModal = () => setShowEditModal(false);

  return (
    <div className="register-container">
      <h2 className="ivory">{store.user.user_name}
      </h2>
      <div className="row align-items-center my-2">
        <div className="col-6 d-flex justify-content-end">
          <p className="ivory fw-bold">
            Imagen de perfil
          </p>
        </div>
        <div className="col-6 d-flex justify-content-start">
          <div>
            <img
              src={avatarSrc}
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
      <div className="row d-flex align-items-center">
        <div className="col-6 d-flex justify-content-end">
          <p className="ivory fw-bold">Correo electrónico</p>
        </div>
        <div className="col-6 d-flex justify-content-start">
        <p className="ivory">{store.user.email}</p>
        </div>
      </div>
      <div className="row justify-content-center">
        <button onClick={openEditAccountModal} className="user-button col-3">Editar</button>
      </div>
      {showEditModal && (
        <EditAccount
          show={showEditModal}
          onClose={closeEditAccountModal}
        />
      )}
    </div>
  );
};
