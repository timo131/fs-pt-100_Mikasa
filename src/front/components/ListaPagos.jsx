import "../styles/ListaPagos.css";

const ListaPagos = ({ pagos, usuarioId, onMarcarPagado }) => {
  return (
    <div className="lista-pagos">
      {pagos.map((pago) => {
        const yaPago = pago.usuarios.find(
          (u) => u.id === usuarioId && u.pagado === true
        );

        return (
          <div key={pago.id} className="card pago-card mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="card-title mb-2"> {pago.descripcion}</h5>
                  <p className="mb-1">
                    <strong>Monto:</strong> ${pago.monto}
                  </p>
                  <p className="mb-1">
                    <strong>Creado por:</strong> {pago.creador}
                  </p>
                  <p className="mb-1"><strong>Participantes:</strong></p>
                  <ul className="list-unstyled ms-3 mb-2">
                    {pago.usuarios.map((usuario) => (
                      <li key={usuario.id}>
                        {usuario.nombre}
                        {usuario.pagado ? (
                          <span className="badge bg-success ms-2">Pagado</span>
                        ) : (
                          <span className="badge bg-warning text-dark ms-2">
                            Pendiente
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                {!yaPago && (
                  <div className="ms-3">
                    <button
                      className="btn btn-outline-dark btn-sm"
                      onClick={() => onMarcarPagado(pago.id)}
                    >
                      Marcar como pagado
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListaPagos;
