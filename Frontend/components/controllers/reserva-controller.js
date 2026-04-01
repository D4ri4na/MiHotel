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
export async function mostrarCheckOutHabitaciones() {
  try {
    const habitaciones = await API.get('Habitaciones');
    const tipos = await API.get('Habitaciones/Tipos');
    const reservas = await API.get('Reservas');

    const mapaTipos = {};
    if (tipos) {
      tipos.forEach(t => {
        mapaTipos[t.idTipo] = t.nombreTipo || t.nombre; 
      });
    }

    const conteoCheckouts = {};
    if (reservas) {
      reservas.forEach(r => {
        if (r.estado === 'Finalizada') { 
          conteoCheckouts[r.idHabitacion] = (conteoCheckouts[r.idHabitacion] || 0) + 1;
        }
      });
    }

    const filas = (habitaciones || []).map(hab => {
      const totalCheckouts = conteoCheckouts[hab.idHabitacion] || 0;
      const nombreTipo = mapaTipos[hab.idTipo] || 'Estándar';

      return `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 10px 0;">
            <strong>Hab. ${hab.idHabitacion}</strong> 
            <span style="color:#7f8c8d; font-size:12px; margin-left: 5px;">(${nombreTipo})</span>
          </td>
          <td style="text-align:center; padding: 10px 0; color:${totalCheckouts > 0 ? '#000000' : '#aaa'}; font-weight: bold; font-size: 15px;">
            ${totalCheckouts}
          </td>
        </tr>
      `;
    }).join('');

    document.getElementById("modales").innerHTML = `
      <div style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;">
        <div style="background:#fff;padding:20px 25px 15px 25px;border-radius:10px;min-width:320px;max-width:95vw;box-shadow:0 5px 15px rgba(0,0,0,0.3); font-family: sans-serif;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
            <span style="font-weight:700;font-size:16px; color: #2c3e50;">Checkouts por Habitacion</span>
            <button onclick="document.getElementById('modales').innerHTML=''" style="background:none;border:none;font-size:20px;cursor:pointer; color: #7f8c8d;">✕</button>
          </div>
          <div style="max-height: 350px; overflow-y: auto;">
            <table style="width:100%;border-collapse:collapse;font-size:14px;text-align:left;">
              <thead style="background-color: #f8f9fa; position: sticky; top: 0;">
                <tr>
                  <th style="padding: 10px 5px; color: #34495e; border-bottom: 2px solid #ddd;">Habitación</th>
                  <th style="padding: 10px 5px; text-align:center; color: #34495e; border-bottom: 2px solid #ddd;">Total</th>
                </tr>
              </thead>
              <tbody>${filas}</tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error("Error al cargar las estadísticas:", error);
    alert("Ocurrió un error al calcular los check-outs.");
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