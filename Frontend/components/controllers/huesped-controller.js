import { API } from '../../api/api.js';
import { mostrarToast } from '../../utils/helpers.js';
import { cerrarModal } from '../modal/modal.js';

export function abrirModalHuesped() { 
  document.getElementById("modales").innerHTML = `
    <div class="modal-fondo modal-fondo--visible" id="modal-huesped">
      <div class="modal">
        <div class="modal__header">
          <span class="modal__titulo">Registrar Huésped</span>
          <button class="modal__cerrar" onclick="cerrarModal('modal-huesped')">✕</button>
        </div>
        <div class="modal__cuerpo">
          <form class="form" id="form-huesped">
            <div class="form__fila">
              <div class="form__campo"><label class="form__label">Nombre*</label><input class="form__input" type="text" id="h-nombre" required /></div>
              <div class="form__campo"><label class="form__label">Apellido*</label><input class="form__input" type="text" id="h-apellido" required /></div>
            </div>
            <div class="form__campo"><label class="form__label">Carnet de Identidad (CI)*</label><input class="form__input" type="text" id="h-ci" required /></div>
            <div class="form__campo"><label class="form__label">Número de Teléfono*</label><input class="form__input" type="text" id="h-telefono" required /></div>
            <div class="form__campo"><label class="form__label">Correo Electrónico</label><input class="form__input" type="email" id="h-correoElectronico" /></div>
          </form>
        </div>
        <div class="modal__pie">
          <button class="btn" onclick="cerrarModal('modal-huesped')">Cancelar</button>
          <button class="btn btn--primario" onclick="Controllers.guardarHuesped()">Guardar Huésped</button>
        </div>
      </div>
    </div>`;
}

export async function guardarHuesped() { 
  const n = document.getElementById("h-nombre").value.trim(), a = document.getElementById("h-apellido").value.trim(), c = document.getElementById("h-ci").value.trim(), t = document.getElementById("h-telefono").value.trim(), e = document.getElementById("h-correoElectronico").value.trim();
  if (!n || !a || !c || !t) return mostrarToast("Completa los campos requeridos", "error");
  try { 
    await API.post('Huespedes', { nombre: n, apellido: a, ci: c, telefono: t, correoElectronico: e }); 
    cerrarModal("modal-huesped"); 
    window.navegarA("huespedes"); 
    mostrarToast("¡Huésped registrado exitosamente!"); 
  } catch (error) { mostrarToast(error.message, "error"); }
}