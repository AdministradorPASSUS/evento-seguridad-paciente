import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";
import "./styles/DetallePlanAccion.css";
import PageHeader from "../../components/PageHeader";

const DetallePlanAccion = () => {
  const { id } = useParams(); // ID individual de la acción de mejora
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [accion, setAccion] = useState(null);

  useEffect(() => {
    cargarDetalleAccion();
  }, [id]);

  const cargarDetalleAccion = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/plan-accion/${id}`);
      setAccion(response.data);
    } catch (error) {
      console.error("Error al cargar el detalle de la acción", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar la información del plan de acción.",
        confirmButtonColor: "#00933f",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dpa-loading-container">
        <div className="dpa-spinner"></div>
        <p>Cargando detalle del plan de acción...</p>
      </div>
    );
  }

  if (!accion) {
    return (
      <div className="dpa-container">
        <div className="dpa-form-card text-center">
          <h3>Acción no encontrada</h3>
          <p>El plan de acción consultado no existe o fue eliminado.</p>
          <button className="dpa-btn-back" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left"></i> Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    
      <div className="dpa-container">
        <div className="dpa-top-bar">
          <h2>DETALLE DE ACTIVIDAD</h2>
          <button
            type="button"
            className="dpa-btn-back"
            onClick={() => navigate(-1)}
          >
            <i className="fa-solid fa-arrow-left"></i> Volver
          </button>
        </div>

        <div className="dpa-form-card">
          <div className="dpa-header-info">
            <span className="dpa-badge">ID Plan: #{accion.id}</span>
            <span className={`dpa-status-badge ${accion.estado_plan_accion?.toLowerCase().replace(/\s+/g, '-')}`}>
              {accion.estado_plan_accion}
            </span>
          </div>

          <div className="dpa-grid-2 mt-4">
            <div className="dpa-field-group">
              <label>¿Qué se va a hacer?</label>
              <div className="dpa-box-content">{accion.que}</div>
            </div>

            <div className="dpa-field-group">
              <label>¿Para qué? (Objetivo)</label>
              <div className="dpa-box-content">{accion.para_que}</div>
            </div>
          </div>

          <div className="dpa-grid-3 mt-3">
            <div className="dpa-field-group">
              <label>¿Quién? (Responsable)</label>
              <div className="dpa-text-content">{accion.quien}</div>
            </div>

            <div className="dpa-field-group">
              <label>¿Cuándo? (Fecha Límite)</label>
              <div className="dpa-text-content">{accion.cuando}</div>
            </div>

            <div className="dpa-field-group">
              <label>¿Dónde? (Lugar / Servicio)</label>
              <div className="dpa-text-content">{accion.donde}</div>
            </div>
          </div>

          <div className="dpa-grid-3 mt-3">
            <div className="dpa-field-group">
              <label>Fecha de Creación</label>
              <div className="dpa-text-content">
                {accion.created_at ? new Date(accion.created_at).toLocaleString() : "N/A"}
              </div>
            </div>

            <div className="dpa-field-group">
              <label>Creado Por</label>
              <div className="dpa-text-content">{accion.creado_por || "Sistema"}</div>
            </div>

            <div className="dpa-field-group">
              <label>Fecha de Ejecución</label>
              <div className="dpa-text-content">{accion.fecha_ejecucion || "Sin registrar"}</div>
            </div>
          </div>

          <div className="dpa-grid-2 mt-3">
            <div className="dpa-field-group">
              <label>Estado de la Actividad</label>
              <div className="dpa-text-content">{accion.estado_actividad || "Sin registrar"}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetallePlanAccion;