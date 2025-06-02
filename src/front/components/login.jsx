import { useState } from "react";
import userServices from "../services/userServices";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/Login.css";

export const Login = () => {
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
    try {
      const data = await userServices.login(formData);
      console.log("Respuesta del acceso:", data);
    } catch (error) {
      console.error("Error al acceder:", error);
    }
  };

  return (
    <div className="login-container">
      <h2>Acceder</h2>
      <form onSubmit={handleSubmit} className="login-form">
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
        <button type="submit" className="login-button">Iniciar sesión</button>
      </form>
    </div>
  );
};
