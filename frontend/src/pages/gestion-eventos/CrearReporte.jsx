import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
// import '../styles/Register.css'; 
import './styles/CrearReporte.css';
import api from "../../services/api";

const formularioInicial = {
    numero_documento: "",
    nombre_completo: "",
    edad: "",
    sede: "",
    servicio: "",
    entidad: "",
    fecha_hora_evento: "",
    relacionado_con: "",
    descripcion_evento: "",
    derivo_urgencias: "false",
    evidencia: []
};

const CrearReporte = () => {
  const navigate = useNavigate();

const [form, setForm] = useState({ ...formularioInicial });

  const serviciosPorSede = {

    "HDT - BGTA SUR OCCIDENTE": [
      "HIDROTERAPIA"
    ],

    "RHB - BGTA SUR OCCIDENTE": [
      "FISIATRÍA",
      "NEUROPEDIATRÍA",
      "PROGRAMA REHABILITACIÓN INTEGRAL",
      "PSIQUIATRÍA INFANTIL",
    ],



    "HDT-BGTA NORTE": [
      "FISIATRÍA",
      "HIDROTERAPIA",
      "PSIQUIATRÍA ",
      "PSIQUIATRÍA PEDIÁTRICA",
    ],

    "HDT - BGTA CENTRO": [
      "HIDROTERAPIA",
      "PROGRAMA REHABILITACIÓN INTEGRAL",
    ],

    "RHB-CHÍA": [
      "FISIATRÍA",
      "PROGRAMA REHABILITACIÓN INTEGRAL",
      "PSIQUIATRÍA INFANTIL",
    ],

    "RHB-FLORENCIA": [
      "NEUROPEDIATRÍA",
      "PROGRAMA REHABILITACIÓN INTEGRAL",
      "PSIQUIATRÍA INFANTIL",
      "HIDROTERAPIA",
    ],

    "RHB-IBAGUÉ": [
      "NEUROPEDIATRÍA",
      "PROGRAMA REHABILITACIÓN INTEGRAL",
      "PSIQUIATRÍA INFANTIL",
      "HIDROTERAPIA",
    ],
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const archivosNuevos = Array.from(files);

      setForm((prevForm) => ({
        ...prevForm,
        evidencia: [
          ...(prevForm.evidencia || []),
          ...archivosNuevos,
        ],
      }));

      // Permite volver a seleccionar el mismo archivo si es necesario
      e.target.value = "";
    } else if (name === "sede") {
      setForm((prevForm) => ({
        ...prevForm,
        sede: value,
        servicio: "",
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    }
  };

  const eliminarEvidencia = (indexEliminar) => {
    setForm((prevForm) => ({
      ...prevForm,
      evidencia: (prevForm.evidencia || []).filter(
        (_, index) => index !== indexEliminar
      ),
    }));
  };



const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('numero_documento', form.numero_documento);
    formData.append('nombre_completo', form.nombre_completo);
    formData.append('edad', form.edad);
    formData.append('sede', form.sede);
    formData.append('servicio', form.servicio);
    formData.append('entidad', form.entidad);
    formData.append('fecha_hora_evento', form.fecha_hora_evento);
    formData.append('relacionado_con', form.relacionado_con);
    formData.append('descripcion_evento', form.descripcion_evento);
    formData.append('derivo_urgencias', form.derivo_urgencias);

    if (form.evidencia?.length > 0) {
        form.evidencia.forEach((archivo) => {
            formData.append('evidencia[]', archivo);
        });
    }

    try {
        await api.post('/reportes', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        await Swal.fire({
            icon: 'success',
            title: '¡Reporte radicado!',
            text: 'El evento de seguridad del paciente se guardó con éxito.',
            confirmButtonColor: '#00933f',
            confirmButtonText: 'Aceptar'
        });

        // Restablecer el formulario
        setForm({ ...formularioInicial });

        // Limpiar el input de archivos
        document.querySelectorAll('input[type="file"]').forEach((input) => {
            input.value = '';
        });

    } catch (error) {
        console.error('Error al registrar el reporte:', error);

        const mensaje =
            error.response?.data?.message ||
            'No se pudo completar el registro del reporte.';

        await Swal.fire({
            icon: 'error',
            title: 'No se pudo radicar el reporte',
            text: mensaje,
            confirmButtonColor: '#00933f',
            confirmButtonText: 'Entendido'
        });
    }
};



  return (
    <div className="crear-reporte-container">
      <h2 className="crear-reporte-title">Nuevo Reporte de Seguridad del Paciente</h2>
      <p className="crear-reporte-subtitle">
        Diligencie todos los campos requeridos para el análisis del evento adverso o incidente.
      </p>

      <form onSubmit={handleSubmit} className="crear-reporte-form">

        {/* Documento y Nombre */}
        <div className="crear-reporte-grid-2">
          <div className="crear-reporte-field-group">
            <label className="crear-reporte-label">N° Documento Paciente</label>
            <input type="text" name="numero_documento" className="register-field-input" required value={form.numero_documento} onChange={handleChange} placeholder="Ej: 1011908070" />
          </div>
          <div className="crear-reporte-field-group">
            <label className="crear-reporte-label">Nombre Completo del Paciente</label>
            <input type="text" name="nombre_completo" className="register-field-input" required value={form.nombre_completo} onChange={handleChange} placeholder="Nombre y Apellidos" />
          </div>
        </div>

        {/* Edad, Sede y Servicio */}
        <div className="crear-reporte-grid-3">
          <div className="crear-reporte-field-group">
            <label className="crear-reporte-label">Edad</label>
            <input type="number" name="edad" className="register-field-input" required value={form.edad} onChange={handleChange} placeholder="Años" />
          </div>

          <div className="crear-reporte-field-group">
            <label className="crear-reporte-label">Sede</label>

            <select
              name="sede"
              className="register-field-input"
              value={form.sede}
              onChange={handleChange}
            >
              <option value="">Seleccione una sede</option>
              <option value="HDT - BGTA SUR OCCIDENTE">
                HDT - BGTA SUR OCCIDENTE
              </option>
              <option value="RHB - BGTA SUR OCCIDENTE">
                RHB - BGTA SUR OCCIDENTE
              </option>
              <option value="HDT-BGTA NORTE">HDT-BGTA NORTE</option>
              <option value="HDT - BGTA CENTRO">HDT - BGTA CENTRO</option>
              <option value="RHB-CHÍA">RHB-CHÍA</option>
              <option value="RHB-FLORENCIA">RHB-FLORENCIA</option>
              <option value="RHB-IBAGUÉ">RHB-IBAGUÉ</option>
            </select>
          </div>

          <div className="crear-reporte-field-group">
            <label className="crear-reporte-label">Servicio</label>

            <select
              name="servicio"
              className="register-field-input"
              value={form.servicio}
              onChange={handleChange}
              disabled={!form.sede}
            >
              <option value="">Seleccione un servicio</option>

              {(serviciosPorSede[form.sede] || []).map((servicio) => (
                <option key={servicio} value={servicio}>
                  {servicio}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Entidad y Fecha/Hora */}
        <div className="crear-reporte-grid-equal-2">

          <div className="crear-reporte-field-group">
            <label className="crear-reporte-label">
              Entidad (EPS / ARP)
            </label>

            <select
              name="entidad"
              className="register-field-input"
              required
              value={form.entidad}
              onChange={handleChange}
            >
              <option value="">Seleccione una EPS</option>
              <option value="ALIANSALUD">ALIANSALUD</option>
              <option value="CAFAM">CAFAM</option>
              <option value="COLMEDICA - MEDICINA PREPAGADA">COLMEDICA - MEDICINA PREPAGADA</option>
              <option value="COMPENSAR EPS">COMPENSAR EPS</option>
              <option value="COMPENSAR - PLAN COMPLEMENTARIO">COMPENSAR - PLAN COMPLEMENTARIO</option>
              <option value="FAMISANAR">FAMISANAR</option>
              <option value="NUEVA EPS">NUEVA EPS</option>
              <option value="SURA">SURA</option>
              <option value="PARTICULAR">PARTICULAR</option>
              <option value="SANITAS">SANITAS</option>
              <option value="POSITVA">POSITIVA</option>
              <option value="ASMET SALUD">ASMET SALUD</option>
              <option value="SEGUROS BOLIVAR">SEGUROS BOLIVAR</option>
              <option value="FOMAG">FOMAG</option>
            </select>
          </div>

          <div className="crear-reporte-field-group">
            <label className="crear-reporte-label">Fecha y Hora del Evento</label>
            <input type="datetime-local" name="fecha_hora_evento" className="register-field-input" required value={form.fecha_hora_evento} onChange={handleChange} />
          </div>

          <div className="crear-reporte-field-group">
            <label className="crear-reporte-label">
              Relacionado con
            </label>

            <select
              name="relacionado_con"
              className="register-field-input"
              required
              value={form.relacionado_con}
              onChange={handleChange}
            >
              <option value="">Seleccione una opción</option>
              <option value="Ahogamiento o atragantamiento">
                Ahogamiento o atragantamiento
              </option>
              <option value="Accion insegura">
                Acción insegura
              </option>
              <option value="Autoagresión o Heteroagresión">
                Autoagresión o Heteroagresión
              </option>
              <option value="Caídas">Caídas</option>
              <option value="Compilación">Compilación</option>
              <option value="Dispositivos médicos o biomédicos">
                Dispositivos médicos o biomédicos
              </option>
              <option value="Identificación del paciente">
                Identificación del paciente
              </option>
              <option value="Indicio accioón insegura">
                Indicio acción insegura
              </option>
              <option value="Indicio de atención insegura">
                Indicio de atención insegura
              </option>
              <option value="Lesiones de piel">Lesiones de piel</option>
              <option value="Medicamentos">Medicamentos</option>
              <option value="Perdida o fuga del paciente">
                Pérdida o fuga del paciente
              </option>
            </select>
          </div>

        </div>

        {/* Descripción */}
        <div className="crear-reporte-field-group">
          <label className="crear-reporte-label">Descripción Detallada del Evento</label>
          <textarea name="descripcion_evento" rows="4" className="register-field-input" required value={form.descripcion_evento} onChange={handleChange} placeholder="Describa objetivamente lo ocurrido..."></textarea>
        </div>

        {/* Derivó a Urgencias y Evidencia */}
        <div className="crear-reporte-grid-equal-2">
          <div className="crear-reporte-field-group">
            <label className="crear-reporte-label">¿Derivó a Urgencias?</label>
            <select name="derivo_urgencias" className="register-field-input" value={form.derivo_urgencias} onChange={handleChange}>
              <option value="false">No</option>
              <option value="true">Sí</option>
            </select>
          </div>
          <div className="crear-reporte-field-group">
            <div className="crear-reporte-field-group">
              <label className="crear-reporte-label">
                Evidencias (Fotos o archivos PDF)
              </label>

              <input
                type="file"
                name="evidencia"
                accept="image/*,.pdf"
                onChange={handleChange}
                className="crear-reporte-file"
              />

              <div className="evidencias-lista">
                {form.evidencia?.map((archivo, index) => (
                  <div className="evidencia-item" key={`${archivo.name}-${index}`}>
                    <span className="evidencia-icono">
                      {archivo.type === "application/pdf" ? "📄" : "🖼️"}
                    </span>

                    <span className="evidencia-nombre" title={archivo.name}>
                      {archivo.name}
                    </span>

                    <button
                      type="button"
                      className="evidencia-eliminar"
                      onClick={() => eliminarEvidencia(index)}
                      aria-label={`Eliminar ${archivo.name}`}
                      title="Eliminar archivo"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Botones */}
        <div className="crear-reporte-buttons">
          <button type="submit" className="crear-reporte-btn-submit">
            Guardar y Enviar Reporte
          </button>
          <button type="button" onClick={() => navigate('/vista-principal')} className="crear-reporte-btn-cancel">
            Cancelar
          </button>
        </div>

      </form>
    </div>
  );
};

export default CrearReporte;


