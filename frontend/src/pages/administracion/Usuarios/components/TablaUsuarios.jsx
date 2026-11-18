import "../styles/TablaUsuario.css";

const TablaUsuarios = ({
    usuarios,
    loading,
    onDetalle,
    onEditar,
    onCambiarEstado
}) => {

    if (loading) {
        return (
            <div className="usuarios-loading">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Cargando usuarios...</p>
            </div>
        );
    }

    return (
        <div className="usuarios-tabla-contenedor">

            <table className="usuarios-tabla">
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Documento</th>
                        <th>Correo electrónico</th>
                        <th>Roles</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {usuarios.length > 0 ? (
                        usuarios.map((usuario) => (

                            <tr key={usuario.id}>
                                <td>
                                    <strong>
                                        {[
                                            usuario.nombre,
                                            usuario.segundo_nombre,
                                            usuario.apellido,
                                            usuario.segundo_apellido
                                        ].filter(Boolean).join(" ")}
                                    </strong>

                                    <small>
                                        @{usuario.nombre_usuario}
                                    </small>
                                </td>

                                <td>
                                    {usuario.tipo_documento}{" "}
                                    {usuario.numero_documento}
                                </td>

                                <td>{usuario.email}</td>

                                <td>
                                    <div className="usuarios-roles-lista">
                                        {usuario.roles?.map((rol) => (
                                            <span key={rol.id}>
                                                {rol.name}
                                            </span>
                                        ))}
                                    </div>
                                </td>

                                <td>
                                    <span className={
                                        usuario.activo
                                            ? "usuario-estado activo"
                                            : "usuario-estado inactivo"
                                    }>
                                        {usuario.activo ? "Activo" : "Inactivo"}
                                    </span>
                                </td>

                                <td>
                                    <div className="usuarios-acciones">

                                        <button
                                            title="Ver detalle"
                                            onClick={() => onDetalle(usuario.id)}
                                        >
                                            <i className="fas fa-eye"></i>
                                        </button>

                                        <button
                                            title="Editar"
                                            onClick={() => onEditar(usuario.id)}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>

                                        <button
                                            title={
                                                usuario.activo
                                                    ? "Desactivar"
                                                    : "Activar"
                                            }
                                            onClick={() => onCambiarEstado(usuario)}
                                        >
                                            <i className={
                                                usuario.activo
                                                    ? "fas fa-user-check"
                                                    : "fas fa-user-slash"
                                            }></i>
                                        </button>

                                    </div>
                                </td>
                            </tr>

                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="usuarios-sin-registros">
                                No se encontraron usuarios.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

        </div>
    );
};

export default TablaUsuarios;