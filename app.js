const MOCK = {
  recepcionista: {
    nombre: "Dariana Pol Aramayo",
    rol:    "Recepcionista",
    iniciales: "DP",
  },

  habitaciones: [
    { id: 1, numero: "101", tipo: "SIMPLE",  piso: 1, precio: 450,  capacidad: 1, descripcion: "Vista al jardín",  disponible: true  },
    { id: 2, numero: "102", tipo: "SIMPLE",  piso: 1, precio: 450,  capacidad: 1, descripcion: "Vista a la calle", disponible: false },
    { id: 3, numero: "201", tipo: "DOBLE",   piso: 2, precio: 720,  capacidad: 2, descripcion: "Vista al patio",   disponible: true  },
    { id: 4, numero: "202", tipo: "DOBLE",   piso: 2, precio: 720,  capacidad: 2, descripcion: "Vista al jardín",  disponible: false },
    { id: 5, numero: "301", tipo: "SUITE",   piso: 3, precio: 1400, capacidad: 4, descripcion: "Suite presidencial", disponible: true },
    { id: 6, numero: "302", tipo: "SUITE",   piso: 3, precio: 1200, capacidad: 3, descripcion: "Suite junior",     disponible: true  },
  ],

  huespedes: [
    { id: 1, nombre: "María García", dni: "32145678", email: "maria@mail.com", telefono: "3511234567", iniciales: "MG", color: "#e74c3c" },
    { id: 2, nombre: "Carlos López", dni: "28901234", email: "carlos@mail.com", telefono: "3519876543", iniciales: "CL", color: "#2980b9" },
  ],

  reservas: [
    { id: 1, huespedId: 1, habitacionId: 2, fechaIngreso: "2026-03-20", fechaSalida: "2026-03-25", estado: "EN_CURSO", fechaCheckin: "2026-03-20T14:30", fechaCheckout: null, cargoLate: null },
  ],

  servicios: [
    { id: 1, area: "Recepción", encargado: "Sandra Ruiz", telefono: "351-100-0001", interno: "100" },
    { id: 2, area: "Mantenimiento", encargado: "Diego Torres", telefono: "351-100-0003", interno: "102" },
  ],

  HORA_LIMITE_CHECKOUT: 12,
};

function fmtFecha(str) { return str ? new Date(str).toLocaleDateString("es-BO") : "—"; }
function getHuesped(id) { return MOCK.huespedes.find(h => h.id === id) || {}; }
function getHabitacion(id) { return MOCK.habitaciones.find(h => h.id === id) || {}; }
function badgeEstado(estado) {
  const mapa = { PENDIENTE: "badge--pendiente", EN_CURSO: "badge--en-curso", FINALIZADO: "badge--finalizado", CANCELADO: "badge--cancelado" };
  return `<span class="badge ${mapa[estado]}">${estado}</span>`;
}
function avatarHTML(iniciales, color) { return `<div class="tabla__avatar" style="background:${color}">${iniciales}</div>`; }
function mostrarToast(msg, tipo = "ok") {
  const t = document.getElementById("toast");
  t.textContent = msg; t.className = `toast toast--${tipo} toast--visible`;
  setTimeout(() => t.classList.remove("toast--visible"), 3200);
}

const VISTAS = {
  registro: () => `
    <div class="pagina-header">
      <h1 class="pagina-header__titulo">Centro de Registros</h1>
    </div>
    <div class="columnas-registro">
      <div class="tarjeta-registro">
        <div class="tarjeta-registro__icono">👤</div>
        <h3>Gestión de Huéspedes</h3>
        <p>Registra nuevos clientes para habilitar sus reservas.</p>
        <button class="btn btn--primario" onclick="Controllers.abrirModalHuesped()">+ Nuevo Huésped</button>
      </div>
      <div class="tarjeta-registro">
        <div class="tarjeta-registro__icono">📅</div>
        <h3>Nueva Reserva</h3>
        <p>Asigna habitaciones y fechas de estadía para organizar la agenda.</p>
        <button class="btn btn--primario" onclick="Controllers.abrirModalReserva()">Crear Reserva</button>
      </div>
      <div class="tarjeta-registro">
        <div class="tarjeta-registro__icono">🔑</div>
        <h3>Check-in / Out</h3>
        <p>Controla el ingreso y salida efectiva de los huéspedes.</p>
        <button class="btn btn--peligro" onclick="navegarA('reservas')">Ir a Control</button>
      </div>
    </div>
  `,

  reservas: () => {
    const filas = MOCK.reservas.map(r => {
      const h = getHuesped(r.huespedId);
      const hab = getHabitacion(r.habitacionId);
      return `
        <tr class="tabla__fila">
          <td>#${r.id}</td>
          <td><div class="tabla__nombre-cel">${avatarHTML(h.iniciales, h.color)} ${h.nombre}</div></td>
          <td>${hab.numero} (${hab.tipo})</td>
          <td>${fmtFecha(r.fechaIngreso)}</td>
          <td>${fmtFecha(r.fechaSalida)}</td>
          <td>${badgeEstado(r.estado)}</td>
          <td>
            ${r.estado === 'EN_CURSO' ? `<button class="btn btn--sm btn--peligro" onclick="Controllers.abrirCheckout(${r.id})">Check-out</button>` : ''}
          </td>
        </tr>`;
    }).join("");
    return `<div class="panel"><table class="tabla"><thead><tr><th>#</th><th>Huésped</th><th>Hab.</th><th>Ingreso</th><th>Salida</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${filas}</tbody></table></div>`;
  },

  huespedes: () => {
    const filas = MOCK.huespedes.map(h => `<tr><td>${h.nombre}</td><td>${h.dni}</td><td>${h.email}</td><td><button class="btn btn--sm" onclick="Controllers.eliminarHuesped(${h.id})">🗑</button></td></tr>`).join("");
    return `<div class="panel"><table class="tabla"><thead><tr><th>Nombre</th><th>DNI</th><th>Email</th><th>Acciones</th></tr></thead><tbody>${filas}</tbody></table></div>`;
  },
  
  habitaciones: () => {
    const filas = MOCK.habitaciones.map(h => `
      <tr>
        <td>${h.numero}</td>
        <td>${h.tipo}</td>
        <td>${h.piso}</td>
        <td>${h.capacidad}</td>
        <td>${h.precio}</td>
        <td>${h.descripcion}</td>
        <td>${h.disponible ? '✅' : '❌'}</td>
      </tr>
    `).join("");
    return `
      <div class="panel">
        <h1>Habitaciones</h1>
        <table class="tabla">
          <thead>
            <tr>
              <th>Número</th>
              <th>Tipo</th>
              <th>Piso</th>
              <th>Capacidad</th>
              <th>Precio</th>
              <th>Descripción</th>
              <th>Disponible</th>
            </tr>
          </thead>
          <tbody>
            ${filas}
          </tbody>
        </table>
      </div>
    `;
  },
  servicios: () => {
    const filas = MOCK.servicios.map(s => `<tr><td>${s.area}</td><td>${s.encargado}</td><td>${s.telefono}</td></tr>`).join("");
    return `<div class="panel"><table class="tabla"><thead><tr><th>Área</th><th>Encargado</th><th>Teléfono</th></tr></thead><tbody>${filas}</tbody></table></div>`;
  }
};

