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
		<>
			<div className="titulo text-center">
				<h1>
					<i className="fa-solid fa-clipboard-list me-2"></i> Mis Tareas
				</h1>
			</div>

			<div className="tareas text-white px-3">
				
				<div className="d-flex justify-content-end mb-3">
					<div>
						<label className="me-2"><strong>Filtrar:</strong></label>
						<select
							className="form-select d-inline w-auto"
							value={filtro}
							onChange={(e) => setFiltro(e.target.value)}
						>
							<option value="todas">Todas</option>
							<option value="hechas">Hechas</option>
							<option value="pendientes">Pendientes</option>
						</select>
					</div>
				</div>

				<div className="text-center">
					<button className="btn btn-warning mt-1 mb-4" onClick={handleRedirect}>
						Agregar Nueva Tarea
					</button>
				</div>

				<div className="container">
					<div className="row">
						{filteredTasks?.length === 0 ? (
							<p>No hay tareas que coincidan con el filtro.</p>
						) : (
							filteredTasks.map((t, i) => (
								<div key={i} className="col-12 col-md-6 col-lg-4 mb-4">
									<div
										className={`card p-3 h-100 text-start 
											${t.hecha ? "hecha" : "pendiente"}`}
									>
										<h5 className={t.hecha ? "text-decoration-line-through" : ""}>{t.nombre}</h5>
										<div className="d-flex flex-wrap gap-2 mb-2">
											<p className="mb-0"><strong>Asignada a:</strong> {t.asignadaA}</p>
											<p className="mb-0"><strong>Frecuencia:</strong> {t.frecuencia}</p>
											<p className="mb-0"><strong>Fecha:</strong> {t.fecha}</p>
										</div>
										<p className="mt-2"><strong>Descripción:</strong> {t.descripcion}</p>

										<div className="mt-auto text-end">
											<button
												className={`btn btn-sm ${t.hecha ? "btn-success" : "btn-outline-success"} me-2`}
												onClick={() => dispatch({ type: "toggle_task_done", payload: i })}
											>
												{t.hecha ? "Hecha" : "Marcar como hecha"}
											</button>

											<button
												className={`btn btn-sm ${t.hecha ? "btn-light text-success" : "btn-outline-warning"} me-2`}
												onClick={() => handleEdit(i)}
											>
												<i className="fa-regular fa-pen-to-square"></i>
											</button>

											<button
												className="btn btn-sm btn-outline-danger"
												onClick={() => handleDelete(i)}
											>
												<i className="fa-solid fa-trash"></i>
											</button>
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</>
	);
};

