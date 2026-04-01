import { API } from '../../api/api.js';
import { avatarHTML } from '../../utils/helpers.js';

export async function getHuespedesView() {
  // Solo necesitamos la lista de huéspedes
  const huespedes = await API.get('Huespedes');

  const cabecera = `<div class="panel__barra"><div class="panel__barra-izq"><h2 style="font-size: 16px; font-weight: 600; margin:0; color: var(--texto);">Directorio de Huéspedes Registrados</h2></div></div>`;

  if (!huespedes || huespedes.length === 0) {
    return `<div class="panel">${cabecera}<div class="tabla__celda--vacio">No hay huéspedes registrados en el sistema.</div></div>`;
  }

  const filas = huespedes.map(h => `
    <tr class="tabla__fila">
      <td><div class="tabla__nombre-cel">${avatarHTML(h.nombre)} <span style="font-weight: 600;">${h.nombre} ${h.apellido}</span></div></td>
      <td style="font-family: monospace; font-weight: 600; color: var(--suave);">${h.ci}</td>
      <td>${h.telefono || '—'}</td>
      <td>${h.correoElectronico || '—'}</td>
    </tr>
  `).join("");
  
  return `
    <div class="panel">
      ${cabecera}
      <div style="width: 100%; overflow-x: auto;">
        <table class="tabla">
          <thead class="tabla__encabezado">
            <tr><th>Nombre Completo</th><th>Documento (CI)</th><th>Teléfono</th><th>Correo Electrónico</th></tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>
      </div>
    </div>`;
}

