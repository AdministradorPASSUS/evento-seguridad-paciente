import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedPermissions, allowedRoles }) => {

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const {
    user,
    tienePermiso,
    permisosCargando
  } = useAuth();

  // 1. Verificar sesión
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Esperar la carga de permisos
  if (permisosCargando) {
    return null;
  }

  // 3. Verificar roles, si fueron especificados
  if (allowedRoles && allowedRoles.length > 0) {

    const tieneRol = allowedRoles.some((rol) =>
      user?.roles?.includes(rol)
    );

    if (!tieneRol) {
      return <AccesoDenegado />;
    }
  }

  // 4. Verificar permisos, si fueron especificados
  if (allowedPermissions && allowedPermissions.length > 0) {

    const tieneAcceso = allowedPermissions.some((permiso) =>
      tienePermiso(permiso)
    );

    if (!tieneAcceso) {
      return <AccesoDenegado />;
    }
  }

  return <Outlet />;
};

// Componente para gestionar el acceso denegado
const AccesoDenegado = () => {

  const navigate = useNavigate();

  useEffect(() => {

    Swal.fire({
      icon: "warning",
      title: "Acceso restringido",
      text: "No tienes los permisos necesarios para entrar a esta sección.",
      confirmButtonColor: "#00933f",
      confirmButtonText: "Entendido"
    }).then(() => {
      navigate("/vista-principal", { replace: true });
    });

  }, [navigate]);

  return null;
};

export default ProtectedRoute;