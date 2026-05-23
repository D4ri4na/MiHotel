using MiHotelBackend.Models;
using MiHotelBackend.Repositories.Interfaces;
using MiHotelBackend.Services.Interfaces;

namespace MiHotelBackend.Services
{
    public class ReservaService : IReservaService
    {
        private readonly IReservaRepository _reservaRepo;
        private readonly IHabitacionRepository _habRepo;
        private readonly HabitacionFactory _factory;

        private const int HoraLimiteCheckout = 12;
        private const decimal RecargoLateCheckout = 0.5m;
        private const string EstadoPendiente = "Pendiente";
        private const string EstadoEnCurso = "EnCurso";
        private const string EstadoFinalizada = "Finalizada";
        private const string EstadoCancelada = "Cancelada";
        private const string HabitacionDisponible = "Disponible";

        public ReservaService(IReservaRepository reservaRepo, IHabitacionRepository habRepo, HabitacionFactory factory)
        {
            _reservaRepo = reservaRepo;
            _habRepo = habRepo;
            _factory = factory;
        }

        public async Task<Reserva> CrearReservaAsync(int idHuesped, int idHabitacion, DateTime ingreso, DateTime salida, int personas)
        {
            if (salida.Date <= ingreso.Date)
                throw new InvalidOperationException("La fecha de salida debe ser posterior a la de ingreso.");

            var tipo = await _factory.ObtenerCaracteristicasBaseAsync(idHabitacion);
            if (personas > tipo.CapacidadMaxima)
                throw new InvalidOperationException($"La habitación solo permite {tipo.CapacidadMaxima} personas.");

            var reservasExistentes = await _reservaRepo.GetAllReservasAsync();
            var choca = reservasExistentes.Any(r =>
                r.IdHabitacion == idHabitacion &&
                r.Estado != EstadoCancelada &&
                r.Estado != EstadoFinalizada &&
                ingreso.Date < r.FechaSalida.Date &&
                salida.Date > r.FechaIngreso.Date);

            if (choca)
                throw new InvalidOperationException("La habitación ya está reservada en esas fechas.");

            var nueva = new Reserva
            {
                IdHuespedTitular = idHuesped,
                IdHabitacion = idHabitacion,
                FechaIngreso = ingreso.ToUniversalTime(),
                FechaSalida = salida.ToUniversalTime(),
                Estado = EstadoPendiente
            };

            return await _reservaRepo.AddReservaAsync(nueva);
        }

        public async Task<Reserva> RegistrarCheckinAsync(int idReserva)
        {
            var reserva = await _reservaRepo.GetReservaByIdAsync(idReserva);
            if (reserva == null) throw new InvalidOperationException("Reserva no encontrada.");
            if (reserva.Estado == EstadoCancelada) throw new InvalidOperationException("La reserva está cancelada.");
            if (reserva.Estado == EstadoEnCurso) throw new InvalidOperationException("El huésped ya realizó el Check-in.");

            reserva.FechaCheckin = DateTime.UtcNow;
            reserva.Estado = EstadoEnCurso;

            return await _reservaRepo.UpdateReservaAsync(reserva);
        }

        public async Task<Reserva> RegistrarCheckoutAsync(int idReserva, DateTime fechaCheckoutEfectiva)
        {
            var reserva = await _reservaRepo.GetReservaByIdAsync(idReserva);
            if (reserva == null) throw new InvalidOperationException("Reserva no encontrada.");
            if (reserva.Estado == EstadoFinalizada) throw new InvalidOperationException("Esta reserva ya ha sido finalizada.");

            reserva.FechaCheckout = fechaCheckoutEfectiva.ToUniversalTime();
            reserva.Estado = EstadoFinalizada;

            var tipoHab = await _factory.ObtenerCaracteristicasBaseAsync(reserva.IdHabitacion);

            reserva.CalcularYAplicarMora(fechaCheckoutEfectiva, tipoHab.PrecioBase, HoraLimiteCheckout);

            await LiberarHabitacionAsync(reserva.IdHabitacion);

            return await _reservaRepo.UpdateReservaAsync(reserva);
        }

        private async Task LiberarHabitacionAsync(int idHabitacion)
        {
            var hab = await _habRepo.GetHabitacionByIdAsync(idHabitacion);
            if (hab != null)
            {
                hab.Estado = HabitacionDisponible;
            }
        }
    }
}