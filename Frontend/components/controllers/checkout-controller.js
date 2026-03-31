import { API } from '../../api/api.js';
import { mostrarToast, HORA_LIMITE_CHECKOUT } from '../../utils/helpers.js';
import { cerrarModal } from '../modal/modal.js';

export async function confirmarCheckin(idReserva) {
  const main = document.getElementById("main-content");
  main.innerHTML = `<div class="panel" style="padding: 40px; text-align: center;"><h2>⏳ Procesando Check-in en Supabase...</h2></div>`;
  try {
    const resultado = await API.post(`Reservas/${idReserva}/checkin`, {});
    main.innerHTML = `<div class="panel" style="border-left: 6px solid #2980b9; padding: 30px;"><h2 style="margin-bottom: 20px; color: #2980b9;">✅ Check-in Registrado Correctamente</h2><p><strong>Reserva #:</strong> ${resultado.reserva.idReserva}</p><p><strong>Nuevo Estado:</strong> En Curso</p><button class="btn btn--primario" onclick="navegarA('reservas')">Volver a Reservas</button></div>`;
  } catch (error) { mostrarToast(`❌ Error: ${error.message}`, "error"); window.navegarA('reservas'); }
}

export function abrirCheckout(id) {
  const ahora = new Date(); ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
  const valorHora = ahora.toISOString().slice(0, 16);
  document.getElementById("modales").innerHTML = `
    <div class="modal-fondo modal-fondo--visible" id="modal-checkout">
      <div class="modal">
        <div class="modal__header"><span class="modal__titulo">Check-out Reserva #${id}</span><button class="modal__cerrar" onclick="cerrarModal('modal-checkout')">✕</button></div>
        <div class="modal__cuerpo">
          <label class="form__label">Fecha y Hora de Salida Efectiva:</label>
          <input class="form__input" style="margin-top: 8px;" type="datetime-local" id="fechaCheckout" value="${valorHora}" onchange="Controllers.evaluarLateCheckout(this.value)" />
          <div id="aviso-late" class="form__nota" style="display:none; margin-top:12px; border-color:#e74c3c; background:#fdf0ef; color:#c0392b;"><strong>⚠ Atención:</strong> Salida tardía detectada. El servidor calculará el recargo correspondiente.</div>
        </div>
        <div class="modal__pie"><button class="btn" onclick="cerrarModal('modal-checkout')">Cancelar</button><button class="btn btn--peligro" onclick="Controllers.confirmarCheckout(${id})">Confirmar Salida</button></div>
      </div>
    </div>`;
  window.Controllers.evaluarLateCheckout(valorHora);
}

export function evaluarLateCheckout(valor) {
  const hora = new Date(valor).getHours();
  document.getElementById("aviso-late").style.display = hora >= HORA_LIMITE_CHECKOUT ? "block" : "none";
}

export async function confirmarCheckout(idReserva) {
  const fechaSalida = document.getElementById('fechaCheckout').value; cerrarModal("modal-checkout");
  const main = document.getElementById("main-content");
  main.innerHTML = `<div class="panel" style="padding: 40px; text-align: center;"><h2>⏳ Procesando Check-out...</h2></div>`;
  try {
    const resultado = await API.post(`Reservas/${idReserva}/checkout`, fechaSalida);
    const recargo = resultado.reserva.montoLateCheckout;
    main.innerHTML = `<div class="panel" style="border-left: 6px solid #27ae60; padding: 30px;"><h2 style="margin-bottom: 20px;">✅ Check-out Registrado con Éxito</h2><p><strong>Reserva #:</strong> ${resultado.reserva.idReserva}</p><p><strong>Estado:</strong> Finalizada</p><div style="background: ${recargo > 0 ? '#fdf0ef' : '#f0fbf4'}; border: 1px solid ${recargo > 0 ? '#e74c3c' : '#27ae60'}; padding: 15px; border-radius: 8px; margin-bottom: 25px;"><h3 style="color: ${recargo > 0 ? '#c0392b' : '#27ae60'}; margin: 0;">${recargo > 0 ? `⚠️ Se aplicó un recargo por Late Check-out de: <strong>Bs. ${recargo}</strong>` : 'Salida a tiempo. Sin recargos.'}</h3></div><button class="btn btn--primario" onclick="navegarA('reservas')">Volver a Reservas</button></div>`;
  } catch (error) { mostrarToast(error.message, "error"); window.navegarA('reservas'); }
}