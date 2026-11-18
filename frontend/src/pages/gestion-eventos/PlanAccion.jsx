
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";
import "./styles/PlanAccion.css";
import PageHeader from "../../components/PageHeader";

const PlanAccion = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reporte, setReporte] = useState(null);
  const [acciones, setAcciones] = useState([]);
  const [analisis, setAnalisis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);

        const [
          reporteResponse,
          accionesResponse,
          analisisResponse
        ] = await Promise.all([
          api.get(`/reportes/${id}`),
          api.get(`/reportes/${id}/plan-accion`),
          api.get(`/reportes/${id}/analisis`)
        ]);

        // Datos generales del reporte
        setReporte(
          reporteResponse.data?.data ?? reporteResponse.data
        );

        // Actividades del plan de acción
        const accionesData =
          accionesResponse.data?.data ?? accionesResponse.data;

        setAcciones(
          Array.isArray(accionesData) ? accionesData : []
        );

        // Análisis del evento
        setAnalisis(
          analisisResponse.data?.data ?? analisisResponse.data
        );

      } catch (error) {
        console.error("Error cargando los datos:", error);

        await Swal.fire({
          icon: "error",
          title: "Error al cargar",
          text: "No fue posible cargar toda la información del reporte.",
          confirmButtonColor: "#00933f"
        });
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id]);

  const cargarAnalisis = async () => {
    try {
      const response = await api.get(`/reportes/${id}/analisis`);

      setAnalisis(response.data.data || response.data);
    } catch (error) {
      console.error("Error al cargar el análisis:", error);
      setAnalisis(null);
    }
  };

  if (loading) {
    return (
      <div className="pa-loading-container">
        <div className="pa-spinner"></div>
        <p>Cargando información del reporte...</p>
      </div>
    );
  }

  if (!reporte) {
    return (
      <div className="pa-container">
        <p>No se encontró la información del reporte.</p>
        <button onClick={() => navigate("/lista-reportes")}>
          Volver a reportes
        </button>
      </div>
    );
  }

  return (
    <>
     
      <div className="pa-layout">

        {/* PANEL IZQUIERDO: DETALLE DEL REPORTE */}

        <aside className="pa-reporte-panel">
          <div className="pa-reporte-header">
            <h3>EVENTO NÚMERO: {reporte.codigo}</h3>

            <button
              type="button"
              className="pa-icon-button"
              title="Actualizar información"
              onClick={() => window.location.reload()}
            >
              <i className="fa-solid fa-rotate"></i>
            </button>
          </div>

          <div className="pa-reporte-body">
            <div className="pa-detail-group">
              <label>FECHA Y HORA DEL EVENTO</label>
              <p>{reporte.fecha_hora_evento || "No registrada"}</p>
            </div>

            <div className="pa-detail-group">
              <label>DESCRIPCIÓN DEL EVENTO</label>
              <p className="pa-description">
                {reporte.descripcion_evento || "Sin descripción"}
              </p>
            </div>

            <div className="pa-detail-group">
              <label>CATEGORIZACIÓN</label>
              <p>
                {reporte.relacionado_con ||
                  "No especificada"}
              </p>
            </div>

            <div className="pa-detail-group">
              <label>ESTADO</label>
              <p>{reporte.estado || "No especificado"}</p>
            </div>

            <div className="pa-detail-group">
              <label>CLASIFICACIÓN DEL EVENTO</label>
              <p>{analisis?.clasificacion_evento ?? "No especificada"}</p>
            </div>

            <div className="pa-detail-group">
              <label>PREVENIBLE</label>
              <p>{
                analisis?.prevenible === true
                  ? "Sí"
                  : analisis?.prevenible === false
                    ? "No"
                    : analisis?.prevenible ?? "No especificado"
              }</p>
            </div>

            <div className="pa-detail-group">
              <label>SEVERIDAD</label>
              <p>{analisis?.severidad ?? "No especificada"}</p>
            </div>

            <div className="pa-detail-group">
              <label>SEDE</label>
              <p>{reporte.sede || "No especificada"}</p>
            </div>

            <div className="pa-detail-group">
              <label>SERVICIO</label>
              <p>{reporte.servicio || "No especificado"}</p>
            </div>
          </div>

          <button
            type="button"
            className="pa-btn-back"
            onClick={() => navigate("/lista-reportes")}
          >
            <i className="fa-solid fa-arrow-left"></i>
            Volver a reportes
          </button>
        </aside>


        {/* PANEL DERECHO: LISTADO DE ACCIONES */}
        <main className="pa-list-panel">
          <div className="pa-list-header">
            <h2>PLAN DE ACCIÓN Y BARRERAS DE SEGURIDAD</h2>

            <button
              type="button"
              className="pa-btn-add-main"
              onClick={() =>
                navigate(`/reportes/${id}/plan-accion/crear`)
              }
            >
              <i className="fa-solid fa-plus"></i>
              Agregar Actividad
            </button>
          </div>

          <div className="pa-table-wrapper">
            <table className="pa-table">
              <thead>
                <tr>
                  <th>¿QUÉ?</th>
                  <th>¿QUIÉN?</th>
                  <th>¿CUÁNDO?</th>
                  <th>¿DÓNDE?</th>
                  <th>ESTADO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>

              <tbody>
                {acciones.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="pa-empty"
                    >
                      No hay actividades registradas.
                      <br />
                      Pulsa "Agregar Actividad" para
                      crear la primera.
                    </td>
                  </tr>
                ) : (
                  acciones.map((accion, index) => (
                    <tr key={accion.id ?? index}>
                      <td>
                        {accion.que || "Sin descripción"}
                      </td>
                      <td>
                        {accion.quien || "Sin responsable"}
                      </td>
                      <td>
                        {accion.cuando || "Sin fecha"}
                      </td>
                      <td>
                        {accion.donde || "Sin lugar"}
                      </td>
                      <td>
                        <span className="pa-status">
                          {accion.estado_plan_accion ??
                            "Pendiente"}
                        </span>
                      </td>
                      <td className="pa-td-actions">
                        <div className="pa-actions-container">
                          <button
                            type="button"
                            className="pa-btn-view"
                            title="Ver detalle de la actividad"
                            onClick={() => navigate(`/plan-accion/${accion.id}/detalle`)}
                          >
                            <i className="fa-solid fa-eye"></i>
                          </button>

                          <button
                            type="button"
                            className="pa-btn-view"
                            title="Editar actividad"
                            onClick={() => navigate(`/reportes/${id}/plan-accion/crear`)}
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="pa-list-footer">
            Filas: {acciones.length}
          </div>
        </main>
      </div>
    </>
  );
};

export default PlanAccion;
