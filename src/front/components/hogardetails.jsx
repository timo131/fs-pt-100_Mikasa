import { useState, useEffect, useRef } from "react";
import userServices from "../services/userServices";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/User.css";
import { Link, useNavigate } from "react-router-dom";
import placeholder from "../assets/img/avatar-placeholder.jpg";
const CLOUD_NAME = "daavddex7";
const UPLOAD_PRESET = "avatar_unsigned";

export const HogarDetails = () => {
  const navigate = useNavigate()
  const { store, dispatch } = useGlobalReducer();
  const users = store.hogar.user
  const avatarSrc = users.avatar_url
        ? users.avatar_url
        : placeholder;


  return (
    <div className="register-container">
      <h2 className="ivory">{store.hogar.hogar_name}
        {store.user.admin === true && 
         <span className="fa-solid fa-pencil fa-2xs ms-2"></span>
        }
      </h2>

        <div className="row">
              <div className="table-responsive">
      <table className="table table-striped align-middle rounded-3">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Username</th>
            <th scope="col">Email</th>
            <th scope="col">Role</th>
            {store.user.admin === true && <th scope="col"></th>}
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>
                <img
                  src={avatarSrc}
                  alt={`${user.user_name} avatar`}
                  className="rounded-circle"
                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                />
              </td>
              <td>{user.user_name}</td>
              <td>{user.email}</td>
              <td>
                {user.admin
                  ? <span className="badge bg-success">Admin</span>
                  : <span className="badge bg-secondary">Miembro</span>
                }
              </td>
              {store.user.admin === true && 
              <td>
                {user.id !== store.user.id && 
                <span class="fa-solid fa-pencil"></span>
                }
              </td>
              }
            </tr>
          ))}
        </tbody>
      </table>
    </div>
        </div>
        {store.user.admin === true && 
        <div className="row justify-content-center">
          <button type="submit" className="user-button col-5">Invitar a más personas</button>
        </div>
        }
    </div>
  );
};
