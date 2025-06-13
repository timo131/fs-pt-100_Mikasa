import "../styles/Tareas.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Tareas = () => {
	const { store, dispatch } = useGlobalReducer();
	const navigate = useNavigate();

	const [filtro, setFiltro] = useState("todas");

	const handleRedirect = () => {
		navigate("/card");
	};

	const handleDelete = (index) => {
		dispatch({ type: "delete_task", payload: index });
	};

	const handleEdit = (index) => {
		const task = store.tasks[index];
		navigate("/card", { state: { task, index } });
	};

	const filteredTasks = store.tasks?.filter((t) => {
		if (filtro === "hechas") return t.hecha;
		if (filtro === "pendientes") return !t.hecha;
		return true;
	});

	return (
		<div className="tareas text-center text-white">
			<h1>Mis Tareas</h1>

			<button className="btn btn-warning mt-3 mb-4" onClick={handleRedirect}>
				Agregar Nueva Tarea
			</button>

			<div className="mb-4">
				<label className="me-2"><strong>Filtrar:</strong></label>
				<select
					className="form-select w-auto d-inline"
					value={filtro}
					onChange={(e) => setFiltro(e.target.value)}
				>
					<option value="todas">Todas</option>
					<option value="hechas">Hechas</option>
					<option value="pendientes">Pendientes</option>
				</select>
			</div>

			<div className="container">
				{filteredTasks?.length === 0 ? (
					<p>No hay tareas que coincidan con el filtro.</p>
				) : (
					filteredTasks?.map((t, i) => (
						<div
							key={i}
							className={`card p-3 mb-3 text-start 
		${t.hecha ? "bg-dark text-white  border-black" : "bg-light"} 
		text-black`}
						>
							<h5 className={t.hecha ? "text-decoration-line-through" : ""}>{t.nombre}</h5>
							<p><strong>Asignada a:</strong> {t.asignadaA}</p>
							<p><strong>Frecuencia:</strong> {t.frecuencia}</p>
							<p><strong>Descripción:</strong> {t.descripcion}</p>
							<p><strong>Fecha:</strong> {t.fecha}</p>

							<div className="mt-2 text-end">
								<button
									className={`btn btn-sm ${t.hecha ? "btn-success" : "btn-outline-success"} me-2`}
									onClick={() => dispatch({ type: "toggle_task_done", payload: i })}
								>
									{t.hecha ? "Hecha" : "Marcar como hecha"}
								</button>

								<button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleEdit(i)}>
									Editar
								</button>
								<button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(i)}>
									Borrar
								</button>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};


