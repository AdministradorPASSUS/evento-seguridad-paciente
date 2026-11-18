import { useEffect, useState } from "react";
import "../styles/FormularioUsuario.css";
import Swal from "sweetalert2";

const formularioInicial = {
    nombre: "",
    segundo_nombre: "",
    apellido: "",
    segundo_apellido: "",
    tipo_documento: "CC",
    numero_documento: "",
    nombre_usuario: "",
    email: "",
    password: "",
    password_confirmation: "",
    roles: []
};

const FormularioUsuario = ({
    usuario,
    rolesDisponibles,
    guardando,
    onGuardar,
    onCerrar
}) => {

    const [formulario, setFormulario] = useState(formularioInicial);

    const esEdicion = Boolean(usuario);

    useEffect(() => {
        if (usuario) {
            setFormulario({
                ...formularioInicial,
                ...usuario.usuario,
                password: "",
                password_confirmation: "",
                roles: usuario.roles || []
            });
        } else {
            setFormulario(formularioInicial);
        }
    }, [usuario]);

    const manejarCambio = (e) => {
        const { name, value } = e.target;

        setFormulario((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const manejarRol = (nombreRol) => {
        setFormulario((prev) => ({
            ...prev,
            roles: prev.roles.includes(nombreRol)
                ? prev.roles.filter((rol) => rol !== nombreRol)
                : [...prev.roles, nombreRol]
        }));
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        console.log("Validando roles:", formulario.roles);

     if (!Array.isArray(formulario.roles) || formulario.roles.length === 0) {
    console.log("Mostrando alerta de rol obligatorio");

    Swal.fire({
        target: document.body,
        icon: "warning",
        title: "Rol obligatorio",
        html: "<p>Debes seleccionar al menos un rol para continuar.</p>",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#00933f",
        backdrop: true,
        allowOutsideClick: false,
        didOpen: () => {
            console.log("SweetAlert2 se abrió correctamente");
        }
    });

    return;
}

        const datos = { ...formulario };

        if (esEdicion && !datos.password) {
            delete datos.password;
            delete datos.password_confirmation;
        }

        delete datos.id;
        delete datos.created_at;
        delete datos.updated_at;
        delete datos.activo;

        onGuardar(datos);
    };

    return (
        <div className="usuarios-modal-overlay">
            <div className="usuarios-modal formulario-usuario-modal">

                <div className="usuarios-modal-header">
                    <div>
                        <h3>
                            {esEdicion ? "Editar usuario" : "Crear usuario"}
                        </h3>
                        <p>
                            {esEdicion
                                ? "Actualiza la información de la cuenta."
                                : "Registra una nueva cuenta en el sistema."}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="usuarios-modal-cerrar"
                        onClick={onCerrar}
                    >
                        &times;
                    </button>
                </div>

                <form onSubmit={manejarEnvio}>

                    <div className="formulario-usuario-grid">

                        <div className="formulario-campo">
                            <label>Primer nombre *</label>
                            <input
                                name="nombre"
                                value={formulario.nombre || ""}
                                onChange={manejarCambio}
                                required
                            />
                        </div>

                        <div className="formulario-campo">
                            <label>Segundo nombre</label>
                            <input
                                name="segundo_nombre"
                                value={formulario.segundo_nombre || ""}
                                onChange={manejarCambio}
                            />
                        </div>

                        <div className="formulario-campo">
                            <label>Primer apellido *</label>
                            <input
                                name="apellido"
                                value={formulario.apellido || ""}
                                onChange={manejarCambio}
                                required
                            />
                        </div>

                        <div className="formulario-campo">
                            <label>Segundo apellido</label>
                            <input
                                name="segundo_apellido"
                                value={formulario.segundo_apellido || ""}
                                onChange={manejarCambio}
                            />
                        </div>

                        <div className="formulario-campo">
                            <label>Tipo de documento *</label>
                            <select
                                name="tipo_documento"
                                value={formulario.tipo_documento || ""}
                                onChange={manejarCambio}
                                required
                            >
                                <option value="CC">Cédula de ciudadanía</option>
                                <option value="CE">Cédula de extranjería</option>
                                <option value="TI">Tarjeta de identidad</option>
                                <option value="PA">Pasaporte</option>
                            </select>
                        </div>

                        <div className="formulario-campo">
                            <label>Número de documento *</label>
                            <input
                                name="numero_documento"
                                value={formulario.numero_documento || ""}
                                onChange={manejarCambio}
                                required
                            />
                        </div>

                        <div className="formulario-campo">
                            <label>Nombre de usuario *</label>
                            <input
                                name="nombre_usuario"
                                value={formulario.nombre_usuario || ""}
                                onChange={manejarCambio}
                                required
                            />
                        </div>

                        <div className="formulario-campo">
                            <label>Correo electrónico *</label>
                            <input
                                type="email"
                                name="email"
                                value={formulario.email || ""}
                                onChange={manejarCambio}
                                required
                            />
                        </div>

                        <div className="formulario-campo">
                            <label>
                                Contraseña {esEdicion ? "(opcional)" : "*"}
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formulario.password}
                                onChange={manejarCambio}
                                required={!esEdicion}
                                minLength={6}
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="formulario-campo">
                            <label>Confirmar contraseña</label>
                            <input
                                type="password"
                                name="password_confirmation"
                                value={formulario.password_confirmation}
                                onChange={manejarCambio}
                                required={Boolean(formulario.password)}
                                autoComplete="new-password"
                            />
                        </div>

                    </div>

                    <div className="formulario-roles">
                        <h4>
                            Asignación de roles <span className="campo-obligatorio">*</span>
                        </h4>
                        <p>Este campo es obligatorio. Selecciona al menos un rol para el usuario.</p>

                        <div className="formulario-roles-grid">
                            {rolesDisponibles.map((rol) => (
                                <label key={rol.id} className="formulario-rol-item">
                                    <input
                                        type="checkbox"
                                        checked={formulario.roles.includes(rol.name)}
                                        onChange={() => manejarRol(rol.name)}
                                    />
                                    <span>{rol.name}</span>
                                </label>
                            ))}
                        </div>

                        {rolesDisponibles.length === 0 && (
                            <p>No hay roles disponibles.</p>
                        )}
                    </div>

                    <div className="usuarios-formulario-acciones">

                        <button
                            type="button"
                            className="usuarios-btn-secondary"
                            onClick={onCerrar}
                            disabled={guardando}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="usuarios-btn-primary"
                            disabled={guardando}
                        >
                            {guardando
                                ? "Guardando..."
                                : esEdicion
                                    ? "Guardar cambios"
                                    : "Crear usuario"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default FormularioUsuario;