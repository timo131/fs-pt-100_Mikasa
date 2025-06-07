import { useState } from "react";
import userServices from "../services/userServices";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/User.css";
import { Link } from "react-router-dom";

export const Join = () => {
  const { store, dispatch } = useGlobalReducer();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    console.log(formData);
    const data = await userServices.join(formData);
    console.log(data);
  };

  return (
    <div className="user-container">
      {/* <h2>Registrarse</h2> */}
      <form onSubmit={handleSubmit} className="user-form">
        <input
          placeholder="Correo electrónico"
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          required
        />
        <input
          placeholder="Contraseña"
          name="password"
          value={formData.password}
          onChange={handleChange}
          type="password"
          required
        />
        <button type="submit" className="user-button">Crear cuenta</button>
      </form>
      <p className="mt-4 mb-0 ivory">¿Ya tienes cuenta?<br/><Link to="/login">Acceder a tu hogar</Link></p>
    </div>
  );
};
