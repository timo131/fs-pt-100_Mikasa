import useGlobalReducer from "../../hooks/useGlobalReducer";
import "../../styles/TareaHogar.css";
export const TareasHogar = () => {
  const { store, dispatch } = useGlobalReducer();
  const hogar = store.hogar;
  const tareasCompartidas = store.tasks?.filter(task =>
    task.asignadaA === "equipo" && hogar && task.hogarId === hogar.id
  ) || [];
  return (
    <div className="tareas text-center text-white">
      <h3 className="text-center ivory text-outline">Tareas del Hogar</h3>
      {tareasCompartidas.length === 0 ? (
        <p>No hay tareas compartidas.</p>
      ) : (
        <div className="container">
          {tareasCompartidas.map((task, i) => (
            <div
              key={i}
              className={`card p-3 mb-3 text-start ${
                task.hecha ? "card-hecha text-ivory" : "bg-ivory text-charcoal"
              }`}
            >
              <h5 className={task.hecha ? "text-decoration-line-through" : ""}>
                {task.nombre}
              </h5>
              <p><strong>Miembros:</strong> {task.miembros?.join(", ") || "Sin miembros"}</p>
              <p><strong>Frecuencia:</strong> {task.frecuencia}</p>
              <p><strong>Descripción:</strong> {task.descripcion}</p>
              <p><strong>Fecha:</strong> {task.fecha}</p>
              <button
                className={`btn btn-sm mt-2 ${
                  task.hecha ? "btn-hecha" : "btn-outline-success"
                }`}
                onClick={() => {
                  const globalIndex = store.tasks.findIndex(t => t === task);
                  if (globalIndex !== -1) {
                    dispatch({ type: "toggle_task_done", payload: globalIndex });
                  }
                }}
              >
                {task.hecha ? <i className="boton-hecho fa-solid fa-user-check"></i> : "Marcar como hecha"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};