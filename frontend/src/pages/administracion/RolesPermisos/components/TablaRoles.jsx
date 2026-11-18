
import React from "react";
import "../styles/TablaRoles.css";

const TablaRoles = ({ roles, loading, onAdministrar }) => {

    if (loading) {
        return (
            <div className="roles-tabla-loading">
                <div className="roles-tabla-spinner"></div>
                <p>Cargando roles...</p>
            </div>
        );
    }

    if (!roles || roles.length === 0) {
        return (
            <div className="roles-tabla-empty">
                <p>No hay roles registrados.</p>
            </div>
        );
    }

    return (
        <div className="roles-tabla-wrapper">

            <table className="roles-tabla">

                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre del rol</th>
                        <th>Permisos asignados</th>
                        <th>Fecha de creación</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {roles.map((rol, index) => (
                        <tr key={rol.id}>

                            <td>{index + 1}</td>

                            <td>
                                <span className="roles-tabla-name">
                                    {rol.name}
                                </span>
                            </td>

                            <td>
                                <span className="roles-tabla-count">
                                    {rol.permissions_count}
                                </span>
                            </td>

                            <td>
                                {rol.created_at
                                    ? new Date(
                                        rol.created_at.replace(" ", "T")
                                    ).toLocaleDateString("es-CO")
                                    : "Sin información"}
                            </td>

                            <td>
                                <button
                                    type="button"
                                    className="roles-tabla-btn"
                                    onClick={() => onAdministrar(rol)}
                                >
                                    <span>⚙️</span>
                                    Administrar permisos
                                </button>
                            </td>

                        </tr>
                    ))}
                </tbody>

            </table>

        </div>
    );
};

export default TablaRoles;
