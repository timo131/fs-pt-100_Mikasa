import useGlobalReducer from "../../hooks/useGlobalReducer";
import "../../styles/TareaHogar.css";
import { Link } from "react-router-dom";

export const TareasHogar = () => {
  const { store, dispatch } = useGlobalReducer();

  const tareasCompartidas = store.tasks?.filter(
      (task) =>
        task.asignadaA === "equipo" &&
        task.hogarId === store.hogar?.id 
    );

  return (

    <div className="tareas text-center text-white">
      
      <Link to="/tareas">
      <h3 className="text-center ivory text-outline">Tareas del Hogar</h3>
      </Link>

      {tareasCompartidas?.length === 0 ? (
        <p className="charcoal">No hay tareas compartidas.</p>
      ) : (
        <div className="container">
          {tareasCompartidas.map((task, i) => (
            <div
              key={i}
              className={`card border-charcoal p-3 mb-3 text-start ${task.hecha ? "card-hecha text-ivory" : "bg-ivory text-charcoal"
                }`}
            >
              <h5
                className={`text-center fw-bold ${task.hecha ? "text-decoration-line-through" : ""
                  }`}
              >
                {task.nombre}
              </h5>
              <p className="m-0"><strong>Miembros:</strong> {task.miembros?.join(", ") || "Sin miembros"}</p>
              <p className="m-0"><strong>Frecuencia:</strong> {task.frecuencia}</p>
              <p className="m-0"><strong>Descripción:</strong> {task.descripcion}</p>
              <p className="m-0"><strong>Fecha:</strong> {task.fecha}</p>

              <button
                className={`mt-2 w-50 mx-auto ${task.hecha ? "btn-hecha" : "marcar-button"
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
