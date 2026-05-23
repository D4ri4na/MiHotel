import { badgeEstado, avatarHTML, HORA_LIMITE_CHECKOUT } from '../utils/helpers.js';

describe('Pruebas Unitarias - Lógica de Negocio Frontend', () => {

  //1
  it('Debe generar la insignia (badge) visual correcta según el estado (HU-04)', () => {
    expect(badgeEstado('EnCurso')).toContain('badge--en-curso');
    expect(badgeEstado('Pendiente')).toContain('badge--pendiente');
    expect(badgeEstado('Finalizada')).toContain('badge--finalizado');
    expect(badgeEstado('Disponible')).toContain('badge--en-curso'); 
    expect(badgeEstado('')).toContain('badge--pendiente'); 
  });

  //2
  it('Debe auto-generar avatares visuales extrayendo la inicial del cliente (HU-05)', () => {
    const avatarConNombre = avatarHTML('Carlos');
    const avatarVacio = avatarHTML('');

    expect(avatarConNombre).toContain('>C<');
    expect(avatarVacio).toContain('>?<');     
  });

  //3
 it('Debe contener la regla de negocio para el límite horario de late check-out (HU-03)', () => {
    expect(HORA_LIMITE_CHECKOUT).toBe(12);
  });

});