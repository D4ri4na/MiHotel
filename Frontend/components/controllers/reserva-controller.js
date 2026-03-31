import { API } from '../../api/api.js';
import { mostrarToast } from '../../utils/helpers.js';
import { cerrarModal } from '../modal/modal.js';

export async function abrirModalReserva() {
  document.getElementById("modales").innerHTML = `
    <div class="modal-fondo modal-fondo--visible" id="modal-cargando">
      <div class="modal" style="padding:40px; text-align:center;">
        <h3 style="color: #2980b9; margin-bottom: 10px;">⏳ Conectando con el Servidor...</h3>
        <p style="color: #666; font-size: 13px;">Descargando huéspedes y habitaciones disponibles</p>
      </div>
    </div>`;

  try {
    const [huespedes, habitaciones, tiposHabitacion] = await Promise.all([
      API.get('Huespedes'), 
      API.get('Habitaciones'), 
      API.get('Habitaciones/Tipos')
    ]);

    window.cacheHabitaciones = habitaciones || [];
    window.cacheTiposHabitacion = tiposHabitacion || [];

    const opcionesHuespedes = (huespedes || []).map(h => `<option value="${h.idHuesped}">${h.nombre} ${h.apellido} (CI: ${h.ci})</option>`).join('');
    
    const opcionesHabitaciones = (habitaciones || []).map(h => {
      const tipo = window.cacheTiposHabitacion.find(t => t.idTipo === h.idTipo) || { nombreTipo: "Básica" };
      return `<option value="${h.idHabitacion}">Habitación N° ${h.idHabitacion} - ${tipo.nombreTipo} (${h.estado})</option>`;
    }).join('');

    document.getElementById("modales").innerHTML = `
      <div class="modal-fondo modal-fondo--visible" id="modal-reserva">
        <div class="modal">
          <div class="modal__header">
            <span class="modal__titulo">Crear Nueva Reserva</span>
            <button type="button" class="modal__cerrar" onclick="cerrarModal('modal-reserva')">✕</button>
          </div>
          <div class="modal__cuerpo">
            <form class="form" id="form-reserva">
              <div class="form__campo">
                <label class="form__label">Huésped Titular</label>
                <select class="form__select" id="r-huesped" required>
                  <option value="">Seleccione un huésped...</option>
                  ${opcionesHuespedes}
                </select>
              </div>
              
              <div class="form__campo">
                <label class="form__label">Variación de Habitación</label>
                <select class="form__select" id="r-habitacion" onchange="Controllers.mostrarResumenHabitacion(this.value)" required>
                  <option value="">Seleccione una habitación...</option>
                  ${opcionesHabitaciones}
                </select>
              </div>

              <div id="info-variacion" style="display:none; background:#eaf2f8; padding:12px 16px; border-radius:6px; border-left:4px solid #2980b9; margin-bottom:10px; font-size:13px;"></div>

              <div class="form__fila">
                <div class="form__campo"><label class="form__label">Fecha de Ingreso</label><input class="form__input" type="date" id="r-ingreso" required /></div>
                <div class="form__campo"><label class="form__label">Fecha de Salida</label><input class="form__input" type="date" id="r-salida" required /></div>
              </div>
              <div class="form__campo">
                <label class="form__label">Total de Ocupantes</label>
                <input class="form__input" type="number" id="r-personas" min="1" value="1" required />
              </div>
            </form>
          </div>
          <div class="modal__pie">
            <button type="button" class="btn" onclick="cerrarModal('modal-reserva')">Cancelar</button>
            <button type="button" class="btn btn--primario" onclick="Controllers.guardarReserva()">Confirmar Reserva</button>
          </div>
        </div>
      </div>`;
      
  } catch (e) { 
    document.getElementById("modales").innerHTML = ''; 
    console.error("Error al abrir modal reserva:", e);
    mostrarToast("Error de conexión al cargar el formulario.", "error"); 
  }
}

export function mostrarResumenHabitacion(idHabitacionStr) {
  const divInfo = document.getElementById("info-variacion");
  const inputPersonas = document.getElementById("r-personas");
  if (!idHabitacionStr) { divInfo.style.display = "none"; return; }

  const idHabitacion = parseInt(idHabitacionStr);
  const hab = window.cacheHabitaciones.find(h => h.idHabitacion === idHabitacion);
  const tipo = window.cacheTiposHabitacion.find(t => t.idTipo === hab.idTipo);

  if (tipo) {
    divInfo.innerHTML = `<strong>Características Base Asignadas:</strong><br><div style="display:flex; justify-content:space-between; margin-top:6px; color:var(--texto);"><span>🛏️ Tipo: <b>${tipo.nombreTipo}</b></span><span>👥 Capacidad: <b>Hasta ${tipo.capacidadMaxima} pers.</b></span><span>💰 Precio Ref.: <b>Bs. ${tipo.precioBase}</b></span></div>`;
    divInfo.style.display = "block";
    inputPersonas.max = tipo.capacidadMaxima;
    if (parseInt(inputPersonas.value) > tipo.capacidadMaxima) inputPersonas.value = tipo.capacidadMaxima;
  }
}

export async function guardarReserva() {
  const idHuespedTitular = parseInt(document.getElementById("r-huesped").value);
  const idHabitacion = parseInt(document.getElementById("r-habitacion").value);
  const fechaIngreso = document.getElementById("r-ingreso").value;
  const fechaSalida = document.getElementById("r-salida").value;
  const cantidadPersonas = parseInt(document.getElementById("r-personas").value);

  if (!idHuespedTitular || !idHabitacion || !fechaIngreso || !fechaSalida || !cantidadPersonas) {
    return mostrarToast("⚠️ Selecciona un huésped, una habitación y las fechas.", "error");
  }
  
  const dateIngreso = new Date(fechaIngreso), dateSalida = new Date(fechaSalida);
  if (dateSalida <= dateIngreso) {
    return mostrarToast("⚠️ La fecha de salida debe ser posterior al ingreso.", "error");
  }

  try {
    await API.post('Reservas', { idHuespedTitular, idHabitacion, fechaIngreso, fechaSalida, cantidadPersonas });
    cerrarModal("modal-reserva"); 
    window.navegarA("reservas"); 
    mostrarToast("¡Reserva creada con éxito!");
  } catch (error) {
    mostrarToast(`❌ ${error.message}`, "error");
  }
}