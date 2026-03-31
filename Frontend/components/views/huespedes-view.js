import { API } from '../../api/api.js';
import { fmtFecha, avatarHTML, badgeEstado } from '../../utils/helpers.js';

export async function getHuespedesView() {
  const [reservas, huespedes, habitaciones, tiposHabitacion] = await Promise.all([
    API.get('Reservas'), API.get('Huespedes'), API.get('Habitaciones'), API.get('Habitaciones/Tipos')
  ]);

  const reservasMostrables = reservas.filter(r => r.estado === 'Pendiente' || r.estado === 'EnCurso');
  reservasMostrables.sort((a, b) => new Date(a.fechaIngreso) - new Date(b.fechaIngreso));

  const cabecera = `<div class="panel__barra"><div class="panel__barra-izq"><h2 style="font-size: 16px; font-weight: 600; margin:0; color: var(--texto);">Control de Reservas y Estadías</h2></div></div>`;

  if (reservasMostrables.length === 0) return `<div class="panel">${cabecera}<div class="tabla__celda--vacio">No hay reservas activas o futuras registradas en este momento.</div></div>`;

  const filas = reservasMostrables.map(r => {
    const h = huespedes.find(x => x.idHuesped === r.idHuespedTitular) || { nombre: "Desconocido", apellido: "" };
    const hab = habitaciones.find(x => x.idHabitacion === r.idHabitacion) || { idHabitacion: "?", idTipo: 0 };
    const tipoHab = tiposHabitacion.find(t => t.idTipo === hab.idTipo) || { nombreTipo: "Básica" };
    const nombreCompleto = `${h.nombre} ${h.apellido}`;

    let botonesAccion = '<span style="color:#aaa;">—</span>';
    if (r.estado === 'Pendiente') botonesAccion = `<button class="btn btn--sm btn--primario" onclick="Controllers.confirmarCheckin(${r.idReserva})">Check-in</button>`;
    else if (r.estado === 'EnCurso') botonesAccion = `<button class="btn btn--sm btn--peligro" onclick="Controllers.abrirCheckout(${r.idReserva})">Check-out</button>`;

    return `
      <tr class="tabla__fila">
        <td style="font-weight: 600; color: var(--suave);">#${r.idReserva}</td>
        <td><div class="tabla__nombre-cel">${avatarHTML(h.nombre)} <span style="font-weight: 500;">${nombreCompleto}</span></div></td>
        <td>
          <div style="font-weight: 600; color: var(--texto);">Hab. ${hab.idHabitacion}</div>
          <div style="font-size: 11px; color: var(--suave); text-transform: uppercase;">${tipoHab.nombreTipo}</div>
        </td>
        <td>${fmtFecha(r.fechaIngreso)}</td>
        <td>${fmtFecha(r.fechaSalida)}</td>
        <td>${badgeEstado(r.estado)}</td>
        <td style="text-align: right; padding-right: 20px;">${botonesAccion}</td>
      </tr>`;
  }).join("");
  
  return `
    <div class="panel">
      ${cabecera}
      <div style="width: 100%; overflow-x: auto;">
        <div style="min-width: 950px; padding-bottom: 2px;">
          <table class="tabla" style="width: 100%; border-collapse: collapse;">
            <thead class="tabla__encabezado">
              <tr><th>Ref</th><th>Huésped Titular</th><th>Habitación (Variación)</th><th>Ingreso</th><th>Salida</th><th>Estado</th><th style="text-align: right; padding-right: 20px;">Acción</th></tr>
            </thead>
            <tbody>${filas}</tbody>
          </table>
        </div>
      </div>
    </div>`;
}