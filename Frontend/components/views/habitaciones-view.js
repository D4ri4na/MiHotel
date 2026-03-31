import { API } from '../../api/api.js';
import { badgeEstado } from '../../utils/helpers.js';

export async function getHabitacionesView() {
  const [habitaciones, tiposHabitacion] = await Promise.all([
    API.get('Habitaciones'), API.get('Habitaciones/Tipos')
  ]);
  
  const cabecera = `<div class="panel__barra"><div class="panel__barra-izq"><h2 style="font-size: 16px; font-weight: 600; margin:0; color: var(--texto);">Estado Actual de Habitaciones</h2></div></div>`;
  if (habitaciones.length === 0) return `<div class="panel">${cabecera}<div class="tabla__celda--vacio">No se encontraron habitaciones configuradas.</div></div>`;

  const filas = habitaciones.map(h => {
    const tipo = tiposHabitacion.find(t => t.idTipo === h.idTipo) || { nombreTipo: "Básica", capacidadMaxima: 0, precioBase: 0 };
    return `<tr class="tabla__fila"><td style="font-size: 16px; font-weight: 700;">Hab. ${h.idHabitacion}</td><td style="color: var(--texto); font-weight: 600;">${tipo.nombreTipo}<br><span style="font-size:11px; color:var(--suave); font-weight:normal;">Capacidad: ${tipo.capacidadMaxima} | Precio: Bs. ${tipo.precioBase}</span></td><td>${badgeEstado(h.estado)}</td></tr>`;
  }).join("");
  
  return `
    <div class="panel">
      ${cabecera}
      <div style="width: 100%; overflow-x: auto;">
        <div style="min-width: 600px; padding-bottom: 2px;">
          <table class="tabla" style="width: 100%; border-collapse: collapse;">
            <thead class="tabla__encabezado"><tr><th>N° Habitación</th><th>Variación de Habitación</th><th>Estado Actual</th></tr></thead>
            <tbody>${filas}</tbody>
          </table>
        </div>
      </div>
    </div>`;
}