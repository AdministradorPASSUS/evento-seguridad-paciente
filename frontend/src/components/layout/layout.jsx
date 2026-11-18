import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import api from "../../services/api";
import PageHeader from "../PageHeader";

const Layout = () => {
    const location = useLocation();
    const pathname = location.pathname;

    const [reporteId, setReporteId] = useState(null);

    const esDetalleActividad = /^\/plan-accion\/\d+\/detalle$/.test(pathname);

    useEffect(() => {
        const obtenerActividad = async () => {
            if (!esDetalleActividad) {
                setReporteId(null);
                return;
            }

            const actividadId = pathname.split("/")[2];

            try {
                const response = await api.get(`/plan-accion/${actividadId}`);

                const actividad = response.data?.data ?? response.data;

                setReporteId(actividad?.reporte_id ?? null);
            } catch (error) {
                console.error("Error al obtener el reporte de la actividad:", error);
                setReporteId(null);
            }
        };

        obtenerActividad();
    }, [pathname, esDetalleActividad]);

    if (pathname === "/vista-principal") {
        return <Outlet />;
    }

    const idReporte = pathname.split("/")[2];

    const rutas = [
        {
            pattern: /^\/lista-reportes$/,
            breadcrumbs: [
                { label: "Reportes" }
            ]
        },
        {
            pattern: /^\/reportes\/\d+$/,
            breadcrumbs: [
                { label: "Reportes", path: "/lista-reportes" },
                { label: "Detalle del reporte" }
            ]
        },
        {
            pattern: /^\/reportes\/\d+\/plan-accion$/,
            breadcrumbs: [
                { label: "Reportes", path: "/lista-reportes" },
                {
                    label: "Detalle del reporte",
                    path: `/reportes/${idReporte}`
                },
                { label: "Plan de acción" }
            ]
        },
        {
            pattern: /^\/plan-accion\/\d+\/detalle$/,
            breadcrumbs: [
                { label: "Reportes", path: "/lista-reportes" },
                {
                    label: "Detalle del reporte",
                    path: reporteId ? `/reportes/${reporteId}` : null
                },
                {
                    label: "Plan de acción",
                    path: reporteId
                        ? `/reportes/${reporteId}/plan-accion`
                        : null
                },
                { label: "Detalle de actividad" }
            ]
        },
        {
            pattern: /^\/reportes\/\d+\/plan-accion\/crear$/,
            breadcrumbs: [
                { label: "Reportes", path: "/lista-reportes" },
                {
                    label: "Detalle del reporte",
                    path: `/reportes/${idReporte}`
                },
                {
                    label: "Plan de acción",
                    path: `/reportes/${idReporte}/plan-accion`
                },
                { label: "Crear actividad" }
            ]
        },
        {
            pattern: /^\/reportes\/\d+\/analisis$/,
            breadcrumbs: [
                { label: "Reportes", path: "/lista-reportes" },
                {
                    label: "Detalle del reporte",
                    path: `/reportes/${idReporte}`
                },
                { label: "Análisis del evento" }
            ]
        },
        {
            pattern: /^\/analisis$/,
            breadcrumbs: [
                { label: "Análisis" }
            ]
        },
        {
            pattern: /^\/crear-reporte$/,
            breadcrumbs: [
                { label: "Reportes", path: "/lista-reportes" },
                { label: "Crear reporte" }
            ]
        },
        {
            pattern: /^\/administracion\/usuarios$/,
            breadcrumbs: [
                { label: "Administración" },
                { label: "Usuarios" }
            ]
        },
        {
            pattern: /^\/administracion\/roles-permisos$/,
            breadcrumbs: [
                { label: "Administración" },
                { label: "Roles y permisos" }
            ]
        },
        {
            pattern: /^\/reportes\/\d+\/asignar$/,
            breadcrumbs: [
                { label: "Reportes", path: "/lista-reportes" },
                {
                    label: "Detalle del reporte",
                    path: `/reportes/${idReporte}`
                },
                { label: "Asignación de responsables" }
            ]
        },
    ];

    const rutaActual = rutas.find(ruta => ruta.pattern.test(pathname));

    return (
        <div className="layout-container">
            <PageHeader
                breadcrumbs={rutaActual?.breadcrumbs ?? [
                    { label: "Página" }
                ]}
            />

            <main className="layout-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;