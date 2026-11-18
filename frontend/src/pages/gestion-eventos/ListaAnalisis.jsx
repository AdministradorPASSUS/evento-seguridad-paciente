
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";
import "./styles/ListaAnalisis.css";

const ListaAnalisis = () => {
    const navigate = useNavigate();

    const [reportes, setReportes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterEstado, setFilterEstado] = useState("Todos");

    useEffect(() => {
        obtenerAnalisis();
    }, []);

    // Consultar exclusivamente el módulo de análisis
    const obtenerAnalisis = async () => {
        try {
            setLoading(true);

            const response = await api.get("/analisis");

            const data = response.data.data || [];

            setReportes(Array.isArray(data) ? data : []);

        } catch (error) {
            const status = error.response?.status;

            let mensaje = "No se pudo cargar el listado de análisis.";

            if (status === 403) {
                mensaje = "No tienes permisos para consultar los análisis.";
            } else if (status === 401) {
                mensaje = "Tu sesión ha expirado. Inicia sesión nuevamente.";
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

    // Determinar si el reporte tiene un análisis registrado
    const tieneAnalisis = (reporte) => {
        return Boolean(Number(reporte.tiene_analisis));
    };

    // Filtrar reportes por búsqueda y estado del análisis
    const reportesFiltrados = reportes.filter((rep) => {

        const busqueda = searchTerm.toLowerCase();

        const coincideBusqueda =
            rep.codigo?.toLowerCase().includes(busqueda) ||
            rep.nombre_completo?.toLowerCase().includes(busqueda) ||
            rep.numero_documento?.toLowerCase().includes(busqueda) ||
            rep.servicio?.toLowerCase().includes(busqueda);

        const estadoAnalisis = tieneAnalisis(rep)
            ? "Analizado"
            : "Pendiente";

        const coincideEstado =
            filterEstado === "Todos" ||
            estadoAnalisis === filterEstado;

        return coincideBusqueda && coincideEstado;
    });

    // Indicadores
    const totalAnalizados = reportes.filter(tieneAnalisis).length;
    const totalPendientes = reportes.length - totalAnalizados;

    // Clase visual del estado
    const getBadgeClass = (reporte) => {
        return tieneAnalisis(reporte)
            ? "la-badge-analizado"
            : "la-badge-pendiente";
    };

    // Abrir formulario de análisis
    const abrirAnalisis = (reporte) => {
        navigate(`/reportes/${reporte.id}/analisis`);
    };

    // Consultar detalle del reporte
    const verReporte = (reporte) => {
        navigate(`/reportes/${reporte.id}`);
    };

    return (
        <div className="la-main-wrapper">

            {/* Encabezado */}
            <div className="la-header-section">
                <div>
                    <h2 className="la-title">
                        Análisis de eventos
                    </h2>

                    <p className="la-subtitle">
                        Gestión, evaluación y seguimiento de los análisis
                        de eventos de seguridad del paciente.
                    </p>
                </div>
            </div>

            {/* Indicadores */}
            <div className="la-stats-container">

                <div className="la-stat-card">
                    <div className="la-stat-icon la-icon-total">
                        <i className="fa-solid fa-file-medical"></i>
                    </div>

                    <div>
                        <span className="la-stat-label">
                            Total de reportes
                        </span>

                        <strong className="la-stat-number">
                            {reportes.length}
                        </strong>
                    </div>
                </div>

                <div className="la-stat-card">
                    <div className="la-stat-icon la-icon-pendiente">
                        <i className="fa-solid fa-clock"></i>
                    </div>

                    <div>
                        <span className="la-stat-label">
                            Pendientes de análisis
                        </span>

                        <strong className="la-stat-number">
                            {totalPendientes}
                        </strong>
                    </div>
                </div>

                <div className="la-stat-card">
                    <div className="la-stat-icon la-icon-analizado">
                        <i className="fa-solid fa-circle-check"></i>
                    </div>

                    <div>
                        <span className="la-stat-label">
                            Analizados
                        </span>

                        <strong className="la-stat-number">
                            {totalAnalizados}
                        </strong>
                    </div>
                </div>

            </div>

            {/* Buscador y filtros */}
            <div className="la-controls-card">

                <div className="la-search-group">
                    <i className="fa-solid fa-magnifying-glass"></i>

                    <input
                        type="text"
                        placeholder="Buscar por código, paciente, documento o servicio..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="la-filter-group">
                    <label htmlFor="la-filter-estado">
                        Estado del análisis:
                    </label>

                    <select
                        id="la-filter-estado"
                        value={filterEstado}
                        onChange={(e) => setFilterEstado(e.target.value)}
                    >
                        <option value="Todos">Todos</option>
                        <option value="Pendiente">Pendientes</option>
                        <option value="Analizado">Analizados</option>
                    </select>
                </div>

            </div>

            {/* Tabla de análisis */}
            <div className="la-table-container">

                {loading ? (

                    <div className="la-state-message">
                        <div className="la-spinner"></div>
                        <span>Cargando análisis...</span>
                    </div>

                ) : reportesFiltrados.length === 0 ? (

                    <div className="la-state-message">
                        <i className="fa-solid fa-folder-open"></i>

                        <span>
                            No se encontraron registros de análisis.
                        </span>
                    </div>

                ) : (

                    <table className="la-table">

                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Fecha de registro</th>
                                <th>Paciente</th>
                                <th>Documento</th>
                                <th>Sede / Servicio</th>
                                <th>Estado del análisis</th>
                                <th className="la-th-actions">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {reportesFiltrados.map((rep) => (

                                <tr key={rep.id}>

                                    <td className="la-td-code">
                                        {rep.codigo || "N/A"}
                                    </td>

                                    <td>
                                        {rep.created_at
                                            ? new Date(rep.created_at).toLocaleDateString()
                                            : "N/A"}
                                    </td>

                                    <td className="la-td-name">
                                        {rep.nombre_completo || "N/A"}
                                    </td>

                                    <td>
                                        {rep.numero_documento || "N/A"}
                                    </td>

                                    <td>
                                        <span className="la-sede-tag">
                                            {rep.sede || "N/A"}
                                        </span>

                                        <small className="la-servicio-subtext">
                                            {rep.servicio || "Sin servicio"}
                                        </small>
                                    </td>

                                    <td>
                                        <span className={`la-status-badge ${getBadgeClass(rep)}`}>
                                            {tieneAnalisis(rep)
                                                ? "Analizado"
                                                : "Pendiente"}
                                        </span>
                                    </td>

                                    <td className="la-td-actions">

                                        <button
                                            className="la-btn-detail"
                                            onClick={() => verReporte(rep)}
                                            title="Ver detalle del reporte"
                                        >
                                            <i className="fa-solid fa-eye"></i>
                                        </button>

                                        <button
                                            className="la-btn-analysis"
                                            onClick={() => abrirAnalisis(rep)}
                                            title={
                                                tieneAnalisis(rep)
                                                    ? "Consultar análisis"
                                                    : "Realizar análisis"
                                            }
                                        >
                                            <i className={`fa-solid ${
                                                tieneAnalisis(rep)
                                                    ? "fa-clipboard-check"
                                                    : "fa-file-circle-plus"
                                            }`}></i>
                                        </button>

                                    </td>

                                </tr>

                            ))}
                        </tbody>

                    </table>

                )}

            </div>

            {/* Contador */}
            <div className="la-footer-counter">
                Mostrando <strong>{reportesFiltrados.length}</strong> de{" "}
                <strong>{reportes.length}</strong> registros
            </div>

        </div>
    );
};

export default ListaAnalisis;
