import { fmtFecha, badgeEstado, avatarHTML, mostrarToast } from './helpers.js';

describe('Helpers Utilities', () => {
  it('fmtFecha debe formatear correctamente', () => {
    expect(fmtFecha(null)).toBe('—');
    expect(fmtFecha('2026-05-23T10:00:00Z')).toContain('2026'); 
  });

  it('badgeEstado debe devolver el HTML correcto para cada estado', () => {
    expect(badgeEstado('Pendiente')).toContain('badge--pendiente');
    expect(badgeEstado('EnCurso')).toContain('badge--en-curso');
    expect(badgeEstado('Finalizada')).toContain('badge--finalizado');
    expect(badgeEstado('Cancelada')).toContain('badge--cancelado');
    expect(badgeEstado('Disponible')).toContain('Disponible');
    expect(badgeEstado('')).toContain('badge--pendiente');
  });

  it('avatarHTML debe generar un avatar con la inicial correcta', () => {
    expect(avatarHTML('Dariana')).toContain('D');
    expect(avatarHTML(null)).toContain('?');
  });

  it('mostrarToast debe mostrar y ocultar el toast en el DOM', () => {
    document.body.innerHTML = '<div id="toast"></div>';
    
    mostrarToast('Mensaje de prueba', 'ok');
    const toast = document.getElementById('toast');
    
    expect(toast.textContent).toBe('Mensaje de prueba');
    expect(toast.className).toContain('toast--visible');
    expect(toast.className).toContain('toast--ok');
  });
});