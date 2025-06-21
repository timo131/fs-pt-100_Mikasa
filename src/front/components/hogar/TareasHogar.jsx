import useGlobalReducer from "../../hooks/useGlobalReducer";
import "../../styles/TareaHogar.css";

export const TareasHogar = () => {
  const { store } = useGlobalReducer();

  const tareasCompartidas = store.tasks?.filter(task =>
    task.asignadaA.startsWith("Compartido con:")
  );

  return (
    <>
      <h3  className="text-center ivory text-outline">Tareas</h3>

      {tareasCompartidas?.length === 0 ? (
        <p>No hay tareas compartidas.</p>
      ) : (
        <div className="container">
          {tareasCompartidas.map((task, i) => (
            <div key={i} className="card p-3 mb-3 text-start bg-light text-black">
              <h5>{task.nombre}</h5>
              <p><strong>Asignada a:</strong> {task.asignadaA}</p>
              <p><strong>Frecuencia:</strong> {task.frecuencia}</p>
              <p><strong>Descripción:</strong> {task.descripcion}</p>
              <p><strong>Fecha:</strong> {task.fecha}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
