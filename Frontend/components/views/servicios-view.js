import { API } from '../../api/api.js';

export async function getServiciosView() {
  const servicios = await API.get('Servicios');
  const cabecera = `<div class="panel__barra"><div class="panel__barra-izq"><h2 style="font-size: 16px; font-weight: 600; margin:0; color: var(--texto);">Directorio de Servicios Internos</h2></div></div>`;

  if (!servicios || servicios.length === 0) {
    return `<div class="panel">${cabecera}<div class="tabla__celda--vacio">Actualmente no hay contactos de servicios disponibles en el sistema.</div></div>`;
  }

  const filas = servicios.map(s => `
    <tr class="tabla__fila">
      <td style="font-size: 15px; font-weight: 600; color: var(--texto);">🛠️ ${s.nombreServicio}</td>
      <td style="color: var(--suave); font-weight: 500;">👤 ${s.encargado}</td>
      <td style="font-family: monospace; font-size: 14px; font-weight: 600; color: #2980b9;">📞 ${s.telefono}</td>
    </tr>
  `).join("");
  
  return `
    <div class="panel">
      ${cabecera}
      <div style="width: 100%; overflow-x: auto;">
        <div style="min-width: 700px; padding-bottom: 2px;">
          <table class="tabla" style="width: 100%; border-collapse: collapse;">
            <thead class="tabla__encabezado">
              <tr><th>Área / Servicio</th><th>Encargado Responsable</th><th>Teléfono / Interno</th></tr>
            </thead>
            <tbody>${filas}</tbody>
          </table>
        </div>
      </div>
    </div>`;
}