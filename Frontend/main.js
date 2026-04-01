import { SESION_ACTUAL } from './utils/helpers.js';
import { cerrarModal } from './components/modal/modal.js';

import { getRegistroView } from './components/views/registro-view.js';
import { getReservasView } from './components/views/reservas-view.js';
import { getHuespedesView } from './components/views/huespedes-view.js';
import { getHabitacionesView } from './components/views/habitaciones-view.js';
import { getServiciosView } from './components/views/servicios-view.js';

import * as HuespedCtrl from './components/controllers/huesped-controller.js';
import * as ReservaCtrl from './components/controllers/reserva-controller.js';
import * as CheckoutCtrl from './components/controllers/checkout-controller.js';

const VISTAS = {
  registro: getRegistroView,
  reservas: getReservasView,
  huespedes: getHuespedesView,
  habitaciones: getHabitacionesView,
  servicios: getServiciosView
};

async function navegarA(seccion) {
  const main = document.getElementById("main-content"); 
  if (!main) return;

  main.innerHTML = `<div class="panel" style="padding: 40px; text-align: center; color: var(--suave);">⏳ Cargando interfaz...</div>`;
  
  try {
    if (VISTAS[seccion]) {
        main.innerHTML = await VISTAS[seccion](); 
    }
    document.querySelectorAll("[data-seccion]").forEach(el => 
        el.classList.toggle("sidebar__item--activo", el.dataset.seccion === seccion)
    );
  } catch (error) {
    console.error(`Error al cargar la sección ${seccion}:`, error);
    main.innerHTML = `<div class="panel" style="padding: 20px; color: #e74c3c; text-align: center;">Ocurrió un error al cargar esta sección.</div>`;
  }
}

window.navegarA = navegarA;
window.cerrarModal = cerrarModal;

window.Controllers = {
    ...HuespedCtrl,
    ...ReservaCtrl,
    ...CheckoutCtrl
};

document.addEventListener("DOMContentLoaded", () => {
  
  const elNombre = document.getElementById("sidebar-nombre");
  const elRol = document.getElementById("sidebar-rol");
  const elIniciales = document.getElementById("sidebar-iniciales");

  if(elNombre) elNombre.textContent = SESION_ACTUAL.nombre;
  if(elRol) elRol.textContent = SESION_ACTUAL.rol;
  if(elIniciales) elIniciales.textContent = SESION_ACTUAL.iniciales;

  document.querySelectorAll("[data-seccion]").forEach(el => 
    el.addEventListener("click", () => navegarA(el.dataset.seccion))
  );

  navegarA("registro");
});