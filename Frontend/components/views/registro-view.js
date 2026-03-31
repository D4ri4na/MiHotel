export async function getRegistroView() {
  return `
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
    </div>`;
}