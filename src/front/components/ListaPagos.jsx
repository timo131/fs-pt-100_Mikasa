import React from 'react';
import '../styles/ListaPagos.css';

const ListaPagos = ({ pagos, usuarioId, onMarcarPagado }) => {
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
            className="list-group-item lista-pago-item"
          >
            <div className="tipo-gasto-titulo text-center mb-2">
              {pago.recurrente ? 'Gasto Recurrente' : 'Gasto Único'}
            </div>
            <div className="d-flex justify-content-between align-items-center flex-column flex-md-row w-100">
              <div>
                <strong>{pago.descripcion || 'Sin descripción'}</strong>
                <div className="text-muted small">
                  ${pago.monto.toFixed(2)} · {new Date(pago.fecha).toLocaleDateString()}
                </div>
                <div className="badge bg-secondary me-2">{pago.categoria}</div>
                <div className="badge bg-light text-dark">
                  {esCreador ? 'Tú creaste' : 'Compartido'}
                </div>
              </div>
              {!esCreador && (
                <div className="mt-2 mt-md-0">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={estaPagado}
                    onChange={() => onMarcarPagado(pago.id)}
                    title="Marcar como pagado"
                  />
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ListaPagos;
