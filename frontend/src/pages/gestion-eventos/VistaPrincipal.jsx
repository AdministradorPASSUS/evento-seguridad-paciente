import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import './styles/VistaPrincipal.css';
import Swal from 'sweetalert2';
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const VistaPrincipal = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas salir del sistema?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00933f',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      await logout();
      navigate('/login');
    }
  };

  const nombreCompleto = `${user?.nombre || ''} ${user?.apellido || ''}`.trim() || user?.nombre_usuario || 'Usuario';
  const rolUsuario = user?.roles?.[0] || 'Coordinadora S.O';

  return (
    <div className="dashboard-layout">

      {/* Sidebar Izquierdo Modularizado */}
      <Sidebar />

      {/* Contenido Principal */}
      <div className="dashboard-main-container">

        {/* Navbar Superior Modularizado */}
        <Navbar
          nombreCompleto={nombreCompleto}
          rolUsuario={rolUsuario}
          handleLogout={handleLogout}
        />

        {/* Cuerpo del Dashboard (Métricas y Secciones según el nuevo diseño) */}
        <main className="dashboard-body-content">

          {/* 1. Barra de Filtros Superior */}
          <div className="filters-bar-card">
            <div className="filter-group">
              <label>Año</label>
              <select defaultValue="2025"><option>2025</option><option>2026</option></select>
            </div>
            <div className="filter-group">
              <label>Mes</label>
              <select defaultValue="Mayo"><option>Mayo</option><option>Junio</option></select>
            </div>
            <div className="filter-group">
              <label>Sede</label>
              <select defaultValue="Todas"><option>Todas</option></select>
            </div>
            <div className="filter-group">
              <label>EPS</label>
              <select defaultValue="Todas"><option>Todas</option></select>
            </div>
            <div className="filter-group">
              <label>Servicio</label>
              <select defaultValue="Todos"><option>Todos</option></select>
            </div>
            <div className="filter-group">
              <label>Tipo de evento</label>
              <select defaultValue="Todos"><option>Todos</option></select>
            </div>
            <button className="btn-filter-action">🔍 Filtros</button>
          </div>

          {/* Layout principal: Columna izquierda de datos (75%) y Columna derecha lateral (25%) */}
          <div className="dashboard-grid-layout">

            {/* COLUMNA IZQUIERDA: Tarjetas y Gráficos */}
            <div className="dashboard-left-column">

              {/* 2. Tarjetas KPI Superiores */}
              <div className="kpi-cards-grid">

                <div className="kpi-card card-blue">
                  <span className="kpi-title">Total de reportes</span>
                  <div className="kpi-value-row">
                    <span className="kpi-number">128</span>
                    <i className="fa-sharp fa-solid fa-chart-column kpi-icon"></i>
                  </div>
                  <span className="kpi-badge">▲ 15% vs abril 2025</span>
                </div>

                <div className="kpi-card card-red">
                  <span className="kpi-title">Eventos adversos</span>
                  <div className="kpi-value-row">
                    <span className="kpi-number">62</span>
                    <i className="fa-sharp fa-solid fa-triangle-exclamation kpi-icon"></i>
                  </div>
                  <span className="kpi-badge">▲ 21% vs abril 2025</span>
                </div>

                <div className="kpi-card card-orange">
                  <span className="kpi-title">Incidentes</span>
                  <div className="kpi-value-row">
                    <span className="kpi-number">48</span>
                    <i className="fa-sharp fa-solid fa-circle-exclamation kpi-icon"></i>
                  </div>
                  <span className="kpi-badge">▼ 8% vs abril 2025</span>
                </div>

                <div className="kpi-card card-purple">
                  <span className="kpi-title">Indicios de atención</span>
                  <div className="kpi-value-row">
                    <span className="kpi-number">18</span>
                    <i className="fa-sharp fa-solid fa-lightbulb kpi-icon"></i>
                  </div>
                  <span className="kpi-badge">▲ 5% vs abril 2025</span>
                </div>

                <div className="kpi-card card-teal">
                  <span className="kpi-title">Oportunidad prom. del análisis</span>
                  <div className="kpi-value-row">
                    <span className="kpi-number">1.6 <small>días</small></span>
                    <i className="fa-sharp fa-solid fa-clock kpi-icon"></i>
                  </div>
                  <span className="kpi-subtext">Meta: ≥ 2 días</span>
                </div>

              </div>

              {/* 3. Fila de Gráficos Superiores */}
              <div className="charts-row-3">
                {/* Gráfico 1: Por categoría */}
                <div className="dashboard-card">
                  <h4>Reportes por categoría</h4>
                  <div className="donut-chart-container">
                    <div className="donut-graphic">
                      <div className="donut-hole">
                        <strong>128</strong>
                        <small>Total</small>
                      </div>
                    </div>
                    <ul className="chart-legend">
                      <li><span className="dot blue"></span> Problemas con medicamentos <b>28%</b></li>
                      <li><span className="dot teal"></span> Acciones inseguras <b>22%</b></li>
                      <li><span className="dot purple"></span> Incidentes de atención <b>18%</b></li>
                      <li><span className="dot orange"></span> Dispositivos y equipos <b>12%</b></li>
                      <li><span className="dot red"></span> Caídas / Pérdidas / Fuga <b>8%</b></li>
                      <li><span className="dot gray"></span> Otras categorías <b>12%</b></li>
                    </ul>
                  </div>
                  <a href="#detalle" className="card-link-bottom">Ver detalle</a>
                </div>

                {/* Gráfico 2: Por gravedad */}
                <div className="dashboard-card">
                  <h4>Reportes por gravedad</h4>
                  <div className="bars-graphic-vertical">
                    <div className="v-bar-col"><div className="v-bar red" style={{ height: '15%' }}></div><small>Centinela</small></div>
                    <div className="v-bar-col"><div className="v-bar orange" style={{ height: '45%' }}></div><small>Grave</small></div>
                    <div className="v-bar-col"><div className="v-bar yellow" style={{ height: '80%' }}></div><small>Moderado</small></div>
                    <div className="v-bar-col"><div className="v-bar blue" style={{ height: '90%' }}></div><small>Leve</small></div>
                    <div className="v-bar-col"><div className="v-bar dark-blue" style={{ height: '70%' }}></div><small>Incidente</small></div>
                  </div>
                </div>

                {/* Gráfico 3: Cumplimiento */}
                <div className="dashboard-card text-center">
                  <h4>Cumplimiento de análisis en tiempos establecidos</h4>
                  <div className="circle-progress">
                    <span>78%</span>
                  </div>
                  <p className="target-text">Meta: ≥ 90%</p>
                  <a href="#detalle" className="card-link-bottom">Ver detalle</a>
                </div>
              </div>

              {/* 4. Módulos de Accesos Rápidos
              <div className="quick-access-row">
                <div className="quick-access-card">
                  <span className="q-icon">➕</span>
                  <div>
                    <strong>Reportar evento</strong>
                    <p>Registra un nuevo evento, incidente o indicio.</p>
                  </div>
                </div>
                <div className="quick-access-card">
                  <span className="q-icon">📋</span>
                  <div>
                    <strong>Mis reportes</strong>
                    <p>Consulta y haz seguimiento de tus reportes.</p>
                  </div>
                </div>
                <div className="quick-access-card">
                  <span className="q-icon">📝</span>
                  <div>
                    <strong>Plan de acción</strong>
                    <p>Acciones correctivas y preventivas.</p>
                  </div>
                </div>
                <div className="quick-access-card">
                  <span className="q-icon">📊</span>
                  <div>
                    <strong>Indicadores</strong>
                    <p>Consulta indicadores de seguridad.</p>
                  </div>
                </div>
                <div className="quick-access-card">
                  <span className="q-icon">🎓</span>
                  <div>
                    <strong>Capacitaciones</strong>
                    <p>Accede a campañas, cápsulas y más.</p>
                  </div>
                </div>
              </div> */}

              {/* 5. Fila de Gráficos Inferiores */}
              <div className="charts-row-3">
                <div className="dashboard-card">
                  <h4>Tendencia de reportes (mensual)</h4>
                  <div className="line-chart-placeholder">
                    <div className="chart-line-demo">📈 [Gráfico de Líneas Mensual]</div>
                  </div>
                </div>

                <div className="dashboard-card">
                  <h4>Top 5 categorías</h4>
                  <div className="horizontal-bars-list">
                    <div className="h-row"><span>Problemas con medicamentos</span><div className="h-bar" style={{ width: '90%' }}></div><b>36</b></div>
                    <div className="h-row"><span>Acciones inseguras</span><div className="h-bar" style={{ width: '75%' }}></div><b>28</b></div>
                    <div className="h-row"><span>Incidentes de atención</span><div className="h-bar" style={{ width: '60%' }}></div><b>23</b></div>
                    <div className="h-row"><span>Dispositivos y equipos</span><div className="h-bar" style={{ width: '40%' }}></div><b>15</b></div>
                    <div className="h-row"><span>Caídas / Pérdidas / Fuga</span><div className="h-bar" style={{ width: '25%' }}></div><b>10</b></div>
                  </div>
                  <a href="#todas" className="card-link-bottom">Ver todas</a>
                </div>

                <div className="dashboard-card">
                  <h4>Distribución por sede</h4>
                  <div className="donut-chart-container">
                    <div className="donut-graphic">
                      <div className="donut-hole"><strong>128</strong><small>Total</small></div>
                    </div>
                    <ul className="chart-legend">
                      <li><span className="dot blue"></span> Sede Principal <b>56 (44%)</b></li>
                      <li><span className="dot teal"></span> Sede Norte <b>28 (22%)</b></li>
                      <li><span className="dot dark-blue"></span> Sede Centro <b>20 (16%)</b></li>
                      <li><span className="dot orange"></span> Sede Sur <b>14 (11%)</b></li>
                      <li><span className="dot yellow"></span> Sede Neuro <b>10 (7%)</b></li>
                    </ul>
                  </div>
                  <a href="#detalle" className="card-link-bottom">Ver detalle</a>
                </div>
              </div>

            </div>

            {/* COLUMNA DERECHA: Banner Mascota + Alertas + Semáforo */}
            <div className="dashboard-right-column">

              {/* Banner de la Mascota Hero */}
              <div className="hero-mascot-card">
                <div className="mascot-text-box">
                  <h2>Cuidamos lo que más importa</h2>
                  <p>Pienso seguro, actúo seguro, prevengo siempre.</p>
                  <small>¡Juntos construimos una cultura de seguridad!</small>
                </div>
                <img src="/passus-seguro-b.jpg" alt="Passus-seguro" className="mascot-img" />
              </div>

              {/* Alertas y Notificaciones */}
              <div className="dashboard-card">
                <div className="card-header-between">
                  <h4>Alertas y notificaciones</h4>
                  <a href="#todas">Ver todas</a>
                </div>
                <div className="alerts-list">
                  <div className="alert-item">
                    <span className="alert-badge red">🚨</span>
                    <div>
                      <strong>Análisis vencidos</strong>
                      <p>12 análisis están fuera del tiempo establecido.</p>
                    </div>
                  </div>
                  <div className="alert-item">
                    <span className="alert-badge orange">⚠️</span>
                    <div>
                      <strong>Eventos centinela pendientes</strong>
                      <p>2 eventos centinela requieren análisis inmediato.</p>
                    </div>
                  </div>
                  <div className="alert-item">
                    <span className="alert-badge yellow">📈</span>
                    <div>
                      <strong>Aumento significativo</strong>
                      <p>Incremento del 21% en eventos adversos vs mes anterior.</p>
                    </div>
                  </div>
                  <div className="alert-item">
                    <span className="alert-badge blue">📉</span>
                    <div>
                      <strong>Baja adherencia</strong>
                      <p>La adherencia a prácticas de seguridad está por debajo de la meta.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Índice de Seguridad (Semáforo) */}
              {/* <div className="dashboard-card text-center">
                <h4>Índice integral de seguridad PASSUS</h4>
                <div className="gauge-chart-wrapper">
                  <div className="gauge-number">85%</div>
                  <span className="gauge-status-tag green">Nivel: ADECUADO</span>
                </div>
                <ul className="gauge-legend">
                  <li><span className="dot green"></span> 90% - 100% Excelente</li>
                  <li><span className="dot teal"></span> 80% - 89% Adecuado</li>
                  <li><span className="dot yellow"></span> 70% - 79% Riesgo moderado</li>
                  <li><span className="dot red"></span> &lt; 70% Riesgo alto</li>
                </ul>
                <a href="#detalle" className="card-link-bottom">Ver detalle</a>
              </div> */}

            </div>

          </div>

          {/* 6. Tarjetas de Métricas Inferiores */}
          <div className="bottom-metrics-grid">
            <div className="metric-card-bottom">
              <div className="metric-card-circle green">82%</div>
              <div className="metric-card-info">
                <strong className="metric-card-title">Adherencia a prácticas seguras</strong>
                <p className="metric-card-subtext">Meta: ≥ 90%</p>
              </div>
            </div>

            <div className="metric-card-bottom">
              <div className="metric-card-circle green">85%</div>
              <div className="metric-card-info">
                <strong className="metric-card-title">Cumplimiento de rondas</strong>
                <p className="metric-card-subtext">Meta: ≥ 90%</p>
              </div>
            </div>

            <div className="metric-card-bottom">
              <i className="fa-sharp fa-solid fa-users metric-card-icon"></i>
              <div className="metric-card-info">
                <strong className="metric-card-title">Participación en campañas (68%)</strong>
                <p className="metric-card-subtext">156 de 240 colaboradores</p>
              </div>
            </div>

            <div className="metric-card-bottom">
              <i className="fa-sharp fa-solid fa-chart-pie metric-card-icon"></i>
              <div className="metric-card-info">
                <strong className="metric-card-title">Encuesta de percepción</strong>
                <p className="metric-card-subtext">4.2 / 5</p>
              </div>
            </div>

            <div className="metric-card-bottom">
              <i className="fa-sharp fa-solid fa-graduation-cap metric-card-icon"></i>
              <div className="metric-card-info">
                <strong className="metric-card-title">Capacitaciones realizadas (12)</strong>
                <p className="metric-card-subtext">Este mes</p>
              </div>
            </div>

            <div className="metric-card-bottom">
              <i className="fa-sharp fa-solid fa-circle-play metric-card-icon"></i>
              <div className="metric-card-info">
                <strong className="metric-card-title">Cápsulas vistas (24)</strong>
                <p className="metric-card-subtext">Este mes</p>
              </div>
            </div>
          </div>

          <Footer />

        </main>
      </div>
    </div>
  );
};

export default VistaPrincipal;

