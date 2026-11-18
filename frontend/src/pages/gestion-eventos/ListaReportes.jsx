import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import api from "../../services/api";
import './styles/ListaReportes.css';

const ListaReportes = () => {
  const navigate = useNavigate();
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");

  useEffect(() => {
    obtenerReportes();
  }, []);

  const obtenerReportes = async () => {
    try {
      setLoading(true);
      const response = await api.get("/reportes");
      // Adapta segun la respuesta de tu API (ej: response.data.data o response.data)
      const data = response.data.data || response.data;
      setReportes(Array.isArray(data) ? data : []);
    } catch (error) {
      const status = error.response?.status;

      let mensaje = "No se pudieron cargar los reportes.";

      if (status === 403) {
        mensaje = "No tienes permisos para consultar el listado de reportes. Contacta al administrador del sistema.";
      } else if (status === 401) {
        mensaje = "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
      } else if (error.response?.data?.message) {
        mensaje = error.response.data.message;
      }

      Swal.fire({
        icon: status === 403 ? "warning" : "error",
        title: status === 403 ? "Acceso restringido" : "Error al cargar",
        text: mensaje,
        confirmButtonColor: "#00933f",
        confirmButtonText: "Entendido"
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtrado dinámico en frontend
  const reportesFiltrados = reportes.filter((rep) => {
    const coincideBusqueda =
      rep.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.numero_documento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.servicio?.toLowerCase().includes(searchTerm.toLowerCase());

    const coincideEstado = filterEstado === "Todos" || rep.estado === filterEstado;

    return coincideBusqueda && coincideEstado;
  });

  const getBadgeClass = (estado) => {
    if (!estado) return "lr-badge-pendiente";

    // Normalizamos quitando espacios extra y acentos para evitar fallos
    const estadoClean = estado.toLowerCase().trim();

    if (estadoClean.includes("cerrado")) return "lr-badge-cerrado";
    if (estadoClean.includes("revision") || estadoClean.includes("revisión")) return "lr-badge-revision";
    if (estadoClean.includes("analizado")) return "lr-badge-analizado";

    return "lr-badge-pendiente";
  };


  return (
    <div className="lr-main-wrapper">
      {/* Encabezado */}
      <div className="lr-header-section">
        <div>
          <h2 className="lr-title">Listado General de Reportes</h2>
          <p className="lr-subtitle">
            Gestión y seguimiento de eventos de seguridad del paciente registrados en el sistema.
          </p>
        </div>
        <button
          className="lr-btn-primary"
          onClick={() => navigate("/crear-reporte")}
        >
          <i className="fa-solid fa-plus"></i> Nuevo Reporte
        </button>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="lr-controls-card">
        <div className="lr-search-group">
          <span className="lr-search-icon">🔍</span>
          <input
            type="text"
            className="lr-search-input"
            placeholder="Buscar por código, paciente, documento o servicio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="lr-filter-group">
          <label htmlFor="lr-select-estado">Estado:</label>
          <select
            id="lr-select-estado"
            className="lr-select-input"
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
          >
            <option value="Todos">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En revisión">En revisión</option>
            <option value="Analizado">Analizado</option>
            <option value="Cerrado">Cerrado</option>
          </select>
        </div>
      </div>

      {/* Tabla de Resultados */}
      <div className="lr-table-container">
        {loading ? (
          <div className="lr-state-message">
            <div className="lr-spinner"></div>
            <span>Cargando listado de reportes...</span>
          </div>
        ) : reportesFiltrados.length === 0 ? (
          <div className="lr-state-message empty">
            <span>📋 No se encontraron reportes que coincidan con la búsqueda.</span>
          </div>
        ) : (
          <table className="lr-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Fecha Reg.</th>
                <th>Paciente</th>
                <th>Documento</th>
                <th>Sede / Servicio</th>
                <th>Estado</th>
                <th>Plan de acción</th>
                <th className="lr-th-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reportesFiltrados.map((rep) => (
                <tr key={rep.id || rep.codigo}>
                  <td className="lr-td-code">{rep.codigo}</td>
                  <td>
                    {rep.created_at
                      ? new Date(rep.created_at).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="lr-td-name">{rep.nombre_completo}</td>
                  <td>{rep.numero_documento}</td>
                  <td>
                    <span className="lr-sede-tag">{rep.sede}</span>
                    <small className="lr-servicio-subtext">{rep.servicio}</small>
                  </td>
                  <td>
                    <span className={`lr-status-badge ${getBadgeClass(rep.estado)}`}>
                      {rep.estado || "Pendiente"}
                    </span>
                  </td>
                  <td>
                    {rep.plan_accion_exists ? (
                      <span className="lr-plan-si">Registrado</span>
                    ) : (
                      <span className="lr-plan-no">No registrado</span>
                    )}
                  </td>
                  <td className="lr-td-actions">
                    <button
                      className="lr-btn-view"
                      onClick={() => navigate(`/reportes/${rep.id}`)}
                      title="Ver detalle completo"
                    >
                      <i className="fa-solid fa-eye"></i>
                    </button>

                    <button
                      className="lr-btn-view"
                      onClick={() => navigate(`/reportes/${rep.id}/asignar`)}
                      title="Asignar Responsables"
                    >
                      <i className="fa-solid fa-user-plus"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Resumen inferior */}
      <div className="lr-footer-counter">
        Mostrando <strong>{reportesFiltrados.length}</strong> de <strong>{reportes.length}</strong> reportes en total
      </div>
    </div>
  );
};

export default ListaReportes;