export const SESION_ACTUAL = { nombre: "Dariana Pol Aramayo", rol: "Recepcionista", iniciales: "DP" };
export const HORA_LIMITE_CHECKOUT = 12;

export function fmtFecha(str) { 
  if (!str) return "—";
  const d = new Date(str);
  d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
  return d.toLocaleDateString("es-BO", { day: '2-digit', month: 'short', year: 'numeric' }); 
}

export function badgeEstado(estado) {
  const e = estado ? estado.toLowerCase() : '';
  if (e.includes('pendiente')) return `<span class="badge badge--pendiente">Pendiente</span>`;
  if (e.includes('curso') || e.includes('ocupada')) return `<span class="badge badge--en-curso">${estado}</span>`;
  if (e.includes('finalizada') || e.includes('mantenimiento')) return `<span class="badge badge--finalizado">${estado}</span>`;
  if (e.includes('cancelada')) return `<span class="badge badge--cancelado">${estado}</span>`;
  if (e.includes('disponible')) return `<span class="badge badge--en-curso" style="background: #27ae60;">Disponible</span>`;
  return `<span class="badge badge--pendiente">${estado || '—'}</span>`;
}

export function avatarHTML(nombre) { 
  const inicial = nombre ? nombre.charAt(0).toUpperCase() : '?';
  const colores = ['#2980b9', '#e74c3c', '#8e44ad', '#16a085', '#d35400', '#2c3e50'];
  const color = colores[inicial.charCodeAt(0) % colores.length] || '#2980b9';
  return `<div class="tabla__avatar" style="background:${color}">${inicial}</div>`; 
}

export function mostrarToast(msg, tipo = "ok") {
  const t = document.getElementById("toast");
  t.textContent = msg; 
  t.className = `toast toast--${tipo} toast--visible`;
  setTimeout(() => t.classList.remove("toast--visible"), 3200);
}