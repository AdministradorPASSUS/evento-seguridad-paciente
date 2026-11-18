import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";
import "./styles/AnalisisEvento.css";
import Select from 'react-select';

const AnalisisEvento = () => {
    const { id } = useParams(); // ID del reporte
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [analisisExiste, setAnalisisExiste] = useState(false);

    const opcionesParticipantes = [
        { value: 'pacientes', label: 'Pacientes' },
        { value: 'familiares', label: 'Familiares' },
        { value: 'colaborador', label: 'Colaborador' },
        { value: 'no', label: 'No' }
    ];

    const opcionesDocumentos = [
        { value: 'Reporte del evento', label: 'Reporte del evento' },
        { value: 'Registros clínicos', label: 'Registros clínicos' },
        { value: 'Protocolos y guías', label: 'Protocolos y guías' },
        { value: 'Declaraciones escritas del personal (si aplica)', label: 'Declaraciones escritas del personal (si aplica)' },
        { value: 'Informacion sobre las condiciones de trabajo relevantes al momento del evento', label: 'Informacion sobre las condiciones de trabajo relevantes al momento del evento' },
        { value: 'Otros', label: 'Otros' }
    ];


    const opcionesPorFactor = {
        factor_paciente: [
            { value: 'Patología y comorbilidades', label: 'Patología y comorbilidades' },
            { value: 'Lenguaje y comunicación', label: 'Lenguaje y comunicación' },
            { value: 'Personalidad', label: 'Personalidad' },
            { value: 'Factores psicológicos', label: 'Factores psicológicos' },
            { value: 'Factores sociales', label: 'Factores sociales' },
            { value: 'No identificado', label: 'No identificado' }
        ],
        factor_individuo: [
            { value: 'Conocimientos y habilidades', label: 'Conocimientos y habilidades' },
            { value: 'Competencia', label: 'Competencia' },
            { value: 'Experiencia profesional', label: 'Experiencia profesional' },
            { value: 'Salud física o mental', label: 'Salud física o mental' },
            { value: 'Valores y comportamiento profesional', label: 'Valores y comportamiento profesional' },
            { value: 'Retraso o demoras para realizar las actividades asignadas', label: 'Retraso o demoras para realizar las actividades asignadas' },
            { value: 'Capacidad de anticiparse a las necesidades del paciente', label: 'Capacidad de anticiparse a las necesidades del paciente' },
            { value: 'Capacidad de anticipar riesgo', label: 'Capacidad de anticipar riesgo' },
            { value: 'No identificado', label: 'No identificado' },

        ],
        factor_tarea: [
            { value: 'Diseño de las tareas y claridad en su estructura', label: 'Diseño de las tareas y claridad en su estructura' },
            { value: 'Disponibilidad, divulgación y uso de sus protocolos', label: 'Disponibilidad, divulgación y uso de sus protocolos' },
            { value: 'Disponibilidad y precision', label: 'Disponibilidad y precision' },
            { value: 'No identificado', label: 'No identificado' }
        ],
        factor_informacion: [
            { value: 'Las guías y protocolos están publicados en la intranet', label: 'Las guías y protocolos están publicados en la intranet' },
            { value: 'Otros', label: 'Otros' },
            { value: 'Hardware (diseño y mantenimiento', label: 'Hardware (diseño y mantenimiento' },
            { value: 'Software (diseño y mantenimiento)', label: 'Software (diseño y mantenimiento)' },

            { value: 'Contenido clínico y/o apoyo de decisiones', label: 'Contenido clínico y/o apoyo de decisiones' },

            { value: 'Integración en el flujo de trabajo', label: 'Integración en el flujo de trabajo' },

            { value: 'Protección de datos', label: 'Protección de datos' },

            { value: 'Interfaz humano-dispositivo', label: 'Interfaz humano-dispositivo' },

            { value: 'No identificado', label: 'No identificado' },
        ],
        factor_equipo: [
            { value: 'Comunicación verbal', label: 'Comunicación verbal' },
            { value: 'Comunicación escrita', label: 'Comunicación escrita' },
            { value: 'Supervisión mutua', label: 'Supervisión mutua' },
            { value: 'Búsqueda y disponibilidad de ayuda cuando sea necesario', label: 'Búsqueda y disponibilidad de ayuda cuando sea necesario' },
            { value: 'Estructura del equipo (coherencia, consistencia, liderazgo)', label: 'Estructura del equipo (coherencia, consistencia, liderazgo)' },
            { value: 'Apoyo mutuo', label: 'Apoyo mutuo' },
            { value: 'Consistencia de la situación y responsabilidad compartida', label: 'Consistencia de la situación y responsabilidad compartida' },
            { value: 'Otros', label: 'Otros' },
            { value: 'No identificado', label: 'No identificado' },
        ],
        factor_ambiente: [
            { value: 'Carga de trabajo', label: 'Carga de trabajo' },
            { value: 'Suficiencia del personal', label: 'Suficiencia del personal' },
            { value: 'Patrones de turnos', label: 'Patrones de turnos' },
            { value: 'Diseño, disponibilidad y mantenimiento de equipos', label: 'Diseño, disponibilidad y mantenimiento de equipos' },
            { value: 'Soporte administrativo y gerencial', label: 'Soporte administrativo y gerencial' },
            { value: 'Ambiente físico', label: 'Ambiente físico' },
            { value: 'Retraso de tiempos', label: 'Retraso de tiempos' },
            { value: 'Sobreocupación de áreas terapéutica', label: 'Sobreocupación de áreas terapéutica' },
            { value: 'Otros', label: 'Otros' },
            { value: 'No identificado', label: 'No identificado' },
        ],
        factor_organizacional: [
            { value: 'Recursos financieros y limitaciones financieras', label: 'Recursos financieros y limitaciones financieras' },
            { value: 'Estructura organizacional', label: 'Estructura organizacional' },
            { value: 'Política de personal', label: 'Política de personal' },
            { value: 'Tiempo de contratación del personal', label: 'Tiempo de contratación del personal' },
            { value: 'Rotación del personal', label: 'Rotación del personal' },
            { value: 'Entrenamiento y educación', label: 'Entrenamiento y educación' },
            { value: 'Políticas, estándares y metas', label: 'Políticas, estándares y metas' },
            { value: 'Cultura organizacional', label: 'Cultura organizacional' },
            { value: 'Prioridades institucionales', label: 'Prioridades institucionales' },
            { value: 'Estilo de liderazgo', label: 'Estilo de liderazgo' },

            { value: 'Tipo de contratación con EAPB-EPS', label: 'Tipo de contratación con EAPB-EPS' },
            { value: 'Otros', label: 'Otros' },
            { value: 'No identificado', label: 'No identificado' },
        ]
    };
    // Estado del formulario
    const [form, setForm] = useState({
        trayectoria_paciente: "",
        participantes_analisis: [],
        observaciones_involucrados: "",
        recopilacion_documentos: [],
        observaciones_recopilacion: "",
        aspectos_positivos: "",
        medidas_implementadas: "",
        fallas_activas: "",

        // Factores Contribuyentes (Activo, Items, Observaciones)
        factor_paciente_activo: false,
        factor_paciente_items: [],
        factor_paciente_obs: "",

        factor_individuo_activo: false,
        factor_individuo_items: [],
        factor_individuo_obs: "",

        factor_tarea_activo: false,
        factor_tarea_items: [],
        factor_tarea_obs: "",

        factor_informacion_activo: false,
        factor_informacion_items: [],
        factor_informacion_obs: "",

        factor_equipo_activo: false,
        factor_equipo_items: [],
        factor_equipo_obs: "",

        factor_ambiente_activo: false,
        factor_ambiente_items: [],
        factor_ambiente_obs: "",

        factor_organizacional_activo: false,
        factor_organizacional_items: [],
        factor_organizacional_obs: "",

        // Cierre y Clasificación
        clasificacion_evento: "",
        severidad: "",
        prevenible: "",
        aplica_plan_accion: "",
        link_video: "",
        documento_adjunto: null,
    });

    const eliminarArchivoNuevo = (indexEliminar) => {
        setForm((prev) => ({
            ...prev,
            documentos_adjuntos_nuevos: (
                prev.documentos_adjuntos_nuevos || []
            ).filter((_, index) => index !== indexEliminar)
        }));
    };

    const eliminarDocumentoRegistrado = (indexEliminar) => {
        setForm((prev) => ({
            ...prev,
            documentos_adjuntos_urls: (
                prev.documentos_adjuntos_urls || []
            ).filter((_, index) => index !== indexEliminar)
        }));
    };

    useEffect(() => {
        cargarAnalisisExistente();
    }, [id]);

    const cargarAnalisisExistente = async () => {
        try {
            setLoading(true);

            const response = await api.get(`/reportes/${id}/analisis`);

            // Laravel devuelve los datos dentro de response.data.data
            const data = response.data?.data;

            // Verificar que realmente exista un análisis
            if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
                setAnalisisExiste(false);
                return;
            }

            setAnalisisExiste(true);

            // Función auxiliar para normalizar arrays
            const ensureArray = (field) => {
                if (!field) return [];

                if (Array.isArray(field)) return field;

                try {
                    const parsed = JSON.parse(field);

                    if (Array.isArray(parsed)) {
                        return parsed;
                    }
                } catch (error) {
                    return String(field)
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean);
                }

                return [];
            };


            // Normalizar los valores recibidos desde Laravel.
            // Ningún campo controlado debe recibir null.
            const datosNormalizados = Object.fromEntries(
                Object.entries(data).map(([key, value]) => [
                    key,
                    value ?? ""
                ])
            );

            // Normalizar los valores booleanos de los factores
            const normalizarBooleano = (valor) =>
                valor === true || valor === 1 || valor === "1";

            setForm((prev) => ({
                ...prev,
                ...datosNormalizados,

                // Campos de texto
                trayectoria_paciente: data.trayectoria_paciente ?? "",
                observaciones_involucrados: data.observaciones_involucrados ?? "",
                observaciones_recopilacion: data.observaciones_recopilacion ?? "",
                aspectos_positivos: data.aspectos_positivos ?? "",
                medidas_implementadas: data.medidas_implementadas ?? "",
                fallas_activas: data.fallas_activas ?? "",

                // Clasificación
                clasificacion_evento: data.clasificacion_evento ?? "",
                severidad: data.severidad ?? "",
                prevenible: data.prevenible ?? "",
                aplica_plan_accion: data.aplica_plan_accion ?? "",
                link_video: data.link_video ?? "",

                // Arrays
                participantes_analisis: ensureArray(data.participantes_analisis),
                recopilacion_documentos: ensureArray(data.recopilacion_documentos),

                factor_paciente_items: ensureArray(data.factor_paciente_items),
                factor_individuo_items: ensureArray(data.factor_individuo_items),
                factor_tarea_items: ensureArray(data.factor_tarea_items),
                factor_informacion_items: ensureArray(data.factor_informacion_items),
                factor_equipo_items: ensureArray(data.factor_equipo_items),
                factor_ambiente_items: ensureArray(data.factor_ambiente_items),
                factor_organizacional_items: ensureArray(data.factor_organizacional_items),

                // Observaciones de factores
                factor_paciente_obs: data.factor_paciente_obs ?? "",
                factor_individuo_obs: data.factor_individuo_obs ?? "",
                factor_tarea_obs: data.factor_tarea_obs ?? "",
                factor_informacion_obs: data.factor_informacion_obs ?? "",
                factor_equipo_obs: data.factor_equipo_obs ?? "",
                factor_ambiente_obs: data.factor_ambiente_obs ?? "",
                factor_organizacional_obs: data.factor_organizacional_obs ?? "",

                // Estados de los factores
                factor_paciente_activo: normalizarBooleano(data.factor_paciente_activo),
                factor_individuo_activo: normalizarBooleano(data.factor_individuo_activo),
                factor_tarea_activo: normalizarBooleano(data.factor_tarea_activo),
                factor_informacion_activo: normalizarBooleano(data.factor_informacion_activo),
                factor_equipo_activo: normalizarBooleano(data.factor_equipo_activo),
                factor_ambiente_activo: normalizarBooleano(data.factor_ambiente_activo),
                factor_organizacional_activo: normalizarBooleano(data.factor_organizacional_activo),

                // Documentos
                documentos_adjuntos_urls: Array.isArray(data.documentos_adjuntos_urls)
                    ? data.documentos_adjuntos_urls
                    : [],

                documentos_adjuntos_nuevos: [],
            }));



        } catch (error) {

            if (error.response?.status === 404) {
                setAnalisisExiste(false);

                Swal.fire({
                    icon: "info",
                    title: "Análisis no registrado",
                    text: "Este reporte todavía no tiene un análisis registrado. Puedes completar el formulario y guardar el análisis.",
                    confirmButtonColor: "#00933f",
                });

                return;
            }

            console.error("Error al cargar el análisis:", error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No fue posible cargar la información del análisis.",
                confirmButtonColor: "#00933f",
            });

        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleFileChange = (e) => {
        const archivos = Array.from(e.target.files || []);

        if (archivos.length > 0) {
            setForm((prev) => ({
                ...prev,
                documentos_adjuntos_nuevos: [
                    ...(prev.documentos_adjuntos_nuevos || []),
                    ...archivos,
                ],
            }));
        }

        // Permite volver a seleccionar el mismo archivo
        e.target.value = "";
    };

    // Renderizador auxiliar para bloques de factores contribuyentes
    const renderFactorSection = (titulo, descripcion, keyPrefix) => {
        const isActive = form[`${keyPrefix}_activo`];

        return (
            <div className="ae-factor-card" key={keyPrefix}>
                <div className="ae-factor-header">
                    <div>
                        <h4 className="ae-factor-title">{titulo}</h4>
                        <span className="ae-factor-subtitle">{descripcion}</span>
                    </div>
                    <label className="ae-switch">
                        <input
                            type="checkbox"
                            name={`${keyPrefix}_activo`}
                            checked={Boolean(isActive)}
                            onChange={handleChange}
                        />
                        <span className="ae-slider round"></span>
                    </label>
                </div>

                {isActive && (
                    <div className="ae-factor-body animate-fade-in">
                        <div className="ae-form-group">
                            <label>* Seleccione según corresponda (Items):</label>

                            <Select
                                isMulti
                                name={`${keyPrefix}_items`}
                                options={opcionesPorFactor[keyPrefix] || []}
                                value={(opcionesPorFactor[keyPrefix] || []).filter(op =>
                                    (form[`${keyPrefix}_items`] || []).includes(op.value)
                                )}
                                onChange={(selectedOptions) => {
                                    const valoresSeleccionados = selectedOptions
                                        ? selectedOptions.map(op => op.value)
                                        : [];

                                    setForm({
                                        ...form,
                                        [`${keyPrefix}_items`]: valoresSeleccionados
                                    });
                                }}
                                placeholder="Buscar elementos..."
                                noOptionsMessage={() => "No hay más opciones"}
                                classNamePrefix="ae-select"
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                className="ae-select-container"
                            />
                        </div>

                        <div className="ae-form-group">
                            <label>* Observaciones:</label>
                            <textarea
                                name={`${keyPrefix}_obs`}
                                rows="3"
                                className="ae-textarea"
                                placeholder="Describa las observaciones de este factor..."
                                value={form[`${keyPrefix}_obs`] || ""}
                                onChange={handleChange}
                                required={isActive}
                            ></textarea>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            const formData = new FormData();

            Object.keys(form).forEach((key) => {
                const value = form[key];

                // No enviar estos campos en el recorrido general
                if (
                    key === "documento_adjunto" ||
                    key === "documentos_adjuntos_nuevos" ||
                    key === "documentos_adjuntos_urls"
                ) {
                    return;
                }

                if (value !== null && value !== undefined && value !== "") {
                    if (Array.isArray(value)) {
                        if (value.length > 0) {
                            formData.append(key, JSON.stringify(value));
                        }
                    } else if (typeof value === "boolean") {
                        formData.append(key, value ? "1" : "0");
                    } else {
                        formData.append(key, value);
                    }
                }
            });

            const documentosConservados = (
                form.documentos_adjuntos_urls || []
            ).map((documento) => {
                return typeof documento === "string"
                    ? documento
                    : documento.ruta;
            }).filter(Boolean);


            formData.append(
                "documentos_adjuntos_conservados",
                JSON.stringify(documentosConservados)
            );
            // Enviar los archivos nuevos
            if (form.documentos_adjuntos_nuevos?.length > 0) {
                form.documentos_adjuntos_nuevos.forEach((archivo) => {
                    formData.append("documentos_adjuntos[]", archivo);
                });
            }

            await api.post(`/reportes/${id}/analisis`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setAnalisisExiste(true);

            Swal.fire({
                icon: "success",
                title: "¡Guardado!",
                text: "El análisis del evento se ha guardado correctamente y el estado del reporte se actualizó.",
                confirmButtonColor: "#00933f",
            });

            navigate("/lista-reportes");

        } catch (error) {
            const mensaje =
                error.response?.data?.message ||
                "Ocurrió un error al guardar el análisis.";

            const erroresValidacion = error.response?.data?.errors;

            let detalleErrores = mensaje;

            if (erroresValidacion) {
                detalleErrores = Object.values(erroresValidacion)
                    .flat()
                    .join("<br>");
            }

            Swal.fire({
                icon: "error",
                title: "Error de validación",
                html: detalleErrores,
                confirmButtonColor: "#00933f",
            });

        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="ae-loading-container">
                <div className="ae-spinner"></div>
                <p>Cargando información del análisis...</p>
            </div>
        );
    }

    return (
        <div className="ae-container">

            <div className="ae-top-bar">
                <h2>ANÁLISIS DEL EVENTO</h2>

                <button
                    type="button"
                    className="ae-btn-action"
                    onClick={async () => {
                        try {
                            // Consultar el análisis registrado para este reporte
                            const response = await api.get(
                                `/reportes/${id}/analisis`
                            );

                            const data = response.data?.data;

                            // Verificar si realmente hay datos del análisis
                            const hayAnalisis =
                                data &&
                                typeof data === "object" &&
                                !Array.isArray(data) &&
                                Object.keys(data).length > 0;

                            if (!hayAnalisis) {
                                await Swal.fire({
                                    icon: "warning",
                                    title: "Análisis no registrado",
                                    text: "Debe completar y guardar el análisis del evento antes de acceder al plan de acción.",
                                    confirmButtonText: "Entendido",
                                    confirmButtonColor: "#00933f"
                                });

                                return;
                            }

                            // Si existe el análisis, permitir el acceso
                            navigate(`/reportes/${id}/plan-accion`);

                        } catch (error) {
                            console.error(
                                "Error al verificar el análisis:",
                                error
                            );

                            if (error.response?.status === 404) {
                                await Swal.fire({
                                    icon: "warning",
                                    title: "Análisis no registrado",
                                    text: "Debe completar y guardar el análisis del evento antes de acceder al plan de acción.",
                                    confirmButtonText: "Entendido",
                                    confirmButtonColor: "#00933f"
                                });

                                return;
                            }

                            await Swal.fire({
                                icon: "error",
                                title: "Error al verificar el análisis",
                                text: "No fue posible comprobar si el análisis está registrado. Inténtelo nuevamente.",
                                confirmButtonColor: "#00933f"
                            });
                        }
                    }}
                >
                    PLAN DE ACCIÓN{" "}
                    <i className="fa-solid fa-arrow-right"></i>
                </button>
            </div>


            <form onSubmit={handleSubmit} >
                <h3 className="ae-section-heading">INVESTIGACIÓN Y ANÁLISIS DE CAUSA BAJO EL PROTOCOLO DE LONDRES</h3>

                {/* Datos Generales */}
                <div className="ae-form-group">
                    <label>* Trayectoria del Paciente</label>
                    <textarea
                        name="trayectoria_paciente"
                        rows="3"
                        className="ae-textarea"
                        value={form.trayectoria_paciente ?? ""}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <div className="ae-grid-2">
                    <div className="ae-form-group">
                        <label>* Participantes en el análisis</label>
                        <Select
                            isMulti
                            name="participantes_analisis"
                            options={opcionesParticipantes}
                            // Convierte el array de strings de tu estado (ej. ["pacientes", "colaborador"]) 
                            // al formato de objetos que usa react-select
                            value={opcionesParticipantes.filter(op =>
                                (form.participantes_analisis || []).includes(op.value)
                            )}
                            onChange={(selectedOptions) => {
                                // Vuelve a pasarlo al formato de array de strings que espera tu API/backend
                                const valoresSeleccionados = selectedOptions ? selectedOptions.map(op => op.value) : [];
                                setForm({
                                    ...form,
                                    participantes_analisis: valoresSeleccionados
                                });
                            }}
                            placeholder="Seleccione opciones..."
                            noOptionsMessage={() => "No hay más opciones"}
                            // Opcional: si quieres que tenga estilos similares a tus clases "ae-input"
                            classNamePrefix="ae-select"
                        />
                    </div>
                    <div className="ae-form-group">
                        <label>* Observaciones Involucrados</label>
                        <textarea
                            name="observaciones_involucrados"
                            rows="2"
                            className="ae-textarea"
                            value={form.observaciones_involucrados ?? ""}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                </div>

                <div className="ae-grid-2">
                    <div className="ae-form-group">
                        <label>* Recopilación y Revisión de Documentos</label>
                        <Select
                            isMulti
                            name="recopilacion_documentos"
                            options={opcionesDocumentos}
                            value={opcionesDocumentos.filter(op =>
                                (form.recopilacion_documentos || []).includes(op.value)
                            )}
                            onChange={(selectedOptions) => {
                                const valoresSeleccionados = selectedOptions ? selectedOptions.map(op => op.value) : [];
                                setForm({
                                    ...form,
                                    recopilacion_documentos: valoresSeleccionados
                                });
                            }}
                            placeholder="Buscar elementos o seleccionar..."
                            noOptionsMessage={() => "No hay más opciones"}
                            classNamePrefix="ae-select"
                        />
                    </div>
                    <div className="ae-form-group">
                        <label>* Observaciones Recopilación</label>
                        <textarea
                            name="observaciones_recopilacion"
                            rows="2"
                            className="ae-textarea"
                            value={form.observaciones_recopilacion ?? ""}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                </div>

                <div className="ae-form-group">
                    <label>* Aspectos positivos identificados en el análisis</label>
                    <textarea
                        name="aspectos_positivos"
                        rows="3"
                        className="ae-textarea"
                        value={form.aspectos_positivos ?? ""}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <div className="ae-form-group">
                    <label>* Medidas Implementadas Después del Evento</label>
                    <textarea
                        name="medidas_implementadas"
                        rows="3"
                        className="ae-textarea"
                        value={form.medidas_implementadas ?? ""}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <div className="ae-form-group">
                    <label>* Fallas Activas</label>
                    <textarea
                        name="fallas_activas"
                        rows="3"
                        className="ae-textarea"
                        value={form.fallas_activas ?? ""}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                {/* Factores Contribuyentes */}
                <h3 className="ae-section-heading mt-4">FACTORES CONTRIBUYENTES: (FAVORECEN ACCIONES INSEGURAS)</h3>

                {renderFactorSection("PACIENTE", "Factores del paciente que influyeron en el evento", "factor_paciente")}
                {renderFactorSection("INDIVIDUO", "Factores míos o de los miembros del equipo que influyeron en el evento", "factor_individuo")}
                {renderFactorSection("TAREA", "Relacionado con diseño del proceso de atención", "factor_tarea")}
                {renderFactorSection("SISTEMAS DE INFORMACIÓN Y TECNOLOGÍA", "Aspectos relacionados con la tecnología e información que influyeron en el evento", "factor_informacion")}
                {renderFactorSection("EQUIPO DE TRABAJO", "¿El equipo de trabajo funcionó adecuadamente?", "factor_equipo")}
                {renderFactorSection("AMBIENTE DE TRABAJO", "Factores del ambiente o entorno que contribuyeron al evento", "factor_ambiente")}
                {renderFactorSection("ORGANIZACIONALES, DE GESTION Y CULTURA", "Factores propios de la organización que influyeron en el evento", "factor_organizacional")}

                {/* Clasificación y Cierre */}
                <h3 className="ae-section-heading mt-4">CLASIFICACIÓN Y CIERRE</h3>
                <div className="ae-grid-2 cierre">
                    <div className="ae-form-group">
                        <label>Clasificación del Evento</label>
                        <select
                            name="clasificacion_evento"
                            className="ae-select"
                            value={form.clasificacion_evento ?? ""}
                            onChange={handleChange}
                        >
                            <option value="">Seleccione...</option>
                            <option value="Complicacion">Complicación</option>
                            <option value="Incidente">Incidente</option>
                            <option value="Indicio de atencion insegura descartado-atencion segura">Indicio de atención insegura descartado-atención segura</option>
                            <option value="Evento adverso">Evento adverso</option>
                            <option value="No corresponde a evento de seguridaad del paciente">No corresponde a evento de seguridaad del paciente</option>
                        </select>
                    </div>

                    <div className="ae-form-group">
                        <label>Severidad</label>
                        <select
                            name="severidad"
                            className="ae-select"
                            value={form.severidad ?? ""}
                            onChange={handleChange}
                        >
                            <option value="">Seleccione...</option>
                            <option value="Leve">Leve</option>
                            <option value="Moderada">Moderada</option>
                            <option value="Severa">Severa</option>
                            <option value="Centinela">Centinela</option>
                        </select>
                    </div>
                    {/* </div> */}

                    {/* <div className="ae-grid-2"> */}
                    <div className="ae-form-group">
                        <label>Prevenible</label>
                        <select
                            name="prevenible"
                            className="ae-select"
                            value={form.prevenible ?? ""}
                            onChange={handleChange}
                        >
                            <option value="">Seleccione...</option>
                            <option value="Sí">Sí</option>
                            <option value="No">No</option>
                            <option value="No aplica">No aplica</option>

                        </select>
                    </div>

                    <div className="ae-form-group">
                        <label>Aplica para Plan de Acción</label>
                        <select
                            name="aplica_plan_accion"
                            className="ae-select"
                            value={form.aplica_plan_accion ?? ""}
                            onChange={handleChange}
                        >
                            <option value="">Seleccione...</option>
                            <option value="Sí">Sí</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                </div>

                <div className="ae-form-group">
                    <label>Link Videos del Evento</label>
                    <input
                        type="url"
                        name="link_video"
                        className="ae-input"
                        placeholder="https://..."
                        value={form.link_video ?? ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="ae-form-group">
                    <label>
                        Documentación Relacionada con el Evento (Archivos adjuntos)
                    </label>

                    <input
                        type="file"
                        className="ae-file-input"
                        multiple
                        onChange={(e) => {
                            const archivos = Array.from(e.target.files || []);

                            setForm((prev) => ({
                                ...prev,
                                documentos_adjuntos_nuevos: [
                                    ...(prev.documentos_adjuntos_nuevos || []),
                                    ...archivos
                                ]
                            }));

                            e.target.value = "";
                        }}
                    />

                    {/* Archivos nuevos */}
                    {form.documentos_adjuntos_nuevos?.length > 0 && (
                        <div className="ae-file-list">
                            <h4>Archivos nuevos:</h4>

                            {form.documentos_adjuntos_nuevos.map((archivo, index) => (
                                <div key={index} className="ae-file-current">
                                    <span>
                                        <i className="fa-solid fa-file-circle-plus"></i>{" "}
                                        {archivo.name}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() => eliminarArchivoNuevo(index)}
                                        title="Quitar archivo"
                                        className="ae-btn-remove-file"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Documentos registrados */}
                    {form.documentos_adjuntos_urls?.length > 0 && (
                        <div className="ae-file-list">
                            <h4>Documentos registrados:</h4>

                            {form.documentos_adjuntos_urls.map((documento, index) => (
                                <div key={index} className="ae-file-current">
                                    <a
                                        href={documento.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <i className="fa-solid fa-file-pdf"></i>{" "}
                                        {documento.nombre}
                                    </a>

                                    <button
                                        type="button"
                                        onClick={() => eliminarDocumentoRegistrado(index)}
                                        title="Eliminar documento"
                                        className="ae-btn-remove-file"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Botón de Guardar */}
                <div className="ae-footer-actions">
                    <button type="submit" className="ae-btn-save" disabled={saving}>
                        {saving ? "Guardando..." : "Guardar Análisis"} <i className="fa-solid fa-floppy-disk"></i>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AnalisisEvento;

