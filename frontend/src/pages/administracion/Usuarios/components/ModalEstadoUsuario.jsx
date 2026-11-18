import "../styles/ModalEstadoUsuario.css";

const ModalEstadoUsuario = ({
    usuario,
    onConfirmar,
    onCancelar
}) => {

    const nombreCompleto = [
        usuario.nombre,
        usuario.segundo_nombre,
        usuario.apellido,
        usuario.segundo_apellido
    ].filter(Boolean).join(" ");

    const accion = usuario.activo ? "desactivar" : "activar";

    return (
        <div className="usuarios-modal-overlay">
            <div
                className="usuarios-modal formulario-usuario-modal"
                onClick={(e) => e.stopPropagation()}
            >

                <div className={
                    usuario.activo
                        ? "modal-estado-icono desactivar"
                        : "modal-estado-icono activar"
                }>
                    <i className={
                        usuario.activo
                            ? "fas fa-user-slash"
                            : "fas fa-user-check"
                    }></i>
                </div>

                <h3>
                    {usuario.activo
                        ? "¿Desactivar usuario?"
                        : "¿Activar usuario?"}
                </h3>

                <p>
                    ¿Estás seguro de que deseas {accion} la cuenta de{" "}
                    <strong>{nombreCompleto}</strong>?
                </p>

                <div className="modal-estado-acciones">

                    <button
                        className="usuarios-btn-secondary"
                        onClick={onCancelar}
                    >
                        Cancelar
                    </button>

                    <button
                        className={
                            usuario.activo
                                ? "usuarios-btn-danger"
                                : "usuarios-btn-primary"
                        }
                        onClick={onConfirmar}
                    >
                        Sí, {accion}
                    </button>

                </div>

            </div>
        </div>
    );
};

export default ModalEstadoUsuario;