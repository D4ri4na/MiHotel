// ==========================================
// 1. CONFIGURACIÓN Y API (Conexión al Backend)
// ==========================================
const API_URL = "http://localhost:5036/api"; // Asegúrate de que este puerto sea el correcto
const HORA_LIMITE_CHECKOUT = 12;

// Datos estáticos de sesión (ya que aún no hay login)
const SESION_ACTUAL = {
  nombre: "Dariana Pol Aramayo",
  rol: "Recepcionista",
  iniciales: "DP",
};

// Cliente HTTP para comunicarnos con C#
const API = {
  async get(endpoint) {
    try {
      const res = await fetch(`${API_URL}/${endpoint}`);
      if (!res.ok) throw new Error(`Error al obtener ${endpoint}`);
      return await res.json();
    } catch (e) {
      console.error(e);
      return []; // Devuelve un array vacío si falla para no romper la vista
    }
  },
  
  async post(endpoint, data) {
    const res = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Error en la operación`);
    }
    return await res.json();
  }
};

// ==========================================
// 2. UTILIDADES
// ==========================================
function fmtFecha(str) { return str ? new Date(str).toLocaleDateString("es-BO", { hour: '2-digit', minute:'2-digit' }) : "—"; }
function badgeEstado(estado) {
  const mapa = { Pendiente: "badge--pendiente", EnCurso: "badge--en-curso", Finalizada: "badge--finalizado", Cancelada: "badge--cancelado" };
  return `<span class="badge ${mapa[estado] || 'badge--pendiente'}">${estado || 'Pendiente'}</span>`;
}
function avatarHTML(nombre) { 
  const inicial = nombre ? nombre.charAt(0).toUpperCase() : '?';
  return `<div class="tabla__avatar" style="background:#2980b9">${inicial}</div>`; 
}
function mostrarToast(msg, tipo = "ok") {
  const t = document.getElementById("toast");
  t.textContent = msg; 
  t.className = `toast toast--${tipo} toast--visible`;
  setTimeout(() => t.classList.remove("toast--visible"), 3200);
}

// ==========================================
// 3. VISTAS ASÍNCRONAS (Consumen la API)
// ==========================================
const VISTAS = {
  registro: async () => `
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

  reservas: async () => {
    // Traemos datos en paralelo para armar la tabla cruzada
    const [reservas, huespedes, habitaciones] = await Promise.all([
      API.get('Reservas'), API.get('Huespedes'), API.get('Habitaciones')
    ]);

    if (reservas.length === 0) return `<div class="panel"><h3>No hay reservas registradas o el servidor está apagado.</h3></div>`;

    const filas = reservas.map(r => {
      // Cruzamos los datos con los IDs
      const h = huespedes.find(x => x.idHuesped === r.idHuespedTitular) || { nombre: "Desconocido", apellido: "" };
      const hab = habitaciones.find(x => x.idHabitacion === r.idHabitacion) || { idHabitacion: "?" };
      
      const nombreCompleto = `${h.nombre} ${h.apellido}`;

      return `
        <tr class="tabla__fila">
          <td>#${r.idReserva}</td>
          <td><div class="tabla__nombre-cel">${avatarHTML(h.nombre)} ${nombreCompleto}</div></td>
          <td>Hab. ${hab.idHabitacion}</td>
          <td>${fmtFecha(r.fechaIngreso)}</td>
          <td>${fmtFecha(r.fechaSalida)}</td>
          <td>${badgeEstado(r.estado)}</td>
          <td>
            ${r.estado === 'EnCurso' ? `<button class="btn btn--sm btn--peligro" onclick="Controllers.abrirCheckout(${r.idReserva})">Check-out</button>` : '—'}
          </td>
        </tr>`;
    }).join("");
    return `<div class="panel"><table class="tabla"><thead><tr><th>#</th><th>Huésped</th><th>Habitación</th><th>Ingreso</th><th>Salida</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${filas}</tbody></table></div>`;
  },

  huespedes: async () => {
    const huespedes = await API.get('Huespedes');
    if (huespedes.length === 0) return `<div class="panel"><p>No hay huéspedes registrados.</p></div>`;

    const filas = huespedes.map(h => `<tr><td>${h.nombre} ${h.apellido}</td><td>${h.ci}</td><td>${h.correoElectronico || '-'}</td><td><button class="btn btn--sm" onclick="alert('Funcionalidad en desarrollo')">🗑</button></td></tr>`).join("");
    return `<div class="panel"><table class="tabla"><thead><tr><th>Nombre</th><th>CI</th><th>Email</th><th>Acciones</th></tr></thead><tbody>${filas}</tbody></table></div>`;
  },
  
  habitaciones: async () => {
    const habitaciones = await API.get('Habitaciones');
    const filas = habitaciones.map(h => `
      <tr>
        <td>Hab. ${h.idHabitacion}</td>
        <td>Tipo ${h.idTipo}</td>
        <td>${h.estado}</td>
        <td>${h.estado === 'Disponible' ? '✅' : '❌'}</td>
      </tr>
    `).join("");
    return `<div class="panel"><h1>Estado de Habitaciones</h1><table class="tabla"><thead><tr><th>Número</th><th>Tipo</th><th>Estado</th><th>Disponibilidad</th></tr></thead><tbody>${filas}</tbody></table></div>`;
  },

  servicios: async () => {
    return `<div class="panel"><h3>Servicios (Requiere crear endpoint en C#)</h3></div>`;
  }
};

// ==========================================
// 4. CONTROLADORES (Lógica de UI y Peticiones)
// ==========================================
const Controllers = {
  abrirModalHuesped() {
    document.getElementById("modales").innerHTML = `
      <div class="modal-fondo modal-fondo--visible" id="modal-huesped">
        <div class="modal">
          <div class="modal__header"><span>Registrar Huésped</span><button onclick="cerrarModal('modal-huesped')">✕</button></div>
          <div class="modal__cuerpo">
            <form class="form" id="form-huesped">
              <input class="form__input" type="text" id="h-nombre" placeholder="Nombre" required />
              <input class="form__input" type="text" id="h-apellido" placeholder="Apellido" required />
              <input class="form__input" type="text" id="h-ci" placeholder="Carnet de Identidad (CI)" required />
              <input class="form__input" type="text" id="h-telefono" placeholder="Número de Teléfono" requiered />
              <input class= "form__input" type="text" id="h-correoElectronico" placeholder="Correo Electronico" />
            </form>
          </div>
          <div class="modal__pie"><button class="btn btn--primario" onclick="Controllers.guardarHuesped()">Registrar</button></div>
        </div>
      </div>`;
  },

  async guardarHuesped() {
    const nombre = document.getElementById("h-nombre").value.trim();
    const apellido = document.getElementById("h-apellido").value.trim();
    const ci = document.getElementById("h-ci").value.trim();
    const telefono = document.getElementById("h-telefono").value.trim();
    const correoElectronico = document.getElementById(h-correoElectronico).value.trim();

    if (!nombre || !apellido || !ci || !telefono ) return mostrarToast("Completa los campos requeridos", "error");

    try {
      // Envía el POST real a C#
      await API.post('Huespedes', { nombre, apellido, ci, telefono, correoElectronico });
      cerrarModal("modal-huesped"); 
      navegarA("huespedes"); 
      mostrarToast("¡Huésped guardado en Supabase!");
    } catch (error) {
      mostrarToast(error.message, "error");
    }
  },

  abrirModalReserva() {
    mostrarToast("Formulario de reserva en construcción...", "ok");
  },

  abrirCheckout(id) {
    // Formateamos la hora actual para el input datetime-local
    const ahora = new Date();
    ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
    const valorHora = ahora.toISOString().slice(0, 16);

    document.getElementById("modales").innerHTML = `
      <div class="modal-fondo modal-fondo--visible" id="modal-checkout">
        <div class="modal">
          <div class="modal__header"><span>Check-out Reserva #${id}</span></div>
          <div class="modal__cuerpo">
            <label>Fecha y Hora de Salida Efectiva:</label>
            <input class="form__input" type="datetime-local" id="fechaCheckout" value="${valorHora}" onchange="Controllers.evaluarLateCheckout(this.value)" />
            <div id="aviso-late" class="form__nota" style="display:none; margin-top:10px; color:red;">⚠ Salida tardía detectada. El servidor calculará el recargo.</div>
          </div>
          <div class="modal__pie">
            <button class="btn" onclick="cerrarModal('modal-checkout')">Cancelar</button>
            <button class="btn btn--peligro" onclick="Controllers.confirmarCheckout(${id})">Confirmar Salida</button>
          </div>
        </div>
      </div>`;
      
      this.evaluarLateCheckout(valorHora);
  },

  evaluarLateCheckout(valor) {
    const hora = new Date(valor).getHours();
    document.getElementById("aviso-late").style.display = hora >= HORA_LIMITE_CHECKOUT ? "block" : "none";
  },

  async confirmarCheckout(idReserva) {
    const fechaSalida = document.getElementById('fechaCheckout').value;
    cerrarModal("modal-checkout");
    
    // Mostramos un loader mientras C# procesa
    const main = document.getElementById("main-content");
    main.innerHTML = `<div class="panel"><h2>⏳ Procesando Check-out en Supabase...</h2></div>`;

    try {
      const resultado = await API.post(`Reservas/${idReserva}/checkout`, fechaSalida);
      
      const recargo = resultado.reserva.montoLateCheckout;
      main.innerHTML = `
        <div class="panel" style="border-left: 5px solid #27ae60;">
          <h2>✅ Check-out Registrado con Éxito</h2>
          <p><strong>Reserva #:</strong> ${resultado.reserva.idReserva}</p>
          <p><strong>Estado:</strong> Finalizada</p>
          <h3 style="color: ${recargo > 0 ? '#e74c3c' : '#27ae60'};">
            ${recargo > 0 ? `⚠️ Recargo por Late Check-out aplicado: Bs. ${recargo}` : 'Salida a tiempo. Sin recargos adicionales.'}
          </h3>
          <br>
          <button class="btn btn--primario" onclick="navegarA('reservas')">Volver a Reservas</button>
        </div>
      `;
    } catch (error) {
      mostrarToast(error.message, "error");
      navegarA('reservas'); // Si falla, recargamos la tabla
    }
  }
};

// ==========================================
// 5. NAVEGACIÓN Y ARRANQUE
// ==========================================
async function navegarA(seccion) {
  const main = document.getElementById("main-content");
  if (!main) return;
  
  // Estado de carga visual
  main.innerHTML = `<div class="panel"><p>⏳ Cargando datos...</p></div>`;
  
  if (VISTAS[seccion]) {
    main.innerHTML = await VISTAS[seccion](); // Espera a que la promesa (fetch) termine
  }
  
  document.querySelectorAll("[data-seccion]").forEach(el => 
    el.classList.toggle("sidebar__item--activo", el.dataset.seccion === seccion)
  );
}

function cerrarModal(id) { document.getElementById(id)?.remove(); }

// Variables globales para el HTML
window.navegarA = navegarA;
window.Controllers = Controllers;
window.cerrarModal = cerrarModal;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("sidebar-nombre").textContent = SESION_ACTUAL.nombre;
  document.getElementById("sidebar-rol").textContent = SESION_ACTUAL.rol;
  document.getElementById("sidebar-iniciales").textContent = SESION_ACTUAL.iniciales;
  
  document.querySelectorAll("[data-seccion]").forEach(el => 
    el.addEventListener("click", () => navegarA(el.dataset.seccion))
  );
  
  navegarA("registro");
});