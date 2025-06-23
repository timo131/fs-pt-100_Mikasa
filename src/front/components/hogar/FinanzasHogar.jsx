import React, { useEffect } from "react";
import finanzasService from "../../services/finanzasService";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import "../../styles/FinanzasHogar.css";

export const FinanzasHogar = () => {
  const { store, dispatch } = useGlobalReducer();
  const usuarioId = store.user?.id || null;
  const token = store.token;

  useEffect(() => {
    if (token && (!store.gastos || store.gastos.length === 0)) {
      cargarGastos();
    }
  }, [token]);

  const cargarGastos = async () => {
    try {
      const data = await finanzasService.getPagos(token);
      dispatch({ type: "set_gasto", payload: data });
    } catch (error) {
      console.error("Error al cargar gastos:", error);
    }
  };

  const onMarcarPagado = async (userPagoId, nuevoEstado) => {
    try {
      await finanzasService.marcarComoPagado(token, userPagoId, nuevoEstado);
      await cargarGastos();
    } catch (error) {
      console.error("Error al marcar pagado:", error);
    }
  };

  const hoy = new Date();

  const gastosInvolucrados = (store.gastos || [])
    .filter(
      (gasto) =>
        Number(gasto.user_id) === Number(usuarioId) ||
        gasto.usuarios?.some((u) => Number(u.user_id) === Number(usuarioId))
    )
    .sort((a, b) => {
      const fechaA = a.fecha_limite ? new Date(a.fecha_limite) : new Date(90000);

      const fechaB = b.fecha_limite ? new Date(b.fecha_limite) : new Date(90000);

      return fechaA - fechaB;
    });

  const diasFaltantes = (fechaLimite) => {
    if (!fechaLimite) return null;
    const limite = new Date(fechaLimite);
    const diffTime = limite - hoy;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="container">
      <h3 className="text-center ivory text-outline">Gastos del Hogar</h3>

      {gastosInvolucrados.length === 0 && (
        <p className="text-center ivory text-black">No tienes gastos asignados.</p>
      )}

      <div className="finanzas-hogar-scroll-container">
        {gastosInvolucrados.map((gasto) => {
          let usuarioActual = gasto.usuarios?.find(
            (u) => Number(u.user_id) === Number(usuarioId)
          );
          if (!usuarioActual && Number(gasto.user_id) === Number(usuarioId)) {
            usuarioActual = {
              pagado: false,
              user_pago_id: null,
              monto_pagar: gasto.monto,
            };
          }

          const pagado = usuarioActual?.pagado || false;
          const userPagoId = usuarioActual?.user_pago_id;
          const dias = diasFaltantes(gasto.fecha_limite);
          const pagadoClass = pagado ? "finanzas-hogar-card-pagado" : "";
          const urgente =
            !pagado && dias !== null && dias <= 3
              ? "finanzas-hogar-card-urgente"
              : "";

          return (
            <div
              key={gasto.id}
              className={`card finanzas-hogar-card m-1 ${pagadoClass} ${urgente}`}
            >
              <div className="card-body">
                <h6 className="card-title fw-bold">{gasto.descripcion}</h6>
                <p className="mb-1">
                  <strong>Creador:</strong> {gasto.user_name}
                </p>
                <p className="mb-1">
                  <strong>Involucrados:</strong>{" "}
                  {gasto.usuarios?.map((u) => u.user_name).join(", ") || "Ninguno"}
                </p>
                <p className="mb-1">
                  <strong>Monto:</strong> €{gasto.monto.toFixed(2)}
                </p>
                <p className="mb-1">
                  <span>
                    Fecha límite:{" "}
                    {gasto.fecha_limite
                      ? new Date(gasto.fecha_limite).toLocaleDateString()
                      : "Sin fecha"}
                  </span>
                </p>
                {dias !== null && (
                  <p className="mb-2">
                    <span>
                      {dias} día{dias !== 1 ? "s" : ""} restante
                      {dias !== 1 ? "s" : ""}
                    </span>
                  </p>
                )}
                <div className="d-flex justify-content-end align-items-center">
                  {userPagoId !== null && (
                    <button
                      className={`btn btn-sm ${
                        pagado ? "btn-success" : "btn-outline-secondary"
                      }`}
                      onClick={() => onMarcarPagado(userPagoId, !pagado)}
                    >
                      {pagado ? "Pagado" : "Marcar como pagado"}
                    </button>
                  )}
                  {userPagoId === null && (
                    <span
                      className={`badge ${pagado ? "bg-success" : "bg-warning"}`}
                    >
                      {pagado ? "Pagado" : "Pendiente"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
