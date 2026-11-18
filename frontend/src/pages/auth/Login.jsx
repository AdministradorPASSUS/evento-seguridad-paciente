
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../styles/Login.css";
import Swal from "sweetalert2";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre_usuario: "",
    password: "",
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const resultado = await login({
        nombre_usuario: form.nombre_usuario,
        password: form.password,
      });

      if (!resultado?.success) {
        throw new Error("No se pudo completar el inicio de sesión.");
      }

      Swal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        text: "Inicio de sesión exitoso",
        timer: 1800,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
      });

      navigate("/vista-principal");

    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      const mensajeServidor =
        error.response?.data?.message ||
        "Credenciales incorrectas. Verifica tu usuario y contraseña.";

      await Swal.fire({
        icon: "error",
        title: "Error de acceso",
        text: mensajeServidor,
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#00933f",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login">
        <div className="container">
          <div className="img-login">
            <img
              src="/logoPassusTransp.png"
              alt="Logo Passus"
              className="logo-login"
            />
          </div>

          <form
            onSubmit={handleSubmit}
            id="login"
            className="form form-login"
          >
            <input
              className="form__input"
              required
              type="text"
              name="nombre_usuario"
              placeholder="Usuario"
              value={form.nombre_usuario}
              onChange={handleChange}
              disabled={loading}
            />

            <input
              className="form__input"
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <div className="form__options">
              <Link
                to="/crear-reporte"
                className="form__terms"
              >
                Reportar un evento
              </Link>
            </div>

            <button
              type="submit"
              className="form__submit-btn"
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
