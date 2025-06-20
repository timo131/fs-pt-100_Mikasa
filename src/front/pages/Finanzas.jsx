import React, { useEffect, useState, useRef } from 'react';
import finanzasService from '../services/finanzasService';
import '../styles/FinanzasPage.css';
import GastoModal from '../components/GastoModal';
import ListaPagos from '../components/ListaPagos';
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables);
const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];
const FinanzasPage = () => {
  const [token] = useState(localStorage.getItem('token'));
  const [pagos, setPagos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioId, setUsuarioId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mesActual, setMesActual] = useState(new Date().getMonth());
  const [anoActual, setAnoActual] = useState(new Date().getFullYear());
  const chartRef = useRef(null);

  useEffect(() => {
    cargarDatos();
  }, []);
  useEffect(() => {
    renderGrafico(pagos);
  }, [mesActual, anoActual, pagos])

  const cargarDatos = async () => {
    try {
      const pagosData = await finanzasService.getPagos(token);
      const usuariosData = await finanzasService.getUsuarios(token);
      const tokenPayload = JSON.parse(window.atob(token.split('.')[1]));
      const userId = tokenPayload.user_id;

      setPagos(pagosData);
      setUsuarios(usuariosData);
      setUsuarioId(userId);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPagos = async () => {
    try {
      const data = await finanzasService.getPagos(token);
      setPagos(data);
    } catch (error) {
      console.error("Error al obtener los pagos:", error);
    }
  };

  const onMarcarPagado = async (pagoId) => {
    try {
      await finanzasService.marcarComoPagado(pagoId, token);
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
  }

  const renderGrafico = (pagos) => {
    const categorias = {};
    const filtrados = pagos.filter(p => new Date(p.fecha).getMonth() === mesActual && new Date(p.fecha).getFullYear() === anoActual);
    filtrados.forEach((p) => {
      categorias[p.categoria] = (categorias[p.categoria] || 0) + p.monto;
    });

    const ctx = document.getElementById('graficoGastos');
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
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
    let nuevoAno = anoActual;

    if (nuevoMes < 0) {
      nuevoMes = 11;
      nuevoAno -= 1;
    } else if (nuevoMes > 11) {
      nuevoMes = 0;
      nuevoAno += 1;
    }

    setMesActual(nuevoMes);
    setAnoActual(nuevoAno);
  };

  const pagosDelMes = pagos.filter(
    (p) => new Date(p.fecha).getMonth() === mesActual && new Date(p.fecha).getFullYear() === anoActual
  );

  const mostrarGraficoYPagos = mesActual === new Date().getMonth() && anoActual === new Date().getFullYear();

  const loQueDebo = [];
  const loQueMeDeben = [];
  let balance = 0;

  pagosDelMes.forEach(pago => {
    pago.usuarios?.forEach(u => {
      const montoIndividual = pago.monto / pago.usuarios.length;
      if (u.id === usuarioId) {
        if (!u.pagado && pago.creador_id !== usuarioId) {
          loQueDebo.push({ nombre: pago.creador, monto: montoIndividual });
          balance -= montoIndividual;
        }
      } else if (pago.creador_id === usuarioId && !u.pagado) {
        loQueMeDeben.push({ nombre: u.nombre, monto: montoIndividual });
        balance += montoIndividual;
      }
    });
  });
  return (
    <div className="container-fluid finanzas-page">
      <div className="row seccion-cuentas my-3">
        <div className="col-12 tarjeta-cuentas p-4">
          <div className="col-12 d-flex justify-content-center align-items-center titulo-mes">
            <button className="btn-navegacion" onClick={() => cambiarMes(-1)}>&lt;</button>
            <h2 className="mx-3">{meses[mesActual]}</h2>
            <button className="btn-navegacion" onClick={() => cambiarMes(1)}>&gt;</button>
          </div>
          <h4 className="text-center my-4">Cuentas</h4>
          <div className="row">
            <div className="col-md-6">
              <h5>Lo que debo</h5>
              {loQueDebo.length === 0 ? (
                <p className="text-muted">No debes nada.</p>
              ) : (
                <ul>
                  {loQueDebo.map((item, idx) => (
                    <li key={idx}>{item.nombre}: <strong>${item.monto.toFixed(2)}</strong></li>
                  ))}
                </ul>
              )}
            </div>
            <div className="col-md-6">
              <h5>Lo que me deben</h5>
              {loQueMeDeben.length === 0 ? (
                <p className="text-muted">Nadie te debe.</p>
              ) : (
                <ul>
                  {loQueMeDeben.map((item, idx) => (
                    <li key={idx}>{item.nombre}: <strong>${item.monto.toFixed(2)}</strong></li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="balance-final text-center mt-4">
            <h5>Balance final del mes</h5>
            <div className={`badge fs-4 px-4 py-2 ${balance >= 0 ? 'bg-success' : 'bg-danger'}`}>
              {balance >= 0 ? '+' : ''}${balance.toFixed(2)}
            </div>
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
                  pagos={pagosDelMes}
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