// --- CONTROLLERS ---
const Controllers = {
  abrirModalHuesped() {
    document.getElementById("modales").innerHTML = `
      <div class="modal-fondo modal-fondo--visible" id="modal-huesped">
        <div class="modal">
          <div class="modal__header"><span>Registrar Huésped</span><button onclick="cerrarModal('modal-huesped')">✕</button></div>
          <div class="modal__cuerpo">
            <form class="form" id="form-huesped">
              <input class="form__input" type="text" name="nombre" placeholder="Nombre completo" required />
              <input class="form__input" type="text" name="dni" placeholder="DNI" required />
            </form>
          </div>
          <div class="modal__pie"><button class="btn btn--primario" onclick="Controllers.guardarHuesped()">Guardar</button></div>
        </div>
      </div>`;
  },

  guardarHuesped() {
    const fd = new FormData(document.getElementById("form-huesped"));
    const nombre = fd.get("nombre").trim();
    const dni = fd.get("dni").trim();
    if (!nombre || !dni) return mostrarToast("Completa los campos", "error");
    if (MOCK.huespedes.some(h => h.dni === dni)) return mostrarToast("Error: DNI duplicado", "error");
    MOCK.huespedes.push({ id: Date.now(), nombre, dni, iniciales: nombre[0].toUpperCase(), color: "#2980b9" });
    cerrarModal("modal-huesped"); navegarA("huespedes"); mostrarToast("Huésped registrado");
  },

  abrirModalReserva() {
    mostrarToast("Abriendo formulario de reserva...");
  },

  abrirCheckout(id) {
    const ahora = new Date().toISOString().slice(0, 16);
    document.getElementById("modales").innerHTML = `
      <div class="modal-fondo modal-fondo--visible" id="modal-checkout">
        <div class="modal">
          <div class="modal__header"><span>Check-out Reserva #${id}</span></div>
          <div class="modal__cuerpo">
            <input class="form__input" type="datetime-local" id="fechaCheckout" value="${ahora}" onchange="Controllers.evaluarLateCheckout(this.value)" />
            <div id="aviso-late" class="form__nota" style="display:none; margin-top:10px">⚠ Salida tardía: se aplicará cargo extra</div>
          </div>
          <div class="modal__pie">
            <button class="btn" onclick="cerrarModal('modal-checkout')">Cancelar</button>
            <button class="btn btn--peligro" onclick="Controllers.confirmarCheckout(${id})">Confirmar Salida</button>
          </div>
        </div>
      </div>`;
  },

  evaluarLateCheckout(valor) {
    const hora = new Date(valor).getHours();
    document.getElementById("aviso-late").style.display = hora >= MOCK.HORA_LIMITE_CHECKOUT ? "block" : "none";
  },

  confirmarCheckout(id) {
    const r = MOCK.reservas.find(x => x.id === id);
    r.estado = "FINALIZADO";
    cerrarModal("modal-checkout"); navegarA("reservas"); mostrarToast("Salida registrada");
  }
};

function navegarA(seccion) {
  const main = document.getElementById("main-content");
  main.innerHTML = VISTAS[seccion] ? VISTAS[seccion]() : "";
  document.querySelectorAll("[data-seccion]").forEach(el => el.classList.toggle("sidebar__item--activo", el.dataset.seccion === seccion));
}

function cerrarModal(id) { document.getElementById(id)?.remove(); }

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("sidebar-nombre").textContent = MOCK.recepcionista.nombre;
  document.getElementById("sidebar-rol").textContent = MOCK.recepcionista.rol;
  document.getElementById("sidebar-iniciales").textContent = MOCK.recepcionista.iniciales;
  document.querySelectorAll("[data-seccion]").forEach(el => el.addEventListener("click", () => navegarA(el.dataset.seccion)));
  document.querySelectorAll("[data-submenu]").forEach(el => el.addEventListener("click", () => document.getElementById(el.dataset.submenu).classList.toggle("sidebar__submenu--visible")));
  navegarA("registro");
});