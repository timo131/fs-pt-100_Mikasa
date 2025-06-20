import React from 'react';
import '../styles/ListaPagos.css';

const ListaPagos = ({ pagos, usuarioId, onMarcarPagado, onEliminar }) => {
  if (!pagos || pagos.length === 0) {
    return <p className="text-muted text-center">No hay gastos registrados este mes.</p>;
  }

  return (
    <ul className="list-group">
      {pagos.map((pago) => {
        const esCreador = pago.creador_id === usuarioId;
        const usuarioActual = (pago.usuarios || []).find(u => u.id === usuarioId);
        const estaPagado = usuarioActual?.pagado || false;

        return (
          <li
            key={pago.id}
            className="list-group-item lista-pago-item d-flex justify-content-between align-items-center flex-column flex-md-row w-100"
          >
            <div>
              <div className="tipo-gasto-titulo text-center mb-2">
                {pago.recurrente ? 'Gasto Recurrente' : 'Gasto Único'}
              </div>
              <h6 className='fw-bold'>{pago.descripcion || 'Sin descripción'}</h6>
              <div className="text-muted small">
                ${pago.monto.toFixed(2)} · {new Date(pago.fecha).toLocaleDateString()}
              </div>
              <div className="badge bg-secondary me-2">{pago.categoria}</div>
              <div className="badge bg-light text-dark">
                {esCreador ? '' : 'Compartido'}
              </div>
            </div>

            <div className="d-flex align-items-center gap-3 mt-2 mt-md-0">
              {!esCreador && (
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={estaPagado}
                  onChange={() => onMarcarPagado(pago.id)}
                  title="Marcar como pagado"
                />
              )}
              {esCreador && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
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
