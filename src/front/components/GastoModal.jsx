import React, { useState,useEffect } from "react";
import finanzasService from "../services/finanzasService";
import "../styles/gastoModal.css"


const GastoModal = ({ show, onClose, token, onGastoCreado, users }) => {
  const initialForm = {
    nombre: "",
    cantidad: "",
    tipo: "propio",
    compartidoCon: [],
    categoria: "",
    frecuencia: "única",
    fechaLimite: "",
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (show) {
      setForm(initialForm);
    }
  }, [show])


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "compartidoCon") {
      const updated = checked
        ? [...form.compartidoCon, value]
        : form.compartidoCon.filter((u) => u !== value);
      setForm({ ...form, compartidoCon: updated });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      const gasto = {
      descripcion: form.nombre, 
      monto: parseFloat(form.cantidad),
      tipo: form.tipo,
      compartido_con: form.compartidoCon, 
      categoria: form.categoria,
      frecuencia: form.frecuencia,
      fecha_limite: form.fechaLimite || null,
      };

      await finanzasService.postGasto(token, gasto);
      onGastoCreado();
      onClose();
    } catch (error) {
      console.error("Error al crear gasto:", error);
    }
  };

  return (
    <div
      className={`modal right fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-slideout modal-sm" role="document">
        <div className="modal-content p-4 gasto-modal">
          <h5 className="text-center fw-bold mb-3">Gasto</h5>
          <div className="mb-2 d-flex align-items-center">
            <span className="me-2">€</span>
            <input
              type="number"
              className="form-control"
              placeholder="0.00"
              name="cantidad"
              value={form.cantidad}
              onChange={handleChange}
              step="0.01"
              required
            />
          </div>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Nombre del gasto"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
          <div className="mb-2">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="tipo"
                value="propio"
                checked={form.tipo === "propio"}
                onChange={handleChange}
              />
              <label className="form-check-label">propio</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="tipo"
                value="compartido"
                checked={form.tipo === "compartido"}
                onChange={handleChange}
              />
              <label className="form-check-label">compartido entre:</label>
            </div>
            {form.tipo === "compartido" && (
              <div className="d-flex flex-wrap gap-2 mt-1">
                {users.map((user) => (
                  <div key={user.id} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="compartidoCon"
                      value={user.id}
                      onChange={handleChange}
                      checked={form.compartidoCon.includes(user.id)}
                      required
                    />
                    <label className="form-check-label">{user.nombre}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
          <select
            className="form-select mb-2"
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            required
          >
            <option value="">categoría</option>
            <option value="comida">Comida</option>
            <option value="servicios">Servicios</option>
            <option value="entretenimiento">Entretenimiento</option>
            <option value="transporte">Transporte</option>
          </select>

          <div className="mb-2">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="frecuencia"
                value="única"
                checked={form.frecuencia === "única"}
                onChange={handleChange}
              />
              <label className="form-check-label">Frecuencia: única</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="frecuencia"
                value="mensual"
                checked={form.frecuencia === "mensual"}
                onChange={handleChange}
              />
              <label className="form-check-label">mensual</label>
            </div>
          </div>

          <div className="mb-2">
            <label className="form-label">Fecha límite:</label>
            <input
              type="date"
              className="form-control"
              name="fechaLimite"
              value={form.fechaLimite}
              onChange={handleChange}
              required
            />
          </div>

          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-danger" onClick={onClose}>
              Borrar
            </button>
            <button className="btn btn-dark" onClick={handleSubmit}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GastoModal;