// ==========================================
// 1. CONFIGURACIÓN Y API (Conexión al Backend)
// ==========================================
const API_URL = "http://localhost:5036/api"; 
const HORA_LIMITE_CHECKOUT = 12;

const SESION_ACTUAL = { nombre: "Dariana Pol Aramayo", rol: "Recepcionista", iniciales: "DP" };

const API = {
  async get(endpoint) {
    try {
      const res = await fetch(`${API_URL}/${endpoint}`);
      if (!res.ok) throw new Error(`Error al obtener ${endpoint}`);
      return await res.json();
    } catch (e) { console.error(e); return []; }
  },
  
  async post(endpoint, data) {
    const res = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Error en la operación`);
    }
    return await res.json();
  }
};

// ==========================================
// 2. UTILIDADES VISUALES
// ==========================================
function fmtFecha(str) { 
  if (!str) return "—";
  const d = new Date(str);
  d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
  return d.toLocaleDateString("es-BO", { day: '2-digit', month: 'short', year: 'numeric' }); 
}

function badgeEstado(estado) {
  const e = estado ? estado.toLowerCase() : '';
  if (e.includes('pendiente')) return `<span class="badge badge--pendiente">Pendiente</span>`;
  if (e.includes('curso') || e.includes('ocupada')) return `<span class="badge badge--en-curso">${estado}</span>`;
  if (e.includes('finalizada') || e.includes('mantenimiento')) return `<span class="badge badge--finalizado">${estado}</span>`;
  if (e.includes('cancelada')) return `<span class="badge badge--cancelado">${estado}</span>`;
  if (e.includes('disponible')) return `<span class="badge badge--en-curso" style="background: #27ae60;">Disponible</span>`;
  return `<span class="badge badge--pendiente">${estado || '—'}</span>`;
}

function avatarHTML(nombre) { 
  const inicial = nombre ? nombre.charAt(0).toUpperCase() : '?';
  const colores = ['#2980b9', '#e74c3c', '#8e44ad', '#16a085', '#d35400', '#2c3e50'];
  const color = colores[inicial.charCodeAt(0) % colores.length] || '#2980b9';
  return `<div class="tabla__avatar" style="background:${color}">${inicial}</div>`; 
}

function mostrarToast(msg, tipo = "ok") {
  const t = document.getElementById("toast");
  t.textContent = msg; 
  t.className = `toast toast--${tipo} toast--visible`;
  setTimeout(() => t.classList.remove("toast--visible"), 3200);
}

// ==========================================
// 3. VISTAS ASÍNCRONAS
// ==========================================
const VISTAS = {
  registro: async () => `
    <div class="pagina-header"><h1 class="pagina-header__titulo">Centro de Operaciones</h1></div>
    <div class="columnas-registro">
      <div class="tarjeta-registro">
        <div class="tarjeta-registro__icono">👤</div><h3>Gestión de Huéspedes</h3>
        <p>Registra nuevos clientes para habilitar sus reservas de forma rápida.</p>
        <button class="btn btn--primario" onclick="Controllers.abrirModalHuesped()">+ Nuevo Huésped</button>
      </div>
      <div class="tarjeta-registro">
        <div class="tarjeta-registro__icono">📅</div><h3>Nueva Reserva</h3>
        <p>Asigna habitaciones y controla la disponibilidad en tiempo real.</p>
        <button class="btn btn--primario" onclick="Controllers.abrirModalReserva()">Crear Reserva</button>
      </div>
      <div class="tarjeta-registro">
        <div class="tarjeta-registro__icono">🔑</div><h3>Check-in / Out</h3>
        <p>Controla el ingreso y finaliza estadías calculando recargos automáticos.</p>
        <button class="btn btn--peligro" onclick="navegarA('reservas')">Ir a Control</button>
      </div>
    </div>`,

  reservas: async () => {
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
    
    // AQUÍ ESTÁ EL ARREGLO DE LOS BORDES: Un div con overflow, y ADENTRO otro div con min-width
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
  },

  huespedes: async () => { 
    const huespedes = await API.get('Huespedes');
    const cabecera = `<div class="panel__barra"><div class="panel__barra-izq"><h2 style="font-size: 16px; font-weight: 600; margin:0; color: var(--texto);">Directorio de Huéspedes</h2></div></div>`;
    if (huespedes.length === 0) return `<div class="panel">${cabecera}<div class="tabla__celda--vacio">Aún no hay huéspedes registrados.</div></div>`;
    
    const filas = huespedes.map(h => `<tr class="tabla__fila"><td><div class="tabla__nombre-cel">${avatarHTML(h.nombre)} <span style="font-weight: 500;">${h.nombre} ${h.apellido}</span></div></td><td style="font-family: monospace; font-size: 13px;">${h.ci}</td><td>${h.telefono || '—'}</td><td style="color: #555;">${h.correoElectronico || '—'}</td></tr>`).join("");
    
    return `
      <div class="panel">
        ${cabecera}
        <div style="width: 100%; overflow-x: auto;">
          <div style="min-width: 800px; padding-bottom: 2px;">
            <table class="tabla" style="width: 100%; border-collapse: collapse;">
              <thead class="tabla__encabezado"><tr><th>Nombre Completo</th><th>CI / Pasaporte</th><th>Teléfono</th><th>Correo Electrónico</th></tr></thead>
              <tbody>${filas}</tbody>
            </table>
          </div>
        </div>
      </div>`;
  },
  
  habitaciones: async () => {
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
  },

  servicios: async () => {
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
};

// ==========================================
// 4. CONTROLADORES
// ==========================================
const Controllers = {
  abrirModalHuesped() { 
    document.getElementById("modales").innerHTML = `<div class="modal-fondo modal-fondo--visible" id="modal-huesped"><div class="modal"><div class="modal__header"><span class="modal__titulo">Registrar Huésped</span><button class="modal__cerrar" onclick="cerrarModal('modal-huesped')">✕</button></div><div class="modal__cuerpo"><form class="form" id="form-huesped"><div class="form__fila"><div class="form__campo"><label class="form__label">Nombre*</label><input class="form__input" type="text" id="h-nombre" required /></div><div class="form__campo"><label class="form__label">Apellido*</label><input class="form__input" type="text" id="h-apellido" required /></div></div><div class="form__campo"><label class="form__label">Carnet de Identidad (CI)*</label><input class="form__input" type="text" id="h-ci" required /></div><div class="form__campo"><label class="form__label">Número de Teléfono*</label><input class="form__input" type="text" id="h-telefono" required /></div><div class="form__campo"><label class="form__label">Correo Electrónico</label><input class="form__input" type="email" id="h-correoElectronico" /></div></form></div><div class="modal__pie"><button class="btn" onclick="cerrarModal('modal-huesped')">Cancelar</button><button class="btn btn--primario" onclick="Controllers.guardarHuesped()">Guardar Huésped</button></div></div></div>`;
  },

  async guardarHuesped() { 
    const n = document.getElementById("h-nombre").value.trim(), a = document.getElementById("h-apellido").value.trim(), c = document.getElementById("h-ci").value.trim(), t = document.getElementById("h-telefono").value.trim(), e = document.getElementById("h-correoElectronico").value.trim();
    if (!n || !a || !c || !t) return mostrarToast("Completa los campos requeridos", "error");
    try { await API.post('Huespedes', { nombre: n, apellido: a, ci: c, telefono: t, correoElectronico: e }); cerrarModal("modal-huesped"); navegarA("huespedes"); mostrarToast("¡Huésped registrado exitosamente!"); } catch (error) { mostrarToast(error.message, "error"); }
  },

  async abrirModalReserva() {
    document.getElementById("modales").innerHTML = `<div class="modal-fondo modal-fondo--visible"><div class="modal" style="padding:30px; text-align:center;">⏳ Conectando con la base de datos...</div></div>`;

    try {
      const [huespedes, habitaciones, tiposHabitacion] = await Promise.all([
        API.get('Huespedes'), API.get('Habitaciones'), API.get('Habitaciones/Tipos')
      ]);

      window.cacheHabitaciones = habitaciones;
      window.cacheTiposHabitacion = tiposHabitacion;

      const opcionesHuespedes = huespedes.map(h => `<option value="${h.idHuesped}">${h.nombre} ${h.apellido} (CI: ${h.ci})</option>`).join('');
      
      const opcionesHabitaciones = habitaciones.map(h => {
        const tipo = tiposHabitacion.find(t => t.idTipo === h.idTipo) || { nombreTipo: "Básica" };
        return `<option value="${h.idHabitacion}">Habitación N° ${h.idHabitacion} - ${tipo.nombreTipo} (${h.estado})</option>`;
      }).join('');

      document.getElementById("modales").innerHTML = `
        <div class="modal-fondo modal-fondo--visible" id="modal-reserva">
          <div class="modal">
            <div class="modal__header"><span class="modal__titulo">Crear Nueva Reserva</span><button class="modal__cerrar" onclick="cerrarModal('modal-reserva')">✕</button></div>
            <div class="modal__cuerpo">
              <div id="reserva-error" style="display: none; background: #fdf0ef; color: #c0392b; padding: 12px; border-radius: 6px; margin-bottom: 15px; font-size: 13px; border: 1px solid #c0392b; font-weight: 500;"></div>
              
              <form class="form" id="form-reserva">
                <div class="form__campo">
                  <label class="form__label">Huésped Titular</label>
                  <select class="form__select" id="r-huesped" required><option value="">Seleccione un huésped...</option>${opcionesHuespedes}</select>
                </div>
                
                <div class="form__campo">
                  <label class="form__label">Variación de Habitación</label>
                  <select class="form__select" id="r-habitacion" onchange="Controllers.mostrarResumenHabitacion(this.value)" required>
                    <option value="">Seleccione una habitación...</option>${opcionesHabitaciones}
                  </select>
                </div>

                <div id="info-variacion" style="display:none; background:#eaf2f8; padding:12px 16px; border-radius:6px; border-left:4px solid #2980b9; margin-bottom:10px; font-size:13px;">
                </div>

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
            <div class="modal__pie"><button class="btn" onclick="cerrarModal('modal-reserva')">Cancelar</button><button class="btn btn--primario" onclick="Controllers.guardarReserva()">Confirmar Reserva</button></div>
          </div>
        </div>`;
    } catch (e) { cerrarModal("modal-reserva"); mostrarToast("Error al cargar formulario.", "error"); }
  },

  mostrarResumenHabitacion(idHabitacionStr) {
    const divInfo = document.getElementById("info-variacion");
    const inputPersonas = document.getElementById("r-personas");
    
    if (!idHabitacionStr) {
      divInfo.style.display = "none"; return;
    }

    const idHabitacion = parseInt(idHabitacionStr);
    const hab = window.cacheHabitaciones.find(h => h.idHabitacion === idHabitacion);
    const tipo = window.cacheTiposHabitacion.find(t => t.idTipo === hab.idTipo);

    if (tipo) {
      divInfo.innerHTML = `
        <strong>Características Base Asignadas:</strong><br>
        <div style="display:flex; justify-content:space-between; margin-top:6px; color:var(--texto);">
          <span>🛏️ Tipo: <b>${tipo.nombreTipo}</b></span>
          <span>👥 Capacidad: <b>Hasta ${tipo.capacidadMaxima} pers.</b></span>
          <span>💰 Precio Ref.: <b>Bs. ${tipo.precioBase}</b></span>
        </div>
      `;
      divInfo.style.display = "block";
      
      inputPersonas.max = tipo.capacidadMaxima;
      if (parseInt(inputPersonas.value) > tipo.capacidadMaxima) {
        inputPersonas.value = tipo.capacidadMaxima;
      }
    }
  },

  async guardarReserva() {
    const idHuespedTitular = parseInt(document.getElementById("r-huesped").value);
    const idHabitacion = parseInt(document.getElementById("r-habitacion").value);
    const fechaIngreso = document.getElementById("r-ingreso").value;
    const fechaSalida = document.getElementById("r-salida").value;
    const cantidadPersonas = parseInt(document.getElementById("r-personas").value);

    const cajaError = document.getElementById("reserva-error");
    cajaError.style.display = "none";

    if (!idHuespedTitular || !idHabitacion || !fechaIngreso || !fechaSalida || !cantidadPersonas) {
      cajaError.innerHTML = "⚠️ Selecciona un huésped, una variación de habitación y las fechas.";
      cajaError.style.display = "block"; return;
    }

    const dateIngreso = new Date(fechaIngreso), dateSalida = new Date(fechaSalida);
    if (dateSalida <= dateIngreso) {
      cajaError.innerHTML = "⚠️ Validación: La fecha de salida debe ser estrictamente posterior al ingreso.";
      cajaError.style.display = "block"; return; 
    }

    try {
      await API.post('Reservas', { idHuespedTitular, idHabitacion, fechaIngreso, fechaSalida, cantidadPersonas });
      cerrarModal("modal-reserva"); navegarA("reservas"); mostrarToast("¡Reserva creada con éxito!");
    } catch (error) {
      cajaError.innerHTML = `❌ <strong>Operación Rechazada por el Servidor:</strong><br>${error.message}`;
      cajaError.style.display = "block";
    }
  },

  // Nueva lógica de Check-in con mejor UI
  async confirmarCheckin(idReserva) {
    // 1. Buscamos la reserva en los datos cargados para mostrar un resumen
    const reservas = await API.get('Reservas');
    const r = reservas.find(res => res.idReserva === idReserva);
    const huespedes = await API.get('Huespedes');
    const h = huespedes.find(x => x.idHuesped === r.idHuespedTitular);

    // 2. Abrimos un modal de confirmación antes de procesar
    document.getElementById("modales").innerHTML = `
      <div class="modal-fondo modal-fondo--visible" id="modal-confirm-checkin">
        <div class="modal">
          <div class="modal__header">
            <span class="modal__titulo">Confirmar Inicio de Estadía</span>
            <button class="modal__cerrar" onclick="cerrarModal('modal-confirm-checkin')">✕</button>
          </div>
          <div class="modal__cuerpo">
            <p style="margin-bottom: 15px;">¿Confirmas el ingreso del huésped para la <strong>Reserva #${idReserva}</strong>?</p>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #2980b9;">
              <div style="font-size: 13px; color: #666;">HUÉSPED</div>
              <div style="font-weight: 600; margin-bottom: 10px;">${h.nombre} ${h.apellido}</div>
              <div style="font-size: 13px; color: #666;">HABITACIÓN ASIGNADA</div>
              <div style="font-weight: 600;">Habitación #${r.idHabitacion}</div>
            </div>
          </div>
          <div class="modal__pie">
            <button class="btn" onclick="cerrarModal('modal-confirm-checkin')">Cancelar</button>
            <button class="btn btn--primario" id="btn-proceder-checkin">Confirmar Ingreso</button>
          </div>
        </div>
      </div>`;

    document.getElementById("btn-proceder-checkin").onclick = async () => {
      cerrarModal('modal-confirm-checkin');
      const main = document.getElementById("main-content");
      main.innerHTML = `<div class="panel" style="padding: 40px; text-align: center; color: #666;"><h3>⏳ Registrando ingreso en el sistema...</h3></div>`;
      
      try {
        const resultado = await API.post(`Reservas/${idReserva}/checkin`, {});
        // Pantalla de éxito estilo "Voucher"
        main.innerHTML = `
          <div class="panel" style="max-width: 600px; margin: 0 auto; border-top: 5px solid #27ae60;">
            <div style="padding: 30px; text-align: center;">
              <div style="font-size: 50px; margin-bottom: 15px;">✅</div>
              <h2 style="color: #27ae60; margin-bottom: 10px;">Check-in Exitoso</h2>
              <p style="color: #666; margin-bottom: 25px;">La habitación #${r.idHabitacion} ahora está marcada como <strong>En Curso</strong>.</p>
              
              <div style="text-align: left; background: #fdfdfd; border: 1px dashed #ddd; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #888;">Reserva:</span> <span style="font-weight: 600;">#${idReserva}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #888;">Huésped:</span> <span style="font-weight: 600;">${h.nombre} ${h.apellido}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #888;">Hora de Ingreso:</span> <span style="font-weight: 600;">${new Date().toLocaleTimeString()}</span>
                </div>
              </div>
              
              <button class="btn btn--primario" onclick="navegarA('reservas')">Volver al Panel de Control</button>
            </div>
          </div>`;
      } catch (error) {
        mostrarToast(error.message, "error");
        navegarA('reservas');
      }
    };
  },

  abrirCheckout(id) {
    const ahora = new Date(); 
    ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
    const valorHora = ahora.toISOString().slice(0, 16);

    document.getElementById("modales").innerHTML = `
      <div class="modal-fondo modal-fondo--visible" id="modal-checkout">
        <div class="modal">
          <div class="modal__header">
            <span class="modal__titulo">Finalizar Estadía — Reserva #${id}</span>
            <button class="modal__cerrar" onclick="cerrarModal('modal-checkout')">✕</button>
          </div>
          <div class="modal__cuerpo">
            <div class="form">
              <div class="form__campo">
                <label class="form__label">Fecha y Hora de Salida Real</label>
                <input class="form__input" type="datetime-local" id="fechaCheckout" 
                       value="${valorHora}" onchange="Controllers.evaluarLateCheckout(this.value)" />
              </div>
              
              <div id="aviso-late" class="form__nota" style="display:none; margin-top:15px; border-color: #c0392b; color: #c0392b; background: #fdf0ef;">
                <strong>⚠️ Late Check-out detectado:</strong> 
                Se aplicará un recargo automático del 50% sobre la tarifa base de la habitación.
              </div>
            </div>
          </div>
          <div class="modal__pie">
            <button class="btn" onclick="cerrarModal('modal-checkout')">Cancelar</button>
            <button class="btn btn--peligro" onclick="Controllers.confirmarCheckout(${id})">Confirmar Check-out</button>
          </div>
        </div>
      </div>`;
    this.evaluarLateCheckout(valorHora);
  },

  async confirmarCheckout(idReserva) {
    const fechaSalida = document.getElementById('fechaCheckout').value;
    cerrarModal("modal-checkout");
    const main = document.getElementById("main-content");
    main.innerHTML = `<div class="panel" style="padding: 40px; text-align: center; color: #666;"><h3>⏳ Calculando consumos y recargos...</h3></div>`;

    try {
      const resultado = await API.post(`Reservas/${idReserva}/checkout`, fechaSalida);
      const recargo = resultado.reserva.montoLateCheckout;
      
      main.innerHTML = `
        <div class="panel" style="max-width: 600px; margin: 0 auto; border-top: 5px solid ${recargo > 0 ? '#c0392b' : '#27ae60'};">
          <div style="padding: 30px; text-align: center;">
            <div style="font-size: 50px; margin-bottom: 15px;">🏁</div>
            <h2 style="margin-bottom: 10px;">Estadía Finalizada</h2>
            <p style="color: #666; margin-bottom: 25px;">La reserva <strong>#${idReserva}</strong> ha sido cerrada y la habitación liberada.</p>
            
            <div style="background: ${recargo > 0 ? '#fdf0ef' : '#f0fbf4'}; border: 1px solid ${recargo > 0 ? '#e74c3c' : '#27ae60'}; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <div style="font-size: 13px; color: ${recargo > 0 ? '#c0392b' : '#27ae60'}; text-transform: uppercase; font-weight: 700;">Total Recargos por Salida Tardía</div>
              <div style="font-size: 24px; font-weight: 700; margin-top: 5px;">Bs. ${recargo.toFixed(2)}</div>
            </div>
            
            <button class="btn btn--primario" onclick="navegarA('reservas')">Volver al Listado</button>
          </div>
        </div>`;
    } catch (error) {
      mostrarToast(error.message, "error");
      navegarA('reservas');
    }
  },

  evaluarLateCheckout(valor) {
    const hora = new Date(valor).getHours();
    document.getElementById("aviso-late").style.display = hora >= HORA_LIMITE_CHECKOUT ? "block" : "none";
  },

 
};

// ==========================================
// 5. NAVEGACIÓN Y ARRANQUE
// ==========================================
async function navegarA(seccion) {
  const main = document.getElementById("main-content"); if (!main) return;
  main.innerHTML = `<div class="panel" style="padding: 40px; text-align: center; color: var(--suave);">⏳ Cargando interfaz...</div>`;
  if (VISTAS[seccion]) main.innerHTML = await VISTAS[seccion](); 
  document.querySelectorAll("[data-seccion]").forEach(el => el.classList.toggle("sidebar__item--activo", el.dataset.seccion === seccion));
}

function cerrarModal(id) { document.getElementById(id)?.remove(); }

window.navegarA = navegarA; window.Controllers = Controllers; window.cerrarModal = cerrarModal;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("sidebar-nombre").textContent = SESION_ACTUAL.nombre;
  document.getElementById("sidebar-rol").textContent = SESION_ACTUAL.rol;
  document.getElementById("sidebar-iniciales").textContent = SESION_ACTUAL.iniciales;
  document.querySelectorAll("[data-seccion]").forEach(el => el.addEventListener("click", () => navegarA(el.dataset.seccion)));
  navegarA("registro");
});