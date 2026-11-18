
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

import TablaRoles from "./components/TablaRoles";
import "./styles/RolesPermisos.css";
import api from "../../../services/api";
import ModalPermisos from "./components/ModalPermisos";

import "./styles/RolesPermisos.css";

const RolesPermisos = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rolSeleccionado, setRolSeleccionado] = useState(null);

    const obtenerRoles = async () => {
        try {
            setLoading(true);

            const response = await api.get("/roles");

            if (response.data.success) {
                setRoles(response.data.data || []);
            } else {
                setRoles([]);

                Swal.fire({
                    icon: "warning",
                    title: "Atención",
                    text: response.data.message || "No fue posible obtener los roles.",
                    confirmButtonColor: "#00933f"
                });
            }

        } catch (error) {
            console.error("Error al obtener los roles:", error);

            Swal.fire({
                icon: "error",
                title: "Error al cargar los roles",
                text: error.response?.data?.message ||
                    "Ocurrió un problema al consultar los roles.",
                confirmButtonColor: "#00933f"
            });

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerRoles();
    }, []);

    const administrarPermisos = (rol) => {
        setRolSeleccionado(rol);
    };

    const cerrarModal = () => {
        setRolSeleccionado(null);
    };

    const actualizarCantidadPermisos = (cantidad) => {
        setRoles((rolesActuales) =>
            rolesActuales.map((rol) =>
                rol.id === rolSeleccionado?.id
                    ? { ...rol, permissions_count: cantidad }
                    : rol
            )
        );

        cerrarModal();
    };

    return (
        <main className="roles-permisos-container">

            <header className="roles-permisos-header">
                <div>
                    <h1>Roles y permisos</h1>
                    <p>
                        Administra los roles y controla los permisos
                        de acceso a los módulos del sistema.
                    </p>
                </div>
            </header>

            <section className="roles-permisos-content">

                <div className="roles-permisos-section-header">
                    <div>
                        <h2>Roles registrados</h2>
                        <p>
                            Consulta los roles y administra sus permisos.
                        </p>
                    </div>

                    <span className="roles-permisos-total">
                        {roles.length} roles
                    </span>
                </div>

                <TablaRoles
                    roles={roles}
                    loading={loading}
                    onAdministrar={administrarPermisos}
                />

            </section>

            {rolSeleccionado && (
                <ModalPermisos
                    rol={rolSeleccionado}
                    onClose={cerrarModal}
                    onSaved={actualizarCantidadPermisos}
                />
            )}

        </main>
    );
};

export default RolesPermisos;
