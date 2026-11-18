
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./styles/DetalleReporteAsignacion.css";
import UserSelector from "../../components/UserSelector";
import api from "../../services/api";

const DetalleReporteAsignacion = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [reporte, setReporte] = useState(null);
    const [loading, setLoading] = useState(true);

    const [usuariosAsignadosIds, setUsuariosAsignadosIds] = useState([]);
    const [savingAsignacion, setSavingAsignacion] = useState(false);

    // =========================================
    // OBTENER INFORMACIÓN DEL REPORTE
    // =========================================

    useEffect(() => {
        const obtenerReporte = async () => {
            try {
                setLoading(true);

                const response = await api.get(`/reportes/${id}`);
                const reporteData = response.data.data || response.data;

                setReporte(reporteData);

                // Precargar usuarios asignados
                const listaAsignados =
                    reporteData.usuariosAsignados ||
                    reporteData.usuarios_asignados ||
                    [];

                if (Array.isArray(listaAsignados)) {
                    setUsuariosAsignadosIds(
                        listaAsignados.map((usuario) => usuario.id)
                    );
                }

            } catch (error) {
                const mensaje =
                    error.response?.data?.message ||
                    "No se pudo cargar la información del reporte.";

                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: mensaje,
                    confirmButtonColor: "#00933f",
                });

                navigate("/vista-principal");

            } finally {
                setLoading(false);
            }
        };

        if (id) {
            obtenerReporte();
        }
    }, [id, navigate]);

    // =========================================
    // GUARDAR ASIGNACIÓN DE RESPONSABLES
    // =========================================

    const handleGuardarAsignacion = async () => {
        try {
            setSavingAsignacion(true);

            const idsAEnviar = Array.isArray(usuariosAsignadosIds)
                ? usuariosAsignadosIds.map((item) =>
                    typeof item === "object" && item !== null
                        ? item.value ?? item.id
                        : item
                )
                : [];

            await api.post(`/reportes/${id}/asignar`, {
                usuarios_ids: idsAEnviar,
            });

            Swal.fire({
                icon: "success",
                title: "Asignación Guardada",
                text: "Los responsables han sido asignados correctamente.",
                confirmButtonColor: "#00933f",
            });

        } catch (error) {
            const mensaje =
                error.response?.data?.message ||
                "No se pudo guardar la asignación.";

            Swal.fire({
                icon: "error",
                title: "Error",
                text: mensaje,
                confirmButtonColor: "#00933f",
            });

        } finally {
            setSavingAsignacion(false);
        }
    };

    // =========================================
    // ESTADOS DE CARGA
    // =========================================

    if (loading) {
        return (
            <div className="detalle-reporte-loading">
                Cargando detalles del reporte...
            </div>
        );
    }

    if (!reporte) return null;

    // =========================================
    // RENDERIZADO
    // =========================================

    return (
        <div className="crear-reporte-container">

            {/* SECCIÓN 1: DETALLE GENERAL */}

            <h2 className="detalle-reporte-title">
                Detalle del Reporte: {reporte.codigo}
            </h2>

            <p className="detalle-reporte-subtitle">
                Información registrada y gestión de responsables del evento de seguridad.
            </p>

            <div className="detalle-reporte-form-layout detalle-reporte-general">

                {/* Estado, código y fecha */}

                <div className="detalle-reporte-info-box">

                    <div className="detalle-reporte-info-item">
                        <span>ESTADO ACTUAL</span>
                        <strong className="detalle-reporte-status">
                            {reporte.estado}
                        </strong>
                    </div>

                    <div className="detalle-reporte-info-item">
                        <span>CÓDIGO ÚNICO</span>
                        <strong>{reporte.codigo}</strong>
                    </div>

                    <div className="detalle-reporte-info-item">
                        <span>FECHA DE REGISTRO</span>
                        <strong>
                            {reporte.created_at
                                ? new Date(reporte.created_at).toLocaleString()
                                : "N/A"}
                        </strong>
                    </div>

                </div>

                {/* Documento y nombre */}

                <div className="crear-reporte-grid-2 detalle-reporte-grid-spacing">

                    <div className="crear-reporte-field-group">
                        <label className="crear-reporte-label">
                            N° Documento Paciente
                        </label>

                        <input
                            type="text"
                            className="register-field-input"
                            value={reporte.numero_documento || ""}
                            disabled
                        />
                    </div>

                    <div className="crear-reporte-field-group">
                        <label className="crear-reporte-label">
                            Nombre Completo del Paciente
                        </label>

                        <input
                            type="text"
                            className="register-field-input"
                            value={reporte.nombre_completo || ""}
                            disabled
                        />
                    </div>

                </div>

                {/* Edad, sede y servicio */}

                <div className="crear-reporte-grid-3 detalle-reporte-grid-spacing">

                    <div className="crear-reporte-field-group">
                        <label className="crear-reporte-label">Edad</label>

                        <input
                            type="text"
                            className="register-field-input"
                            value={reporte.edad || ""}
                            disabled
                        />
                    </div>

                    <div className="crear-reporte-field-group">
                        <label className="crear-reporte-label">Sede</label>

                        <input
                            type="text"
                            className="register-field-input"
                            value={reporte.sede || ""}
                            disabled
                        />
                    </div>

                    <div className="crear-reporte-field-group">
                        <label className="crear-reporte-label">Servicio</label>

                        <input
                            type="text"
                            className="register-field-input"
                            value={reporte.servicio || ""}
                            disabled
                        />
                    </div>

                </div>

                {/* Descripción */}

                <div className="crear-reporte-field-group detalle-reporte-field-spacing">
                    <label className="crear-reporte-label">
                        Descripción Detallada del Evento
                    </label>

                    <textarea
                        rows="3"
                        className="register-field-input"
                        value={reporte.descripcion_evento || ""}
                        disabled
                    />
                </div>

                {/* Evidencia adjunta */}

                <div className="crear-reporte-field-group detalle-reporte-field-spacing">
                    <label className="crear-reporte-label">
                        Evidencia Adjunta
                    </label>

                    {reporte.evidencia_url ? (
                        <a
                            href={reporte.evidencia_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="detalle-reporte-file-link"
                        >
                            Ver / Descargar Archivo Adjunto 📄
                        </a>
                    ) : (
                        <span className="detalle-reporte-no-file">
                            No se adjuntó evidencia.
                        </span>
                    )}
                </div>

            </div>

            {/* SECCIÓN 2: ASIGNACIÓN DE RESPONSABLES */}

            <div className="detalle-reporte-asignacion">

                <h3 className="crear-reporte-title detalle-reporte-asignacion-title">
                    Asignación de Responsables
                </h3>

                <div className="crear-reporte-form-layout">

                    <div className="crear-reporte-grid-equal-2">

                        <div className="crear-reporte-field-group">
                            <label className="crear-reporte-label">
                                RELACIONADO CON:
                            </label>

                            <input
                                type="text"
                                className="register-field-input"
                                value={reporte.servicio || "N/A"}
                                disabled
                            />
                        </div>

                        <div className="crear-reporte-field-group">
                            <label className="crear-reporte-label">
                                ESTADO
                            </label>

                            <div className="detalle-reporte-status-container">
                                <span className={`lr-status-badge ${getBadgeClass(reporte.estado)}`}>
                                    {reporte.estado || "Pendiente"}
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* Selector de usuarios */}

                    <div className="detalle-reporte-selector">
                        <UserSelector
                            label="ASIGNADO A:"
                            placeholder="Buscar y seleccionar responsables..."
                            value={usuariosAsignadosIds}
                            onChange={setUsuariosAsignadosIds}
                        />
                    </div>

                    {/* Botón guardar */}

                    <div className="detalle-reporte-save-container">
                        <button
                            type="button"
                            className="detalle-reporte-btn-save"
                            onClick={handleGuardarAsignacion}
                            disabled={savingAsignacion}
                        >
                            {savingAsignacion
                                ? "Guardando..."
                                : "Guardar Asignación ✅"}
                        </button>
                    </div>

                </div>

            </div>

            {/* BOTÓN REGRESAR */}

            <div className="detalle-reporte-actions">
                <button
                    type="button"
                    onClick={() => navigate("/vista-principal")}
                    className="detalle-reporte-btn-back"
                >
                    Regresar a la Vista Principal
                </button>
            </div>

        </div>
    );
};

// =========================================
// FUNCIÓN AUXILIAR PARA ESTADOS
// =========================================

const getBadgeClass = (estado) => {
    switch (estado?.toLowerCase()) {
        case "cerrado":
            return "lr-badge-cerrado";

        case "en revisión":
        case "en revision":
            return "lr-badge-revision";

        case "en investigación":
        case "en investigacion":
            return "lr-badge-investigacion";

        default:
            return "lr-badge-pendiente";
    }
};

export default DetalleReporteAsignacion;
