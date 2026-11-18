import "../styles/DetalleUsuario.css";

const DetalleUsuario = ({ datos, onCerrar }) => {

    if (!datos?.usuario) return null;

    const usuario = datos.usuario;

    const nombreCompleto = [
        usuario.nombre,
        usuario.segundo_nombre,
        usuario.apellido,
        usuario.segundo_apellido
    ].filter(Boolean).join(" ");

    const fecha = (valor) => {
        if (!valor) return "No disponible";

        return new Date(valor).toLocaleDateString("es-CO", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    return (
        <div className="usuarios-modal-overlay">

            <div className="usuarios-modal detalle-usuario-modal">

                <div className="usuarios-modal-header">
                    <div>
                        <h3>Detalle del usuario</h3>
                        <p>Información general de la cuenta.</p>
                    </div>

                    <button
                        className="usuarios-modal-cerrar"
                        onClick={onCerrar}
                    >
                        &times;
                    </button>
                </div>

                <div className="detalle-usuario-perfil">
                    <div className="detalle-usuario-avatar">
                        <i className="fas fa-user"></i>
                    </div>

                    <h3>{nombreCompleto}</h3>

                    <span className={
                        usuario.activo
                            ? "usuario-estado activo"
                            : "usuario-estado inactivo"
                    }>
                        {usuario.activo ? "Activo" : "Inactivo"}
                    </span>
                </div>

                <div className="detalle-usuario-grid">

                    <div>
                        <label>Tipo de documento</label>
                        <p>{usuario.tipo_documento || "No disponible"}</p>
                    </div>

                    <div>
                        <label>Número de documento</label>
                        <p>{usuario.numero_documento || "No disponible"}</p>
                    </div>

                    <div>
                        <label>Nombre de usuario</label>
                        <p>{usuario.nombre_usuario || "No disponible"}</p>
                    </div>

                    <div>
                        <label>Correo electrónico</label>
                        <p>{usuario.email || "No disponible"}</p>
                    </div>

                    <div>
                        <label>Fecha de creación</label>
                        <p>{fecha(usuario.created_at)}</p>
                    </div>

                    <div>
                        <label>Última actualización</label>
                        <p>{fecha(usuario.updated_at)}</p>
                    </div>

                </div>

                <div className="detalle-usuario-roles">
                    <h4>Roles asignados</h4>

                    <div>
                        {datos.roles?.length > 0 ? (
                            datos.roles.map((rol, index) => (
                                <span key={`${rol}-${index}`}>
                                    {rol}
                                </span>
                            ))
                        ) : (
                            <p>Este usuario no tiene roles asignados.</p>
                        )}
                    </div>
                </div>

                <div className="usuarios-formulario-acciones">
                    <button
                        className="usuarios-btn-primary"
                        onClick={onCerrar}
                    >
                        Cerrar
                    </button>
                </div>

            </div>
        </div>
    );
};

export default DetalleUsuario;