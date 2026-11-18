import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../../services/api";

import TablaUsuarios from "./components/TablaUsuarios";
import FormularioUsuario from "./components/FormularioUsuario";
import DetalleUsuario from "./components/DetalleUsuario";
import ModalEstadoUsuario from "./components/ModalEstadoUsuario";

import "./styles/Usuarios.css";

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [rolesDisponibles, setRolesDisponibles] = useState([]);

    const [loading, setLoading] = useState(true);
    const [guardando, setGuardando] = useState(false);

    const [pagina, setPagina] = useState(1);
    const [ultimaPagina, setUltimaPagina] = useState(1);
    const [busqueda, setBusqueda] = useState("");

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [usuarioEditar, setUsuarioEditar] = useState(null);
    const [usuarioDetalle, setUsuarioDetalle] = useState(null);
    const [usuarioEstado, setUsuarioEstado] = useState(null);

    // ==========================================
    // LISTAR USUARIOS
    // ==========================================
    const cargarUsuarios = async (page = 1) => {
        try {
            setLoading(true);

            const response = await api.get(
                `/administracion/usuarios?page=${page}`
            );

            const resultado = response.data.data;

            setUsuarios(resultado.data || []);
            setPagina(resultado.current_page || 1);
            setUltimaPagina(resultado.last_page || 1);

        } catch (error) {
            console.error("Error al cargar usuarios:", error);

            Swal.fire(
                "Error",
                "No fue posible cargar los usuarios.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // CARGAR ROLES DISPONIBLES
    // ==========================================
    const cargarRoles = async () => {
        try {
            const response = await api.get("/roles");

            const resultado = response.data.data ?? response.data.roles ?? response.data;

            const lista = Array.isArray(resultado)
                ? resultado
                : resultado.data || [];

            setRolesDisponibles(lista);

        } catch (error) {
            console.error("Error al cargar roles:", error);

            Swal.fire(
                "Error",
                "No fue posible cargar los roles disponibles.",
                "error"
            );
        }
    };

    useEffect(() => {
        cargarUsuarios(1);
        cargarRoles();
    }, []);

    // ==========================================
    // ABRIR FORMULARIO DE CREACIÓN
    // ==========================================
    const abrirCrear = () => {
        setUsuarioEditar(null);
        setMostrarFormulario(true);
    };

    // ==========================================
    // ABRIR FORMULARIO DE EDICIÓN
    // ==========================================
    const abrirEditar = async (id) => {
        try {
            const response = await api.get(
                `/administracion/usuarios/${id}`
            );

            setUsuarioEditar(response.data.data);
            setMostrarFormulario(true);

        } catch (error) {
            console.error("Error al consultar usuario:", error);

            Swal.fire(
                "Error",
                "No fue posible consultar el usuario.",
                "error"
            );
        }
    };

    // ==========================================
    // CONSULTAR DETALLE
    // ==========================================
    const abrirDetalle = async (id) => {
        try {
            const response = await api.get(
                `/administracion/usuarios/${id}`
            );

            setUsuarioDetalle(response.data.data);

        } catch (error) {
            console.error("Error al consultar detalle:", error);

            Swal.fire(
                "Error",
                "No fue posible consultar el detalle.",
                "error"
            );
        }
    };

    // ==========================================
    // CREAR / EDITAR USUARIO
    // ==========================================
    const guardarUsuario = async (datos) => {
        if (guardando) return;

        if (!datos.roles || datos.roles.length === 0) {
            await Swal.fire({
                icon: "warning",
                title: "Rol obligatorio",
                text: "Debes asignar al menos un rol al usuario.",
                confirmButtonColor: "#00933f"
            });

            return;
        }

        setGuardando(true);

        try {
            let response;

            if (usuarioEditar) {
                response = await api.put(
                    `/administracion/usuarios/${usuarioEditar.usuario.id}`,
                    datos
                );
            } else {
                response = await api.post(
                    "/administracion/usuarios",
                    datos
                );
            }

            // Liberar el botón inmediatamente después de la respuesta exitosa.
            setGuardando(false);

            setMostrarFormulario(false);
            setUsuarioEditar(null);

            await cargarUsuarios(pagina);

            await Swal.fire({
                icon: "success",
                title: "¡Operación exitosa!",
                text: response.data.message || "Los datos se guardaron correctamente.",
                confirmButtonColor: "#00933f",
                confirmButtonText: "Aceptar"
            });

        } catch (error) {
            console.error("Error al guardar:", error);

            setGuardando(false);

            const errores = error.response?.data?.errors;
            let mensaje = error.response?.data?.message ||
                "No fue posible guardar los datos.";

            if (errores) {
                mensaje = Object.values(errores).flat().join("\n");
            }

            await Swal.fire({
                icon: "error",
                title: "Error al guardar",
                text: mensaje,
                confirmButtonColor: "#00933f"
            });

        } finally {
            setGuardando(false);
        }
    };

    // ==========================================
    // CAMBIAR ESTADO
    // ==========================================
    const cambiarEstado = async () => {
        if (!usuarioEstado) return;

        try {
            await api.put(
                `/administracion/usuarios/${usuarioEstado.id}/estado`
            );

            setUsuarioEstado(null);

            await Swal.fire({
                icon: "success",
                title: "Estado actualizado",
                text: "El estado del usuario fue modificado correctamente.",
                confirmButtonColor: "#00933f"
            });

            cargarUsuarios(pagina);

        } catch (error) {
            console.error("Error al cambiar estado:", error);

            Swal.fire(
                "Error",
                error.response?.data?.message ||
                "No fue posible cambiar el estado del usuario.",
                "error"
            );
        }
    };

    // ==========================================
    // BÚSQUEDA LOCAL
    // ==========================================
    const usuariosFiltrados = usuarios.filter((usuario) => {
        const texto = busqueda.toLowerCase();

        const nombre = [
            usuario.nombre,
            usuario.segundo_nombre,
            usuario.apellido,
            usuario.segundo_apellido
        ].filter(Boolean).join(" ").toLowerCase();

        return (
            nombre.includes(texto) ||
            usuario.numero_documento?.toLowerCase().includes(texto) ||
            usuario.nombre_usuario?.toLowerCase().includes(texto) ||
            usuario.email?.toLowerCase().includes(texto)
        );
    });

    return (
        <div className="usuarios-container">

            <div className="usuarios-header">
                <div>
                    <h2>Administración de usuarios</h2>
                    <p>Gestiona las cuentas y los roles de los usuarios del sistema.</p>
                </div>

                <button
                    className="usuarios-btn-primary"
                    onClick={abrirCrear}
                >
                    <i className="fas fa-user-plus"></i>
                    Crear usuario
                </button>
            </div>

            <div className="usuarios-toolbar">
                <input
                    type="text"
                    placeholder="Buscar por nombre, documento, usuario o correo..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>

            <TablaUsuarios
                usuarios={usuariosFiltrados}
                loading={loading}
                onDetalle={abrirDetalle}
                onEditar={abrirEditar}
                onCambiarEstado={setUsuarioEstado}
            />

            {!loading && ultimaPagina > 1 && (
                <div className="usuarios-paginacion">
                    <button
                        disabled={pagina <= 1}
                        onClick={() => cargarUsuarios(pagina - 1)}
                    >
                        Anterior
                    </button>

                    <span>
                        Página {pagina} de {ultimaPagina}
                    </span>

                    <button
                        disabled={pagina >= ultimaPagina}
                        onClick={() => cargarUsuarios(pagina + 1)}
                    >
                        Siguiente
                    </button>
                </div>
            )}

            {mostrarFormulario && (
                <FormularioUsuario
                    usuario={usuarioEditar}
                    rolesDisponibles={rolesDisponibles}
                    guardando={guardando}
                    onGuardar={guardarUsuario}
                    onCerrar={() => {
                        setMostrarFormulario(false);
                        setUsuarioEditar(null);
                    }}
                />
            )}

            {usuarioDetalle && (
                <DetalleUsuario
                    datos={usuarioDetalle}
                    onCerrar={() => setUsuarioDetalle(null)}
                />
            )}

            {usuarioEstado && (
                <ModalEstadoUsuario
                    usuario={usuarioEstado}
                    onConfirmar={cambiarEstado}
                    onCancelar={() => setUsuarioEstado(null)}
                />
            )}

        </div>
    );
};

export default Usuarios;