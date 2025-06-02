import { useState } from "react";
import userServices from "../services/userServices";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/Register.css";

export const Register = () => {
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
    const data = await userServices.register(formData);
    console.log(data);
  };

  return (
    <div className="register-container">
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit} className="register-form">
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
        <button type="submit" className="register-button">Crear cuenta</button>
      </form>
    </div>
  );
};
