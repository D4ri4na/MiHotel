using MiHotelBackend.Models;
using MiHotelBackend.Repositories;

namespace MiHotelBackend.Services
{
    public class ReservaService
    {
        private readonly IHotelRepository _repo;
        private readonly HabitacionFactory _factory;

        public ReservaService(IHotelRepository repo, HabitacionFactory factory)
        {
            _repo = repo;
            _factory = factory;
        }

        // HU-04: Registrar Check-in
        public async Task<Reserva> RegistrarCheckinAsync(int idReserva)
        {
            var reserva = await _repo.GetReservaByIdAsync(idReserva);
            if (reserva == null || reserva.Estado != "Pendiente")
                throw new Exception("La reserva no está vigente o ya fue procesada.");

            reserva.FechaCheckin = DateTime.Now;
            reserva.Estado = "EnCurso";

            return await _repo.UpdateReservaAsync(reserva);
        }

        // HU-08: Tu historia individual (Late Check-out)
        public async Task<Reserva> RegistrarCheckoutAsync(int idReserva, DateTime fechaSalidaEfectiva)
        {
            var reserva = await _repo.GetReservaByIdAsync(idReserva);

            // Criterio de aceptación 2: Impedir si no hay check-in previo
            if (reserva == null || reserva.FechaCheckin == null)
                throw new Exception("Operación denegada: La reserva no tiene check-in previo.");

            reserva.FechaCheckout = fechaSalidaEfectiva;
            reserva.Estado = "Finalizada";

            // Criterio de aceptación 3: Calcular Late Check-out si pasa de las 12:00
            if (fechaSalidaEfectiva.Hour >= 12)
            {
                var caracteristicas = await _factory.ObtenerCaracteristicasBaseAsync(reserva.IdHabitacion);
                decimal porcentajeRecargo = 0.30m; // Podría venir de tu tabla ConfiguracionesTarifa
                reserva.MontoLateCheckout = caracteristicas.PrecioBase * porcentajeRecargo;
            }

            return await _repo.UpdateReservaAsync(reserva);
        }
    }
}