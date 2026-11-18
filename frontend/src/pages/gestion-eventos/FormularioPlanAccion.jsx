
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";
import "./styles/FormularioPlanAccion.css";

const crearAccionVacia = () => ({
    que: "",
    quien: "",
    cuando: "",
    para_que: "",
    donde: "",
    estado_plan_accion: "Pendiente",
    fecha_ejecucion: "",
    estado_actividad: "",
});

const FormularioPlanAccion = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [acciones, setAcciones] = useState([crearAccionVacia()]);

    const [reporte, setReporte] = useState(null);
    const [analisis, setAnalisis] = useState(null);

    // Cargar las actividades previamente guardadas
    useEffect(() => {
        const cargarInformacion = async () => {
            try {
                setLoading(true);

                const [reporteResponse, analisisResponse, accionesResponse] =
                    await Promise.all([
                        api.get(`/reportes/${id}`),
                        api.get(`/reportes/${id}/analisis`),
                        api.get(`/reportes/${id}/plan-accion`)
                    ]);

                // Cargar reporte
                setReporte(
                    reporteResponse.data?.data ?? reporteResponse.data
                );

                // Cargar análisis
                setAnalisis(
                    analisisResponse.data?.data ?? analisisResponse.data
                );

                // Cargar actividades existentes
                const data =
                    accionesResponse.data?.data ?? accionesResponse.data;

                if (Array.isArray(data) && data.length > 0) {
                    setAcciones(
                        data.map((accion) => ({
                            ...crearAccionVacia(),
                            ...accion,
                            cuando: accion.cuando
                                ? String(accion.cuando).substring(0, 10)
                                : "",
                            fecha_ejecucion: accion.fecha_ejecucion
                                ? String(accion.fecha_ejecucion).substring(0, 10)
                                : ""
                        }))
                    );
                } else {
                    setAcciones([crearAccionVacia()]);
                }
            } catch (error) {
                console.error(
                    "Error al cargar la información:",
                    error.response?.data || error
                );

                // Si falla la carga de actividades, permitir registrar una nueva.
                setAcciones((actuales) =>
                    actuales.length > 0 ? actuales : [crearAccionVacia()]
                );
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            cargarInformacion();
        }
    }, [id]);

    // Actualizar un campo de una actividad
    const handleInputChange = (index, field, value) => {
        setAcciones((accionesActuales) =>
            accionesActuales.map((accion, i) =>
                i === index
                    ? { ...accion, [field]: value }
                    : accion
            )
        );
    };

    // Agregar otra actividad
    const agregarFilaAccion = () => {
        setAcciones((accionesActuales) => [
            ...accionesActuales,
            crearAccionVacia(),
        ]);
    };

    // Eliminar una actividad
    const eliminarFilaAccion = async (index) => {
        if (acciones.length === 1) {
            await Swal.fire({
                icon: "warning",
                title: "Atención",
                text: "Debe registrar al menos una acción en el plan.",
                confirmButtonText: "Entendido",
                confirmButtonColor: "#00933f",
            });

            return;
        }

        const resultado = await Swal.fire({
            icon: "question",
            title: "¿Eliminar actividad?",
            text: "La actividad se quitará del formulario.",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
        });

        if (resultado.isConfirmed) {
            setAcciones((accionesActuales) =>
                accionesActuales.filter((_, i) => i !== index)
            );
        }
    };

    // Guardar el plan de acción
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            await api.post(
                `/reportes/${id}/plan-accion`,
                { acciones }
            );

            await Swal.fire({
                icon: "success",
                title: "¡Guardado!",
                text: "El plan de acción se ha registrado correctamente.",
                confirmButtonText: "Continuar",
                confirmButtonColor: "#00933f",
            });

            navigate(`/reportes/${id}/plan-accion`);
        } catch (error) {
            console.error(
                "Error al guardar el plan de acción:",
                error.response?.data || error
            );

            const mensaje =
                error.response?.data?.message ||
                "Ocurrió un error al guardar el plan de acción.";

            await Swal.fire({
                icon: "error",
                title: "No se pudo guardar",
                text: mensaje,
                confirmButtonText: "Entendido",
                confirmButtonColor: "#00933f",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="fpa-loading">
                <div className="fpa-spinner"></div>
                <p>Cargando formulario de plan de acción...</p>
            </div>
        );
    }

    return (
        <div className="fpa-container">
            <header className="fpa-header">
                <div>
                    <h2>PLAN DE ACCIÓN Y BARRERAS DE SEGURIDAD</h2>
                    <p>
                        Registra las actividades de mejora para el
                        evento número {id}.
                    </p>
                </div>

                <button
                    type="button"
                    className="fpa-btn-back"
                    disabled={saving}
                    onClick={() =>
                        navigate(`/reportes/${id}/plan-accion`)
                    }
                >
                    <i className="fa-solid fa-arrow-left"></i>
                    Volver al listado
                </button>
            </header>

            <form
                onSubmit={handleSubmit}
                className="fpa-form-card"
            >
                <h3 className="fpa-section-heading">
                    DEFINICIÓN DE ACCIONES DE MEJORA
                </h3>

                {acciones.map((accion, index) => (
                    <section
                        className="fpa-accion-card"
                        key={accion.id ?? index}
                    >
                        <div className="fpa-accion-header">
                            <h4>Actividad #{index + 1}</h4>

                            {acciones.length > 1 && (
                                <button
                                    type="button"
                                    className="fpa-btn-delete"
                                    disabled={saving}
                                    onClick={() =>
                                        eliminarFilaAccion(index)
                                    }
                                >
                                    <i className="fa-solid fa-trash-can"></i>
                                    Eliminar
                                </button>
                            )}
                        </div>

                        <div className="fpa-grid-2">
                            <div className="fpa-form-group">
                                <label>¿Qué se va a hacer? *</label>

                                <textarea
                                    rows={3}
                                    className="fpa-textarea"
                                    value={accion.que}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "que",
                                            e.target.value
                                        )
                                    }
                                    required
                                    disabled={saving}
                                />
                            </div>

                            <div className="fpa-form-group">
                                <label>¿Para qué? (Objetivo) *</label>

                                <textarea
                                    rows={3}
                                    className="fpa-textarea"
                                    value={accion.para_que}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "para_que",
                                            e.target.value
                                        )
                                    }
                                    required
                                    disabled={saving}
                                />
                            </div>
                        </div>

                        <div className="fpa-grid-3">
                            <div className="fpa-form-group">
                                <label>¿Quién? (Responsable) *</label>

                                <input
                                    type="text"
                                    className="fpa-input"
                                    value={accion.quien}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "quien",
                                            e.target.value
                                        )
                                    }
                                    required
                                    disabled={saving}
                                />
                            </div>

                            <div className="fpa-form-group">
                                <label>¿Cuándo? (Fecha límite) *</label>

                                <input
                                    type="date"
                                    className="fpa-input"
                                    value={accion.cuando}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "cuando",
                                            e.target.value
                                        )
                                    }
                                    required
                                    disabled={saving}
                                />
                            </div>

                            <div className="fpa-form-group">
                                <label>¿Dónde? (Lugar o servicio) *</label>

                                <input
                                    type="text"
                                    className="fpa-input"
                                    value={accion.donde}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "donde",
                                            e.target.value
                                        )
                                    }
                                    required
                                    disabled={saving}
                                />
                            </div>
                        </div>

                        <div className="fpa-grid-3">
                            <div className="fpa-form-group">
                                <label>Estado del plan de acción *</label>

                                <select
                                    className="fpa-select"
                                    value={accion.estado_plan_accion}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "estado_plan_accion",
                                            e.target.value
                                        )
                                    }
                                    required
                                    disabled={saving}
                                >
                                    <option value="Nuevo">
                                        Nuevo
                                    </option>
                                    <option value="En curso (Asignado)">
                                        En curso (Asignado)
                                    </option>
                                    <option value="En curso (Planificado)">
                                        En curso (Planificado)
                                    </option>
                                    <option value="En espera">
                                        En espera
                                    </option>
                                    <option value="Pendientte aprobacion">
                                        Pendiente aprobación
                                    </option>
                                    <option value="Aprobado">
                                        Aprobado
                                    </option>
                                    <option value="Rechazado">
                                        Rechazado
                                    </option>
                                    <option value="No aplica">
                                        No aplica
                                    </option>
                                </select>
                            </div>

                            <div className="fpa-form-group">
                                <label>Fecha de ejecución (Opcional)</label>

                                <input
                                    type="date"
                                    className="fpa-input"
                                    value={accion.fecha_ejecucion || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "fecha_ejecucion",
                                            e.target.value
                                        )
                                    }
                                    disabled={saving}
                                />
                            </div>

                            {/* <div className="fpa-form-group">
                                <label>
                                    Estado de la actividad (Opcional)
                                </label>

                                <input
                                    type="text"
                                    className="fpa-input"
                                    placeholder="Ej. Aprobada, En revisión..."
                                    value={accion.estado_actividad || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "estado_actividad",
                                            e.target.value
                                        )
                                    }
                                    disabled={saving}
                                />
                            </div> */}
                        </div>
                    </section>
                ))}

                <div className="fpa-actions-container">
                    <button
                        type="button"
                        className="fpa-btn-add"
                        onClick={agregarFilaAccion}
                        disabled={saving}
                    >
                        <i className="fa-solid fa-plus"></i>
                        Añadir actividad
                    </button>
                </div>

                <div className="fpa-footer-actions">
                    <button
                        type="button"
                        className="fpa-btn-cancel"
                        onClick={() =>
                            navigate(`/reportes/${id}/plan-accion`)
                        }
                        disabled={saving}
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className="fpa-btn-save"
                        disabled={saving}
                    >
                        {saving ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                Guardando...
                            </>
                        ) : (
                            <>
                                Guardar plan de acción
                                <i className="fa-solid fa-floppy-disk"></i>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioPlanAccion;
