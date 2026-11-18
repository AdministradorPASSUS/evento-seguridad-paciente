
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
    const { tienePermiso, permisosCargando } = useAuth();
    const location = useLocation();

    const [colapsado, setColapsado] = useState(false);

    const [administracionAbierta, setAdministracionAbierta] = useState(
        location.pathname.startsWith("/administracion")
    );

    const puedeVerAdministracion =
        tienePermiso("administracion.consultar") ||
        tienePermiso("administracion.administrar");

    if (permisosCargando) {
        return null;
    }

    const claseSidebar = `dashboard-sidebar ${colapsado ? "collapsed" : ""}`;

    const claseLink = "sidebar-item";

    return (
        <aside className={claseSidebar}>

            {/* Logo */}
    <div className="sidebar-brand-box">
    {/* Logo para sidebar contraído */}
    <img
       src="/logo-passus-huellas.png"
        alt="Passus"
        className="sidebar-logo-img sidebar-logo-collapsed"
    />

    {/* Logo para sidebar expandido */}
    <img
        src="/logoPassusTransp.png"
        alt="Passus Logo"
        className="sidebar-logo-img sidebar-logo-expanded"
    />
</div>

      

            {/* Menú */}
            <nav className="sidebar-menu">

                {/* Inicio */}
                <Link
                    to="/vista-principal"
                    className={`${claseLink} ${
                        location.pathname === "/vista-principal" ? "active" : ""
                    }`}
                    title="Inicio / Dashboard"
                >
                    <span className="sidebar-icon">
                        <i className="fa-sharp fa-solid fa-house-signal"></i>
                    </span>
                    <span className="sidebar-label">Inicio / Dashboard</span>
                </Link>

                {/* Crear reporte */}
                {tienePermiso("reportes.crear") && (
                    <Link
                        to="/crear-reporte"
                        className={`${claseLink} ${
                            location.pathname === "/crear-reporte" ? "active" : ""
                        }`}
                        title="Reportar evento"
                    >
                        <span className="sidebar-icon">
                            <i className="fa-sharp fa-solid fa-plus"></i>
                        </span>
                        <span className="sidebar-label">Reportar evento</span>
                    </Link>
                )}

                {/* Reportes */}
                {tienePermiso("reportes.consultar") && (
                    <Link
                        to="/lista-reportes"
                        className={`${claseLink} ${
                            location.pathname === "/lista-reportes" ? "active" : ""
                        }`}
                        title="Reportes"
                    >
                        <span className="sidebar-icon">
                            <i className="fa-sharp fa-solid fa-chart-column"></i>
                        </span>
                        <span className="sidebar-label">Reportes</span>
                    </Link>
                )}

                {/* Análisis */}
                {tienePermiso("analisis.consultar") && (
                    <Link
                        to="/analisis"
                        className={`${claseLink} ${
                            location.pathname === "/analisis" ? "active" : ""
                        }`}
                        title="Análisis"
                    >
                        <span className="sidebar-icon">
                            <i className="fa-sharp fa-solid fa-magnifying-glass-chart"></i>
                        </span>
                        <span className="sidebar-label">Análisis</span>
                    </Link>
                )}

                {/* Indicadores */}
                {tienePermiso("indicadores.consultar") && (
                    <Link
                        to="/indicadores"
                        className={`${claseLink} ${
                            location.pathname === "/indicadores" ? "active" : ""
                        }`}
                        title="Indicadores"
                    >
                        <span className="sidebar-icon">
                            <i className="fa-sharp fa-solid fa-chart-line"></i>
                        </span>
                        <span className="sidebar-label">Indicadores</span>
                    </Link>
                )}

                {/* Rondas de seguridad */}
                <Link
                    to="/rondas"
                    className={claseLink}
                    title="Rondas de seguridad"
                >
                    <span className="sidebar-icon">
                        <i className="fa-sharp fa-solid fa-shield-halved"></i>
                    </span>
                    <span className="sidebar-label">Rondas de seguridad</span>
                </Link>

                {/* Adherencia */}
                <Link
                    to="/adherencia"
                    className={claseLink}
                    title="Adherencia"
                >
                    <span className="sidebar-icon">
                        <i className="fa-sharp fa-solid fa-clipboard-check"></i>
                    </span>
                    <span className="sidebar-label">Adherencia</span>
                </Link>

                {/* Encuestas */}
                <Link
                    to="/encuestas"
                    className={claseLink}
                    title="Encuestas"
                >
                    <span className="sidebar-icon">
                        <i className="fa-sharp fa-solid fa-clipboard-list"></i>
                    </span>
                    <span className="sidebar-label">Encuestas</span>
                </Link>

                {/* Capacitación */}
                <Link
                    to="/capacitacion"
                    className={claseLink}
                    title="Capacitación y campañas"
                >
                    <span className="sidebar-icon">
                        <i className="fa-sharp fa-solid fa-graduation-cap"></i>
                    </span>
                    <span className="sidebar-label">Capacitación y campañas</span>
                </Link>

                {/* Documentación */}
                <Link
                    to="/documentacion"
                    className={claseLink}
                    title="Documentación"
                >
                    <span className="sidebar-icon">
                        <i className="fa-sharp fa-solid fa-folder-open"></i>
                    </span>
                    <span className="sidebar-label">Documentación</span>
                </Link>

                {/* Alertas */}
                <Link
                    to="/alertas"
                    className={claseLink}
                    title="Alertas"
                >
                    <span className="sidebar-icon">
                        <i className="fa-sharp fa-solid fa-bell"></i>
                    </span>
                    <span className="sidebar-label">Alertas</span>
                </Link>

                {/* Administración */}
                {puedeVerAdministracion && (
                    <div className="sidebar-administracion">

                        <button
                            type="button"
                            className={`sidebar-item sidebar-admin-toggle ${
                                location.pathname.startsWith("/administracion")
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                setAdministracionAbierta(!administracionAbierta)
                            }
                            title="Administración"
                            aria-expanded={administracionAbierta}
                        >
                            <span className="sidebar-icon">
                                <i className="fa-sharp fa-solid fa-gear"></i>
                            </span>

                            <span className="sidebar-label">
                                Administración
                            </span>

                            <span className="sidebar-arrow">
                                <i className={`fa-sharp fa-solid ${
                                    administracionAbierta
                                        ? "fa-chevron-down"
                                        : "fa-chevron-right"
                                }`}></i>
                            </span>
                        </button>

                        {administracionAbierta && (
                            <div className="sidebar-submenu">

                                {/* Usuarios */}
                                {tienePermiso("administracion.consultar") && (
                                    <Link
                                        to="/administracion/usuarios"
                                        className={`sidebar-item sidebar-subitem ${
                                            location.pathname === "/administracion/usuarios"
                                                ? "active"
                                                : ""
                                        }`}
                                        title="Usuarios"
                                    >
                                        <span className="sidebar-icon">
                                            <i className="fa-sharp fa-solid fa-users"></i>
                                        </span>
                                        <span className="sidebar-label">
                                            Usuarios
                                        </span>
                                    </Link>
                                )}

                                {/* Roles y permisos */}
                                {tienePermiso("administracion.administrar") && (
                                    <Link
                                        to="/administracion/roles-permisos"
                                        className={`sidebar-item sidebar-subitem ${
                                            location.pathname === "/administracion/roles-permisos"
                                                ? "active"
                                                : ""
                                        }`}
                                        title="Roles y permisos"
                                    >
                                        <span className="sidebar-icon">
                                            <i className="fa-sharp fa-solid fa-user-lock"></i>
                                        </span>
                                        <span className="sidebar-label">
                                            Roles y permisos
                                        </span>
                                    </Link>
                                )}

                            </div>
                        )}
                    </div>
                )}

            </nav>

            {/* Centro de ayuda */}
            <div className="sidebar-footer-link">
                <a
                    href="#ayuda"
                    className="sidebar-item"
                    title="Centro de ayuda"
                >
                    <span className="sidebar-icon">
                        <i className="fa-sharp fa-solid fa-circle-question"></i>
                    </span>
                    <span className="sidebar-label">Centro de ayuda</span>
                </a>
            </div>

        </aside>
    );
};

export default Sidebar;



























// import { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const Sidebar = () => {

//     const { tienePermiso, permisosCargando } = useAuth();
//     const location = useLocation();

//     const [administracionAbierta, setAdministracionAbierta] = useState(
//         location.pathname.startsWith("/administracion")
//     );

//     // Permisos de administración
//     const puedeVerAdministracion =
//         tienePermiso("administracion.consultar") ||
//         tienePermiso("administracion.administrar");

//     if (permisosCargando) {
//         return null;
//     }

//     return (
//         <aside className="dashboard-sidebar">

//             {/* Logo */}
//             <div className="sidebar-brand-box">
//                 <img
//                     src="/logoPassusTransp.png"
//                     alt="Passus Logo"
//                     className="sidebar-logo-img"
//                 />
//             </div>

//             {/* Menú */}
//             <nav className="sidebar-menu">

//                 {/* Inicio */}
//                 <Link to="/vista-principal" className="sidebar-item">
//                     <span className="sidebar-icon">
//                         <i className="fa-sharp fa-solid fa-house-signal"></i>
//                     </span>
//                     Inicio / Dashboard
//                 </Link>

//                 {/* Crear reporte */}
//                 {tienePermiso("reportes.crear") && (
//                     <Link to="/crear-reporte" className="sidebar-item">
//                         <span className="sidebar-icon">
//                             <i className="fa-sharp fa-solid fa-plus"></i>
//                         </span>
//                         Reportar evento
//                     </Link>
//                 )}

//                 {/* Consultar reportes */}
//                 {tienePermiso("reportes.consultar") && (
//                     <Link to="/lista-reportes" className="sidebar-item">
//                         <span className="sidebar-icon">
//                             <i className="fa-sharp fa-solid fa-chart-column"></i>
//                         </span>
//                         Reportes
//                     </Link>
//                 )}

//                 {/* Análisis */}
//                 {tienePermiso("analisis.consultar") && (
//                     <Link to="/analisis" className="sidebar-item">
//                         <span className="sidebar-icon">
//                             <i className="fa-sharp fa-solid fa-magnifying-glass-chart"></i>
//                         </span>
//                         Análisis
//                     </Link>
//                 )}

//                 {/* Indicadores */}
//                 {tienePermiso("indicadores.consultar") && (
//                     <Link to="/indicadores" className="sidebar-item">
//                         <span className="sidebar-icon">
//                             <i className="fa-sharp fa-solid fa-chart-line"></i>
//                         </span>
//                         Indicadores
//                     </Link>
//                 )}

//                 {/* Rondas de seguridad */}
//                 <Link to="/rondas" className="sidebar-item">
//                     <span className="sidebar-icon">
//                         <i className="fa-sharp fa-solid fa-shield-halved"></i>
//                     </span>
//                     Rondas de seguridad
//                 </Link>

//                 {/* Adherencia */}
//                 <Link to="/adherencia" className="sidebar-item">
//                     <span className="sidebar-icon">
//                         <i className="fa-sharp fa-solid fa-clipboard-check"></i>
//                     </span>
//                     Adherencia
//                 </Link>

//                 {/* Encuestas */}
//                 {/* {tienePermiso("encuestas.consultar") && ( */}
//                 <Link to="/encuestas" className="sidebar-item">
//                     <span className="sidebar-icon">
//                         <i className="fa-sharp fa-solid fa-clipboard-list"></i>
//                     </span>
//                     Encuestas
//                 </Link>
//                 {/* )} */}

//                 {/* Capacitación */}
//                 <Link to="/capacitacion" className="sidebar-item">
//                     <span className="sidebar-icon">
//                         <i className="fa-sharp fa-solid fa-graduation-cap"></i>
//                     </span>
//                     Capacitación y campañas
//                 </Link>

//                 {/* Documentación */}
//                 <Link to="/documentacion" className="sidebar-item">
//                     <span className="sidebar-icon">
//                         <i className="fa-sharp fa-solid fa-folder-open"></i>
//                     </span>
//                     Documentación
//                 </Link>

//                 {/* Alertas */}
//                 {/* {tienePermiso("alertas.consultar") && ( */}
//                 <Link to="/alertas" className="sidebar-item">
//                     <span className="sidebar-icon">
//                         <i className="fa-sharp fa-solid fa-bell"></i>
//                     </span>
//                     Alertas
//                 </Link>
//                 {/* )} */}

//                 {/* Administración */}
//                 {puedeVerAdministracion && (
//                     <div className="sidebar-administracion">

//                         <button
//                             type="button"
//                             className={`sidebar-item sidebar-admin-toggle ${location.pathname.startsWith("/administracion")
//                                 ? "active"
//                                 : ""
//                                 }`}
//                             onClick={() =>
//                                 setAdministracionAbierta(!administracionAbierta)
//                             }
//                         >
//                             <span className="sidebar-icon">
//                                 <i className="fa-sharp fa-solid fa-gear"></i>
//                             </span>
//                             Administración

//                             <span className="sidebar-arrow">
//                                 {administracionAbierta ? "⌄" : "›"}
//                             </span>
//                         </button>

//                         {administracionAbierta && (
//                             <div className="sidebar-submenu">

//                                 {/* Usuarios */}
//                                 {tienePermiso("administracion.consultar") && (
//                                     <Link
//                                         to="/administracion/usuarios"
//                                         className={`sidebar-item sidebar-subitem ${location.pathname === "/administracion/usuarios"
//                                             ? "active"
//                                             : ""
//                                             }`}
//                                     >
//                                         <span className="sidebar-icon">
//                                             <i className="fa-sharp fa-solid fa-users"></i>
//                                         </span>
//                                         Usuarios
//                                     </Link>
//                                 )}

//                                 {/* Roles y permisos */}
//                                 {tienePermiso("administracion.administrar") && (
//                                     <Link
//                                         to="/administracion/roles-permisos"
//                                         className={`sidebar-item sidebar-subitem ${location.pathname === "/administracion/roles-permisos"
//                                             ? "active"
//                                             : ""
//                                             }`}
//                                     >
//                                         <span className="sidebar-icon">
//                                             <i className="fa-sharp fa-solid fa-user-lock"></i>
//                                         </span>
//                                         Roles y permisos
//                                     </Link>
//                                 )}

//                             </div>
//                         )}
//                     </div>
//                 )}

//             </nav>

//             {/* Centro de ayuda */}
//             <div className="sidebar-footer-link">
//                 <a href="#ayuda" className="sidebar-item">
//                     <span className="sidebar-icon">
//                         <i className="fa-sharp fa-solid fa-circle-question"></i>
//                     </span>
//                     Centro de ayuda
//                 </a>
//             </div>

//         </aside>
//     );
// };

// export default Sidebar;
