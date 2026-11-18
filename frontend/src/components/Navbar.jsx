const Navbar = ({ nombreCompleto, rolUsuario, handleLogout }) => {

  const iniciales = nombreCompleto
    ? nombreCompleto.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'US';
  return (
    <header className="dashboard-topnav">

      {/* Lado Izquierdo: Títulos institucionales */}
      <div className="topnav-left-titles">
        <h2 className="topnav-main-title">Herramienta Integral de Seguridad del Paciente</h2>
        <p className="topnav-sub-title">Sistema de Registro y Gestión de Eventos de Seguridad del Paciente</p>
      </div>

      {/* Lado Derecho: Iconos y Perfil de Usuario */}
      <div className="topnav-right">

        {/* Notificaciones con indicador rojo (ej. 3) */}
     <button className="topnav-icon-btn" title="Notificaciones">
    <i className="fa-sharp fa-solid fa-bell"></i>
    <span className="notification-badge">3</span>
</button>

{/* Botón de Ayuda */}
<button className="topnav-icon-btn" title="Ayuda">
    <i className="fa-sharp fa-solid fa-circle-question"></i>
</button>

        {/* Perfil del usuario con imagen o avatares */}
        <div className="topnav-user-profile" onClick={handleLogout} title="Hacer clic para cerrar sesión">
          <div className="user-avatar-initials">
            {nombreCompleto ? nombreCompleto.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'US'}
          </div>

          <div className="user-profile-info">
            <span className="profile-name">{nombreCompleto}</span>
            <span className="profile-role">{rolUsuario}</span>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;