
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoutes";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import { ForceLogout } from "../components/ForceLogout";

import VistaPrincipal from "../pages/gestion-eventos/VistaPrincipal";
import CrearReporte from "../pages/gestion-eventos/CrearReporte";
import DetalleReporte from "../pages/gestion-eventos/DetalleReporte";
import ListaReportes from "../pages/gestion-eventos/ListaReportes";
import DetalleReporteAsignacion from "../pages/gestion-eventos/DetalleReporteAsignacion";
import AnalisisEvento from "../pages/gestion-eventos/AnalisisEvento";
import PlanAccion from "../pages/gestion-eventos/PlanAccion";
import DetallePlanAccion from "../pages/gestion-eventos/DetallePlanAccion";
import FormularioPlanAccion from "../pages/gestion-eventos/FormularioPlanAccion";

import RolesPermisos from "../pages/administracion/RolesPermisos/RolesPermisos";
import Usuarios from "../pages/administracion/Usuarios/Usuarios";
import ListaAnalisis from "../pages/gestion-eventos/ListaAnalisis";
import Layout from "../components/layout/layout";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>

                {/* 1. Rutas públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/crear-reporte"
                    element={<CrearReporte />}
                />

                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                {/* 2. Cierre de sesión */}
                <Route
                    path="/force-logout"
                    element={<ForceLogout />}
                />

                {/* 3. Rutas que requieren autenticación */}
                <Route element={<ProtectedRoute />}>

                    <Route element={<Layout />}>

                        {/* Inicio */}
                        <Route
                            path="/vista-principal"
                            element={<VistaPrincipal />}
                        />

                        {/* 4. Módulo de reportes */}



                        <Route
                            element={
                                <ProtectedRoute
                                    allowedPermissions={["reportes.consultar"]}
                                />
                            }
                        >
                            <Route
                                path="/lista-reportes"
                                element={<ListaReportes />}
                            />

                            <Route
                                path="/reportes/:id"
                                element={<DetalleReporte />}
                            />

                            <Route
                                path="/reportes/:id/asignar"
                                element={<DetalleReporteAsignacion />}
                            />
                        </Route>

                        {/* 5. Módulo de análisis */}

                        <Route
                            element={
                                <ProtectedRoute
                                    allowedPermissions={["analisis.consultar"]}
                                />
                            }
                        >
                            <Route
                                path="/reportes/:id/analisis"
                                element={<AnalisisEvento />}
                            />
                        </Route>

                        <Route
                            element={
                                <ProtectedRoute
                                    allowedPermissions={["analisis.consultar"]}
                                />
                            }
                        >
                            <Route
                                path="/analisis"
                                element={<ListaAnalisis />}
                            />
                        </Route>

                        {/* 6. Módulo de plan de mejora */}

                        <Route
                            element={
                                <ProtectedRoute
                                    allowedPermissions={["plan_mejora.consultar"]}
                                />
                            }
                        >
                            <Route
                                path="/reportes/:id/plan-accion"
                                element={<PlanAccion />}
                            />

                            <Route
                                path="/reportes/:id/plan-accion/crear"
                                element={<FormularioPlanAccion />}
                            />

                            <Route
                                path="/plan-accion/:id/detalle"
                                element={<DetallePlanAccion />}
                            />
                        </Route>

                        {/* 7. Administración */}

                        <Route
                            element={
                                <ProtectedRoute
                                    allowedPermissions={["administracion.administrar"]}
                                />
                            }
                        >
                            <Route
                                path="/administracion/roles-permisos"
                                element={<RolesPermisos />}
                            />
                        </Route>


                        {/* administracion de usuarios */}
                        <Route element={<ProtectedRoute allowedRoles={["Administrador"]} />}>
                            <Route
                                path="/administracion/usuarios"
                                element={<Usuarios />}
                            />
                        </Route>

                    </Route>
                </Route>


                {/* 8. Ruta no encontrada */}
                <Route
                    path="*"
                    element={<Navigate to="/force-logout" replace />}
                />

            </Routes>
        </BrowserRouter >
    );
};

export default AppRouter;
