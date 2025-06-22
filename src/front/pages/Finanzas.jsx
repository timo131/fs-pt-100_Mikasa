import React, { useEffect, useState, useRef } from 'react';
import finanzasService from '../services/finanzasService';
import '../styles/FinanzasPage.css';
import GastoModal from '../components/GastoModal';
import ListaPagos from '../components/ListaPagos';
import useGlobalReducer from '../hooks/useGlobalReducer'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables);
const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];
const FinanzasPage = () => {
  const { store, dispatch } = useGlobalReducer();


  const [token] = useState(localStorage.getItem('token'));
  const pagos = store?.gastos || [];
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioId, setUsuarioId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mesActual, setMesActual] = useState(new Date().getMonth());
  const [añoActual, setAñoActual] = useState(new Date().getFullYear());
  const chartRef = useRef(null);

  useEffect(() => {
    renderGrafico(pagos);
  }, [mesActual, añoActual, pagos])

  useEffect(() => {
    if (token && (!pagos.length || !usuarios.length)) {
      cargarDatos();
    }
  }, [token]);

  const cargarDatos = async () => {
    try {
      if (!token) return;

      const tokenPayload = JSON.parse(window.atob(token.split('.')[1]));
      const userId = tokenPayload.sub;
      setUsuarioId(userId);

      const pagosData = await finanzasService.getPagos(token);
      dispatch({ type: "set_gasto", payload: pagosData });

      const usuariosData = await finanzasService.getUsuarios(token);
      setUsuarios(usuariosData);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPagos = async () => {
    try {
      const data = await finanzasService.getPagos(token);
      dispatch({ type: "set_gasto", payload: data });
    } catch (error) {
      console.error("Error al obtener los pagos:", error);
    }
  };
  const onMarcarPagado = async (userPagoId, nuevoEstado) => {
    try {
      await finanzasService.marcarComoPagado(token, userPagoId, nuevoEstado);
      fetchPagos();
    } catch (error) {
      console.error("Error al marcar como pagado:", error);
    }
  };
  const eliminarGasto = async (id) => {
    try {
      await finanzasService.eliminarGasto(id, token);
      fetchPagos();
    } catch (err) {
      console.error("Error al eliminar el gasto:", err);
    }
  };

  const renderGrafico = (pagos) => {
    const categorias = {};
    const filtrados = pagos.filter(p => new Date(p.fecha).getMonth() === mesActual && new Date(p.fecha).getFullYear() === añoActual);
    filtrados.forEach((p) => {
      categorias[p.categoria] = (categorias[p.categoria] || 0) + p.monto;
    });

    const creacionDegrafico = document.getElementById('graficoGastos');
    if (!creacionDegrafico) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(creacionDegrafico, {
      type: 'pie',
      data: {
        labels: Object.keys(categorias),
        datasets: [{
          data: Object.values(categorias),
          backgroundColor: ['#F94144', '#F3722C', '#F9C74F', '#90BE6D', '#43AA8B', '#577590']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            align: 'center',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20,
              font: {
                size: 14
              },
              color: '#000'
            }
          }
        }
      }
    });
  };

  const handleGastoCreado = () => {
    setShowModal(false);
    fetchPagos();
  };

  const cambiarMes = (incremento) => {
    let nuevoMes = mesActual + incremento;
    let nuevoAño = añoActual;

    if (nuevoMes < 0) {
      nuevoMes = 11;
      nuevoAño -= 1;
    } else if (nuevoMes > 11) {
      nuevoMes = 0;
      nuevoAño += 1;
    }

    setMesActual(nuevoMes);
    setAñoActual(nuevoAño);
  };

  const pagosDelMes = pagos.filter((pago) => {
    const fechaPago = new Date(pago.fecha);
    const esMismoMes = fechaPago.getMonth() === mesActual && fechaPago.getFullYear() === añoActual;

    if (pago.frecuencia === 'mensual') {
      return (
        fechaPago.getFullYear() < añoActual ||
        (fechaPago.getFullYear() === añoActual && fechaPago.getMonth() <= mesActual)
      );
    } else {
      return esMismoMes;
    }

  })

  const mostrarGraficoYPagos = mesActual === new Date().getMonth() && añoActual === new Date().getFullYear();

  const loQueDebo = [];
  const loQueMeDeben = [];
  let balance = 0;

  pagosDelMes.forEach(pago => {
    pago.usuarios?.forEach(u => {
      const montoIndividual = pago.monto / pago.usuarios.length;
      const usuarioIdNum = Number(usuarioId)
      if (pago.user_id === usuarioIdNum && u.user_id !== usuarioIdNum && !u.pagado) {
        loQueMeDeben.push({ nombre: u.user_name, monto: montoIndividual, descripcion: pago.descripcion });
        balance += montoIndividual;
      }
      if (u.user_id === usuarioIdNum && pago.user_id !== usuarioIdNum && !u.pagado) {
        loQueDebo.push({ nombre: pago.user_name, monto: montoIndividual, descripcion: pago.descripcion });
        balance -= montoIndividual;
      }
    });
  });
  const pagosOrdenados = [...pagosDelMes].sort(
    (a, b) => new Date(a.fecha_limite || a.fecha) - new Date(b.fecha_limite || b.fecha)
  );
  return (
    <div className="container-fluid finanzas-page">
      <div className="tarjeta-cuentas p-4 my-3">
        <div className="d-flex justify-content-center align-items-center mb-4">
          <button className="btn-navegacion me-3" onClick={() => cambiarMes(-1)}>&lt;</button>
          <h2 className="titulo-mes mb-0">{meses[mesActual]} {añoActual}</h2>
          <button className="btn-navegacion ms-3" onClick={() => cambiarMes(1)}>&gt;</button>
        </div>

        <div className="row">
          <div className="col-md-6">
            <h5>A quien le debo</h5>
            {loQueDebo.length === 0 ? (
              <p className="text-muted">No debes nada.</p>
            ) : (
              <div className="list-group scroll-list">
                {loQueDebo.map((item, idx) => (
                  <div key={idx} className="card mb-2 tarjeta-debo">
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{item.nombre}</strong><br />
                        <small className="text-muted">{item.descripcion}</small>
                      </div>
                      <div className="badge bg-danger fs-6">
                        -${item.monto.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <h5>Quien me debe</h5>
            {loQueMeDeben.length === 0 ? (
              <p className="text-muted">Nadie te debe.</p>
            ) : (
              <div className="list-group scroll-list">
                {loQueMeDeben.map((item, idx) => (
                  <div key={idx} className="card mb-2 tarjeta-deben">
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{item.nombre}</strong><br />
                        <small className="text-muted">{item.descripcion}</small>
                      </div>
                      <div className="badge bg-success fs-6">
                        +${item.monto.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="balance-final mt-4 text-center">
          <h5>Balance final del mes</h5>
          <div className={`badge fs-4 px-4 py-2 ${balance >= 0 ? 'bg-success' : 'bg-danger'}`}>
            {balance >= 0 ? '+' : ''}${balance.toFixed(2)}
          </div>
        </div>
      </div>


      {mostrarGraficoYPagos && (
        <div className="seccion-superior mb-4">
          <div className="tarjeta-gastos row p-3">
            <h4 className="text-center mb-3">Mis Gastos</h4>
            <div className="col-md-6 grafico-categorias d-flex justify-content-center align-items-center p-3">
              <div className="grafico-wrapper">
                <h4 className="text-center mb-3">En qué gasto tanto</h4>
                <div className="grafico-container">
                  <canvas id="graficoGastos"></canvas>
                </div>
              </div>
            </div>

            <div className="col-md-6 lista-gastos-wrapper p-3">
              <button
                className="btn btn-dark w-100 my-2"
                onClick={() => setShowModal(true)}
              >
                Otro Gasto más?
              </button>
              <div className="lista-gastos-scroll">
                <ListaPagos
                  pagos={pagosOrdenados}
                  usuarioId={usuarioId}
                  onMarcarPagado={onMarcarPagado}
                  onEliminar={eliminarGasto}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <GastoModal
        show={showModal}
        onClose={() => setShowModal(false)}
        token={token}
        onGastoCreado={handleGastoCreado}
        users={usuarios}
      />
    </div>
  );
};

export default FinanzasPage;
