
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../../../services/api";

import "../styles/ModalPermisos.css";

const MODULOS = [
    { key: "administracion", label: "Administración" },
    { key: "analisis", label: "Análisis" },
    { key: "indicadores", label: "Indicadores" },
    { key: "plan_mejora", label: "Plan de mejora" },
    { key: "reportes", label: "Reporte de seguridad" }
];

const ACCIONES = [
    { key: "crear", label: "Crear" },
    { key: "consultar", label: "Consultar" },
    { key: "editar", label: "Editar" },
    { key: "validar", label: "Validar" },
    { key: "aprobar", label: "Aprobar" },
    { key: "asignar", label: "Asignar" },
    { key: "cerrar", label: "Cerrar" },
    { key: "exportar", label: "Exportar" },
    { key: "administrar", label: "Administrar" }
];

const ModalPermisos = ({ rol, onClose, onSaved }) => {
    const [permisosDisponibles, setPermisosDisponibles] = useState([]);
    const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Consultar permisos del rol seleccionado
    const obtenerPermisos = async () => {
        try {
            setLoading(true);

            const response = await api.get(`/roles/${rol.id}/permisos`);

            const datos = response.data.data;

            setPermisosDisponibles(datos.permisos || []);
            setPermisosSeleccionados(datos.permisos_asignados || []);

        } catch (error) {
            console.error("Error al consultar permisos:", error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message ||
                    "No fue posible cargar los permisos del rol.",
                confirmButtonColor: "#00933f"
            });

            onClose();

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerPermisos();
    }, [rol.id]);

    // Comprobar si un permiso está seleccionado
    const estaSeleccionado = (nombrePermiso) => {
        return permisosSeleccionados.includes(nombrePermiso);
    };

    // Seleccionar o deseleccionar un permiso
    const cambiarPermiso = (nombrePermiso) => {
        setPermisosSeleccionados((actuales) => {
            if (actuales.includes(nombrePermiso)) {
                return actuales.filter(
                    (permiso) => permiso !== nombrePermiso
                );
            }

            return [...actuales, nombrePermiso];
        });
    };

    // Seleccionar o deseleccionar todos los permisos de un módulo
    const cambiarModulo = (modulo) => {
        const permisosModulo = permisosDisponibles
            .filter((permiso) => permiso.modulo === modulo)
            .map((permiso) => permiso.name);

        const todosSeleccionados = permisosModulo.length > 0 &&
            permisosModulo.every((permiso) =>
                permisosSeleccionados.includes(permiso)
            );

        if (todosSeleccionados) {
            setPermisosSeleccionados((actuales) =>
                actuales.filter(
                    (permiso) => !permisosModulo.includes(permiso)
                )
            );
        } else {
            setPermisosSeleccionados((actuales) => [
                ...new Set([...actuales, ...permisosModulo])
            ]);
        }
    };

    // Comprobar selección completa de un módulo
    const moduloCompleto = (modulo) => {
        const permisosModulo = permisosDisponibles
            .filter((permiso) => permiso.modulo === modulo)
            .map((permiso) => permiso.name);

        return permisosModulo.length > 0 &&
            permisosModulo.every((permiso) =>
                permisosSeleccionados.includes(permiso)
            );
    };

    // Guardar permisos
    const guardarPermisos = async () => {

        if (permisosSeleccionados.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Sin permisos seleccionados",
                text: "Debes asignar al menos un permiso al rol.",
                confirmButtonColor: "#00933f"
            });

            return;
        }

        const confirmacion = await Swal.fire({
            icon: "question",
            title: "¿Guardar cambios?",
            text: `Se actualizarán los permisos del rol ${rol.name}.`,
            showCancelButton: true,
            confirmButtonText: "Sí, guardar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#00933f",
            cancelButtonColor: "#6c757d"
        });

        if (!confirmacion.isConfirmed) return;

        try {
            setSaving(true);

            const response = await api.put(
                `/roles/${rol.id}/permisos`,
                {
                    permisos: permisosSeleccionados
                }
            );

            if (response.data.success) {
                await Swal.fire({
                    icon: "success",
                    title: "Permisos actualizados",
                    text: response.data.message,
                    confirmButtonColor: "#00933f"
                });

                onSaved(permisosSeleccionados.length);
            }

        } catch (error) {
            console.error("Error al actualizar permisos:", error);

            Swal.fire({
                icon: "error",
                title: "No se pudieron guardar los cambios",
                text: error.response?.data?.message ||
                    "Ocurrió un error al actualizar los permisos.",
                confirmButtonColor: "#00933f"
            });

        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            className="mp-overlay"
            onClick={onClose}
        >
            <div
                className="mp-modal"
                onClick={(e) => e.stopPropagation()}
            >

                <header className="mp-header">
                    <div>
                        <h2>Administrar permisos</h2>
                        <p>
                            Rol: <strong>{rol.name}</strong>
                        </p>
                    </div>

                    <button
                        type="button"
                        className="mp-close"
                        onClick={onClose}
                        disabled={saving}
                        aria-label="Cerrar"
                    >
                        ×
                    </button>
                </header>

                {loading ? (
                    <div className="mp-loading">
                        <div className="mp-spinner"></div>
                        <p>Cargando permisos...</p>
                    </div>
                ) : (
                    <>
                        <div className="mp-info">
                            <div>
                                <strong>
                                    {permisosSeleccionados.length}
                                </strong>
                                <span> permisos seleccionados</span>
                            </div>

                            <p>
                                Selecciona las acciones que podrá realizar
                                este rol en cada módulo.
                            </p>
                        </div>

                        {rol.name === "Administrador" && (
                            <div className="mp-admin-warning">
                                <strong>Rol Administrador</strong>
                                <p>
                                    Este rol tiene acceso completo al sistema.
                                    Modificar sus permisos puede limitar
                                    las funciones administrativas.
                                </p>
                            </div>
                        )}

                        <div className="mp-table-container">
                            <table className="mp-table">
                                <thead>
                                    <tr>
                                        <th>Módulo</th>

                                        {ACCIONES.map((accion) => (
                                            <th key={accion.key}>
                                                {accion.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {MODULOS.map((modulo) => {
                                        const permisosModulo =
                                            permisosDisponibles.filter(
                                                (permiso) =>
                                                    permiso.modulo === modulo.key
                                            );

                                        return (
                                            <tr key={modulo.key}>
                                                <td>
                                                    <label className="mp-module">
                                                        <input
                                                            type="checkbox"
                                                            checked={moduloCompleto(modulo.key)}
                                                            onChange={() =>
                                                                cambiarModulo(modulo.key)
                                                            }
                                                            disabled={
                                                                permisosModulo.length === 0
                                                            }
                                                        />

                                                        <span>
                                                            {modulo.label}
                                                        </span>
                                                    </label>
                                                </td>

                                                {ACCIONES.map((accion) => {
                                                    const nombrePermiso =
                                                        `${modulo.key}.${accion.key}`;

                                                    const existe =
                                                        permisosDisponibles.some(
                                                            (permiso) =>
                                                                permiso.name === nombrePermiso
                                                        );

                                                    return (
                                                        <td key={accion.key}>
                                                            {existe ? (
                                                                <input
                                                                    type="checkbox"
                                                                    className="mp-checkbox"
                                                                    checked={estaSeleccionado(nombrePermiso)}
                                                                    onChange={() =>
                                                                        cambiarPermiso(nombrePermiso)
                                                                    }
                                                                    aria-label={`${modulo.label} - ${accion.label}`}
                                                                />
                                                            ) : (
                                                                <span className="mp-not-available">
                                                                    —
                                                                </span>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <footer className="mp-footer">
                            <button
                                type="button"
                                className="mp-btn-cancel"
                                onClick={onClose}
                                disabled={saving}
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                className="mp-btn-save"
                                onClick={guardarPermisos}
                                disabled={saving}
                            >
                                {saving ? "Guardando..." : "Guardar permisos"}
                            </button>
                        </footer>
                    </>
                )}

            </div>
        </div>
    );
};

export default ModalPermisos;
