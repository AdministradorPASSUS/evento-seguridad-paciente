import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import '../styles/Register.css';
import Swal from 'sweetalert2';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nombre: "",
        segundo_nombre: "",
        apellido: "",
        segundo_apellido: "",
        tipo_documento: "",
        numero_documento: "",
        nombre_usuario: "",
        email: "",
        password: "",
        password_confirmation: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.password_confirmation) {
            Swal.fire({
                icon: 'error',
                title: 'Contraseñas no coinciden',
                text: 'Por favor verifica que las contraseñas sean idénticas.',
                confirmButtonColor: '#00933f',
            });
            return;
        }

        try {
            await register(form);

            Swal.fire({
                icon: 'success',
                title: '¡Registro exitoso!',
                text: 'Tu cuenta ha sido creada correctamente.',
                timer: 1500,
                showConfirmButton: false
            });

            navigate("/login");

        } catch (error) {
            const mensajeServidor = error.response?.data?.message || 'No se pudo completar el registro, intenta de nuevo.';

            Swal.fire({
                icon: 'error',
                title: 'Error en el registro',
                text: mensajeServidor,
                confirmButtonColor: '#00933f',
            });
        }
    };

    return (
        <div className="register-wrapper">
            <div className="register-card">

                <div className="register-header">
                    <img src="/logoPassusTransp.png" alt="Logo Passus" className="register-logo-img" />
                </div>


                <form onSubmit={handleSubmit} className="register-form">

                    {/* Nombres */}
                    <div className="register-grid-row">
                        <input
                            className="register-field-input"
                            required
                            type="text"
                            name="nombre"
                            placeholder="Primer Nombre"
                            value={form.nombre}
                            onChange={handleChange}
                        />
                        <input
                            className="register-field-input"
                            type="text"
                            name="segundo_nombre"
                            placeholder="Segundo Nombre"
                            value={form.segundo_nombre}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Apellidos */}
                    <div className="register-grid-row">
                        <input
                            className="register-field-input"
                            required
                            type="text"
                            name="apellido"
                            placeholder="Primer Apellido"
                            value={form.apellido}
                            onChange={handleChange}
                        />
                        <input
                            className="register-field-input"
                            required
                            type="text"
                            name="segundo_apellido"
                            placeholder="Segundo Apellido"
                            value={form.segundo_apellido}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Documento */}
                    <div className="register-grid-row">
                        <select
                            className="register-field-input register-select-input"
                            name="tipo_documento"
                            value={form.tipo_documento}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Seleccione tipo de documento</option>
                            <option value="CC">Cédula de Ciudadanía</option>
                            <option value="CE">Cédula de Extranjería</option>
                            <option value="TI">Tarjeta de Identidad</option>
                            <option value="Pasaporte">Pasaporte</option>
                        </select>

                        <input
                            className="register-field-input"
                            required
                            type="text"
                            name="numero_documento"
                            placeholder="N° Documento"
                            value={form.numero_documento}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Usuario y Email */}
                    <input
                        className="register-field-input"
                        required
                        type="text"
                        name="nombre_usuario"
                        placeholder="Nombre de Usuario"
                        value={form.nombre_usuario}
                        onChange={handleChange}
                    />

                    <input
                        className="register-field-input"
                        required
                        type="email"
                        name="email"
                        placeholder="Correo Electrónico"
                        value={form.email}
                        onChange={handleChange}
                    />

                    {/* Contraseñas */}
                    <div className="register-grid-row">
                        <input
                            className="register-field-input"
                            required
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            value={form.password}
                            onChange={handleChange}
                        />
                        <input
                            className="register-field-input"
                            required
                            type="password"
                            name="password_confirmation"
                            placeholder="Confirmar"
                            value={form.password_confirmation}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="register-btn-submit">
                        Registrarse
                    </button>

                    <p className="register-footer-info">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login" className="register-link-login">
                            Inicia sesión
                        </Link>
                    </p>

                </form>
            </div>
        </div>
    );
};

export default Register;