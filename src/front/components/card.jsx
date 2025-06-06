import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Tareas.css";

export const Card = () => {
	const { dispatch } = useGlobalReducer();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		nombre: "",
		asignadaA: "",
		frecuencia: "",
		descripcion: "",
		fecha: "",
		hecha: false,
		miembro: ""
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = (e) => {
	e.preventDefault();

	const asignadaAFinal =
		formData.asignadaA === "equipo" && formData.miembro
			? `Compartido con: ${formData.miembro}`
			: "Usuario personal";

	const tarea = {
		...formData,
		asignadaA: asignadaAFinal,
		hecha: false, 
	};

	dispatch({ type: "add_task", payload: tarea });
	navigate("/tareas");
};

	return (
		<div className="tareas text-center text-white">
			<h1>Mis tareas</h1>

			<form onSubmit={handleSubmit} className="bg-light p-4 rounded text-dark mx-auto" style={{ maxWidth: "500px" }}>
				<div className="mb-3 text-start">
					<label htmlFor="nombre" className="form-label">Nombre:</label>
					<input
						type="text"
						className="form-control"
						id="nombre"
						name="nombre"
						value={formData.nombre}
						onChange={handleChange}
					/>
				</div>

				<div className="mb-3 text-start">
					<strong>Asignada a:</strong>
					<div className="d-flex gap-3 align-items-center flex-wrap">
						<div className="form-check form-check-inline">
							<input
								className="form-check-input"
								type="radio"
								name="asignadaA"
								value="usuario"
								checked={formData.asignadaA === "usuario"}
								onChange={handleChange}
								id="radioUser"
							/>
							<label className="form-check-label" htmlFor="radioUser">
								<i className="fa-solid fa-user"></i>
							</label>
						</div>
						<div className="form-check form-check-inline">
							<input
								className="form-check-input"
								type="radio"
								name="asignadaA"
								value="equipo"
								checked={formData.asignadaA === "equipo"}
								onChange={handleChange}
								id="radioTeam"
							/>
							<label className="form-check-label d-flex align-items-center gap-2" htmlFor="radioTeam">
								<i className="fa-solid fa-users"></i>
								<select
									className="form-select form-select-sm"
									style={{ width: "150px" }}
									name="miembro"
									onChange={handleChange}
								>
									<option value="">Miembros</option>
									<option value="User1">User1</option>
									<option value="User2">User2</option>
									<option value="User3">User3</option>
									<option value="User4">User4</option>
								</select>
							</label>
						</div>
					</div>
				</div>

				<div className="mb-3 text-start">
					<label htmlFor="descripcion" className="form-label">Descripción:</label>
					<textarea
						className="form-control"
						id="descripcion"
						name="descripcion"
						rows="3"
						value={formData.descripcion}
						onChange={handleChange}
					></textarea>
				</div>

				<div className="mb-3 text-start">
					<strong>Frecuencia:</strong>
					<div className="d-flex gap-4 flex-wrap">
						<div className="form-check form-check-inline">
							<input
								className="form-check-input"
								type="radio"
								name="frecuencia"
								id="unica"
								value="Única"
								checked={formData.frecuencia === "Única"}
								onChange={handleChange}
							/>
							<label className="form-check-label" htmlFor="unica">Única</label>
						</div>
						<div className="form-check form-check-inline">
							<input
								className="form-check-input"
								type="radio"
								name="frecuencia"
								id="mensual"
								value="Mensual"
								checked={formData.frecuencia === "Mensual"}
								onChange={handleChange}
							/>
							<label className="form-check-label" htmlFor="mensual">Mensual</label>
						</div>
					</div>
				</div>

				<div className="mb-3 text-start">
					<label htmlFor="fecha" className="form-label">Fecha límite:</label>
					<input
						type="date"
						className="form-control"
						id="fecha"
						name="fecha"
						value={formData.fecha}
						onChange={handleChange}
					/>
				</div>

				<div className="text-end">
					<button type="submit" className="btn btn-primary me-2">Guardar</button>
					<button type="reset" className="btn btn-secondary">Cancelar</button>
				</div>
			</form>
		</div>
	);
};
