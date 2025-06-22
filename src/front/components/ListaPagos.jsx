import React from "react";
import "../styles/ListaPagos.css";

const ListaPagos = ({ pagos, usuarioId, onMarcarPagado, onEliminar }) => {
  if (!pagos || pagos.length === 0) {
    return <p className="text-muted text-center">No hay gastos registrados este mes.</p>;
  }

  const calcularDiasRestantes = (fechaLimite) => {
    if (!fechaLimite) return Infinity;
    const hoy = new Date();
    const limite = new Date(fechaLimite);
    const diff = Math.ceil((limite - hoy) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <ul className="list-group">
      {pagos.map((pago) => {
        const esCreador = Number(pago.user_id) === Number(usuarioId);
        const usuarioActual = pago.usuarios?.find(u => Number(u.user_id) === Number(usuarioId));
        const estaPagado = !!usuarioActual?.pagado;
        const userPagoId = usuarioActual?.user_pago_id;
        const creadorNombre = pago.user_name || "Creador desconocido";
        const diasRestantes = calcularDiasRestantes(pago.fecha_limite || pago.fecha);

        const colorClase = estaPagado
          ? "border-success bg-light"
          : diasRestantes <= 3
          ? "border-danger bg-light"
          : "border-secondary bg-light";

        return (
          <li
            key={pago.id}
            className={`list-group-item lista-pago-item d-flex justify-content-between align-items-center flex-column flex-md-row w-100 border ${colorClase} mb-2 rounded-3 shadow-sm`}
          >
            <div className="w-100">
              <div className="d-flex justify-content-between align-items-center">
                <div className="tipo-gasto-titulo">
                  {pago.frecuencia === "mensual" ? 'Gasto Recurrente' : 'Gasto Único'}
                </div>
                {diasRestantes !== Infinity && (
                  <small className={`text-${diasRestantes <= 3 ? 'danger' : 'muted'}`}>
                    Vence en {diasRestantes} día{diasRestantes !== 1 ? 's' : ''}
                  </small>
                )}
              </div>
              <h6 className="fw-bold">{pago.descripcion || 'Sin descripción'}</h6>
              <div className="text-muted small">
                Creado: {new Date(pago.fecha).toLocaleDateString()}<br />
                {pago.fecha_limite && (
                  <>
                    Límite: {new Date(pago.fecha_limite).toLocaleDateString()}
                  </>
                )}
              </div>
              <div className="badge bg-secondary me-2">{pago.categoria}</div>
              <div className="badge bg-light text-dark">
                {esCreador ? 'Creador: ' + creadorNombre : 'Compartido'}
              </div>
              <div className="mt-2">
                <strong>Personas involucradas:</strong>
                <ul className="mb-1">
                  {pago.usuarios?.map((usuario) => (
                    <li key={usuario.user_id}>
                      {usuario.user_name} debe pagar ${usuario.monto_pagar.toFixed(2)}{" "}
                      {usuario.pagado ? (
                        <span className="text-success">(Pagado)</span>
                      ) : (
                        <span className="text-danger">(Pendiente)</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
              {!esCreador && userPagoId && (
                <button
                  className={`btn ${estaPagado ? 'btn-success' : 'btn-outline-secondary'} btn-lg`}
                  onClick={() => onMarcarPagado(userPagoId, !estaPagado)}
                  title="Marcar como pagado"
                >
                  <i className={`fa-solid ${estaPagado ? 'fa-check-circle' : 'fa-circle'}`}></i>
                </button>
              )}
              {esCreador && (
                <button
                  type="button"
                  className="btn btn-outline-danger btn-lg"
                  onClick={() => onEliminar(pago.id)}
                  title="Eliminar gasto"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ListaPagos;
