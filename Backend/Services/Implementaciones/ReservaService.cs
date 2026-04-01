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

        public ReservaService(IReservaRepository reservaRepo, IHabitacionRepository habRepo, HabitacionFactory factory)
        {
            _reservaRepo = reservaRepo;
            _habRepo = habRepo;
            _factory = factory;
        }

        public async Task<Reserva> CrearReservaAsync(int idHuesped, int idHabitacion, DateTime ingreso, DateTime salida, int personas)
        {
            if (salida.Date <= ingreso.Date) throw new Exception("La fecha de salida debe ser posterior a la de ingreso.");

            var tipo = await _factory.ObtenerCaracteristicasBaseAsync(idHabitacion);
            if (personas > tipo.CapacidadMaxima) throw new Exception($"La habitación solo permite {tipo.CapacidadMaxima} personas.");

            var reservasExistentes = await _reservaRepo.GetAllReservasAsync();
            var choca = reservasExistentes.Any(r =>
                r.IdHabitacion == idHabitacion &&
                r.Estado != "Cancelada" &&
                r.Estado != "Finalizada" &&
                ingreso.Date < r.FechaSalida.Date &&
                salida.Date > r.FechaIngreso.Date);

            if (choca) throw new Exception("La habitación ya está reservada en esas fechas.");

            var nueva = new Reserva
            {
                IdHuespedTitular = idHuesped,
                IdHabitacion = idHabitacion,
                FechaIngreso = ingreso.ToUniversalTime(),
                FechaSalida = salida.ToUniversalTime(),
                Estado = "Pendiente"
            };

            return await _reservaRepo.AddReservaAsync(nueva);
        }

        public async Task<Reserva> RegistrarCheckinAsync(int idReserva)
        {
            var reserva = await _reservaRepo.GetReservaByIdAsync(idReserva);
            if (reserva == null) throw new Exception("Reserva no encontrada.");
            if (reserva.Estado == "Cancelada") throw new Exception("La reserva está cancelada.");
            if (reserva.Estado == "EnCurso") throw new Exception("El huésped ya realizó el Check-in.");

            reserva.FechaCheckin = DateTime.UtcNow;
            reserva.Estado = "EnCurso";

            return await _reservaRepo.UpdateReservaAsync(reserva);
        }

        public async Task<Reserva> RegistrarCheckoutAsync(int idReserva, DateTime fechaCheckoutEfectiva)
        {
            var reserva = await _reservaRepo.GetReservaByIdAsync(idReserva);
            if (reserva == null) throw new Exception("Reserva no encontrada.");
            if (reserva.Estado == "Finalizada") throw new Exception("Esta reserva ya ha sido finalizada.");

            reserva.FechaCheckout = fechaCheckoutEfectiva.ToUniversalTime();
            reserva.Estado = "Finalizada";

            bool esDiaPosterior = fechaCheckoutEfectiva.Date > reserva.FechaSalida.Date;
            bool esMismoDiaTarde = fechaCheckoutEfectiva.Date == reserva.FechaSalida.Date &&
                                   fechaCheckoutEfectiva.TimeOfDay >= new TimeSpan(12, 0, 0);

            if (esDiaPosterior || esMismoDiaTarde)
            {
                var tipoHab = await _factory.ObtenerCaracteristicasBaseAsync(reserva.IdHabitacion);
                reserva.MontoLateCheckout = tipoHab.PrecioBase * 0.5m;
            }
            else
            {
                reserva.MontoLateCheckout = 0;
            }

            var hab = await _habRepo.GetHabitacionByIdAsync(reserva.IdHabitacion);
            if (hab != null)
            {
                hab.Estado = "Disponible";
            }

            return await _reservaRepo.UpdateReservaAsync(reserva);
        }
    }
}