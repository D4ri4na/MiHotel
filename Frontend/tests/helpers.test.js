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

  test('Debe retornar false si el Check-Out es anterior al Check-In', () => {
      const checkIn = '2026-08-15';
      const checkOut = '2026-08-10'; 

      const esValido = validarFechasReserva(checkIn, checkOut);

      expect(esValido).toBe(false);
  });
});