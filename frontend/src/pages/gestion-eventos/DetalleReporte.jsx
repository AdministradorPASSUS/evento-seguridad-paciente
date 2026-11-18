// src/components/DetalleReporte.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import './styles/DetalleReporte.css';
import api from "../../services/api";
import AnalisisEvento from "./AnalisisEvento";

const DetalleReporte = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerReporte = async () => {
      try {
        const response = await api.get(`/reportes/${id}`);
        setReporte(response.data.data || response.data);
      } catch (error) {
        const mensaje = error.response?.data?.message || 'No se pudo cargar la información del reporte.';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: mensaje,
          confirmButtonColor: '#00933f',
        }).then(() => {
          navigate('/vista-principal');
        });
      } finally {
        setLoading(false);
      }
    };

    obtenerReporte();
  }, [id, navigate]);

  if (loading) {
    return <div className="detalle-reporte-loading">Cargando detalles del reporte...</div>;
  }

  if (!reporte) return null;

  // Extraer la lista de usuarios asignados (soportando camelCase y snake_case)
  const listaAsignados = reporte.usuariosAsignados || reporte.usuarios_asignados || [];

  return (
    <>
      <div className="detalle-reporte-container">
        <h2 className="detalle-reporte-title">Detalle del Reporte: {reporte.codigo}</h2>
        <p className="detalle-reporte-subtitle">
          Información registrada del evento de seguridad del paciente.
        </p>

        <div className="detalle-reporte-form-layout">

          {/* Estado y Código */}
          <div className="detalle-reporte-info-box">
            <div className="detalle-reporte-info-item">
              <span>ESTADO ACTUAL</span>
              <strong className="detalle-reporte-status">{reporte.estado}</strong>
            </div>
            <div className="detalle-reporte-info-item">
              <span>CÓDIGO ÚNICO</span>
              <strong>{reporte.codigo}</strong>
            </div>
            <div className="detalle-reporte-info-item">
              <span>FECHA DE REGISTRO</span>
              <strong>{new Date(reporte.created_at).toLocaleString()}</strong>
            </div>
          </div>

          {/* Documento y Nombre */}
          <div className="crear-reporte-grid-2">
            <div className="crear-reporte-field-group">
              <label className="crear-reporte-label">N° Documento Paciente</label>
              <input type="text" className="register-field-input" value={reporte.numero_documento} disabled />
            </div>
            <div className="crear-reporte-field-group">
              <label className="crear-reporte-label">Nombre Completo del Paciente</label>
              <input type="text" className="register-field-input" value={reporte.nombre_completo} disabled />
            </div>
          </div>

          {/* Edad, Sede y Servicio */}
          <div className="crear-reporte-grid-3">
            <div className="crear-reporte-field-group">
              <label className="crear-reporte-label">Edad</label>
              <input type="text" className="register-field-input" value={reporte.edad} disabled />
            </div>
            <div className="crear-reporte-field-group">
              <label className="crear-reporte-label">Sede</label>
              <input type="text" className="register-field-input" value={reporte.sede} disabled />
            </div>
            <div className="crear-reporte-field-group">
              <label className="crear-reporte-label">Servicio</label>
              <input type="text" className="register-field-input" value={reporte.servicio} disabled />
            </div>
          </div>

          {/* Entidad y Fecha/Hora */}
          <div className="crear-reporte-grid-equal-2">
            <div className="crear-reporte-field-group">
              <label className="crear-reporte-label">Entidad (EPS / ARP)</label>
              <input type="text" className="register-field-input" value={reporte.entidad} disabled />
            </div>
            <div className="crear-reporte-field-group">
              <label className="crear-reporte-label">Fecha y Hora del Evento</label>
              <input type="text" className="register-field-input" value={reporte.fecha_hora_evento} disabled />
            </div>
            <div className="crear-reporte-field-group">
              <label className="crear-reporte-label">Relacionado con</label>
              <input
                type="text"
                className="register-field-input"
                value={reporte.relacionado_con ?? ""}
                disabled
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="crear-reporte-field-group">
            <label className="crear-reporte-label">Descripción Detallada del Evento</label>
            <textarea rows="4" className="register-field-input" value={reporte.descripcion_evento} disabled></textarea>
          </div>

          {/* Derivó a Urgencias y Evidencia Adjunta */}
          <div className="crear-reporte-grid-equal-2 file">
            <div className="crear-reporte-field-group">
              <label className="crear-reporte-label">¿Derivó a Urgencias?</label>
              <input type="text" className="register-field-input" value={reporte.derivo_urgencias ? "Sí" : "No"} disabled />
            </div>
            <div className="crear-reporte-field-group">
              <label className="crear-reporte-label">
                Evidencias adjuntas
              </label>

              {reporte.evidencia_urls?.length > 0 ? (
                <div className="detalle-reporte-evidencias">
                  {reporte.evidencia_urls.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="detalle-reporte-file-link"
                    >
                      🖼️ Ver evidencia {index + 1}
                    </a>
                  ))}
                </div>
              ) : (
                <span className="detalle-reporte-no-file">
                  No se adjuntó evidencia.
                </span>
              )}
            </div>
          </div>

          {/* Responsables Asignados */}
          <div className="crear-reporte-field-group responsables-asignados">
            <label className="crear-reporte-label">
              Responsables Asignados:
            </label>

            <div className="responsables-lista">
              {listaAsignados.length > 0 ? (
                listaAsignados.map((user) => {
                  const nombreUsuario = user.nombre || user.name || 'Usuario';
                  const apellidoUsuario = user.apellido || user.apellidos || user.last_name || '';

                  const nombreCompleto = `${nombreUsuario} ${apellidoUsuario}`.trim();
                  const iniciales = nombreUriIniciales(nombreCompleto);

                  return (
                    <div className="responsable-item" key={user.id}>
                      <span className="responsable-iniciales">
                        {iniciales}
                      </span>

                      <span className="responsable-nombre">
                        {nombreCompleto}
                      </span>
                    </div>
                  );
                })
              ) : (
                <span className="responsables-vacio">
                  No hay usuarios asignados a este reporte.
                </span>
              )}
            </div>
          </div>

          {/* Botón de Regresar */}
          <div className="detalle-reporte-actions">
            <button
              type="button"
              onClick={() => navigate('/vista-principal')}
              className="detalle-reporte-btn-back"
            >
              Regresar a la Vista Principal
            </button>
          </div>

        </div>
      </div>
      <AnalisisEvento />
    </>
  );
};

// Función auxiliar para extraer iniciales
const nombreUriIniciales = (nombre) => {
  return nombre
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

export default DetalleReporte;