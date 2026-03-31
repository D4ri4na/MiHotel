using MiHotelBackend.Models;
using MiHotelBackend.Repositories;

namespace MiHotelBackend.Services
{
    public class ReservaService
    {
        private readonly IHotelRepository _repo;

        public ReservaService(IHotelRepository repo)
        {
            _repo = repo;
        }

        public async Task<Reserva> CrearReservaAsync(int idHuesped, int idHabitacion, DateTime ingreso, DateTime salida, int personas)
        {
            if (salida.Date <= ingreso.Date) throw new Exception("La fecha de salida debe ser posterior a la de ingreso.");

            var habitacion = await _repo.GetHabitacionByIdAsync(idHabitacion);
            if (habitacion == null) throw new Exception("Habitación no existe.");

            var tipo = await _repo.GetTipoHabitacionByIdAsync(habitacion.IdTipo);
            if (personas > tipo.CapacidadMaxima) throw new Exception($"La habitación elegida solo permite un máximo de {tipo.CapacidadMaxima} personas.");

            var reservasExistentes = await _repo.GetAllReservasAsync();
            var choca = reservasExistentes.Any(r => r.IdHabitacion == idHabitacion && r.Estado != "Cancelada" && r.Estado != "Finalizada" && ingreso.Date < r.FechaSalida.Date && salida.Date > r.FechaIngreso.Date);
            if (choca) throw new Exception("La habitación ya está reservada en esas fechas.");

            var nueva = new Reserva { IdHuespedTitular = idHuesped, IdHabitacion = idHabitacion, FechaIngreso = ingreso, FechaSalida = salida };
            return await _repo.AddReservaAsync(nueva);
        }

        public async Task<Reserva> RegistrarCheckinAsync(int idReserva)
        {
            var reserva = await _repo.GetReservaByIdAsync(idReserva);
            if (reserva == null) throw new Exception("Reserva no encontrada.");
            if (reserva.Estado == "Cancelada") throw new Exception("Operación denegada: La reserva se encuentra cancelada.");
            if (reserva.Estado == "EnCurso" || reserva.FechaCheckin != null) throw new Exception("Operación denegada: Esta reserva ya tiene un check-in registrado.");

            reserva.FechaCheckin = DateTime.Now;
            reserva.Estado = "EnCurso";
            return await _repo.UpdateReservaAsync(reserva);
        }

        // ==========================================
        // HU-08: REGISTRAR CHECK-OUT Y LATE CHECK-OUT
        // ==========================================
        public async Task<Reserva> RegistrarCheckoutAsync(int idReserva, DateTime fechaCheckoutEfectiva)
        {
            var reserva = await _repo.GetReservaByIdAsync(idReserva);
            if (reserva == null) throw new Exception("Reserva no encontrada.");

            // CRITERIO 2: Impedir si la reserva no tiene check-in previo
            if (reserva.Estado != "EnCurso" || reserva.FechaCheckin == null)
                throw new Exception("Operación denegada: No se puede hacer check-out de una reserva que no está 'En Curso'.");

            // CRITERIO 1: Registrar fecha y hora de salida oficial
            reserva.FechaCheckout = fechaCheckoutEfectiva;
            reserva.Estado = "Finalizada";

            // CRITERIO 3: Calcular Late Check-out
            // Definimos el horario límite (Ej: 12:00 PM / Mediodía)
            TimeSpan horaLimite = new TimeSpan(12, 0, 0);

            // Evaluamos si salió después de las 12:00 PM o si se fue un día después de lo planeado
            bool esLateCheckout = fechaCheckoutEfectiva.TimeOfDay >= horaLimite || fechaCheckoutEfectiva.Date > reserva.FechaSalida.Date;

            if (esLateCheckout)
            {
                // Buscamos cuánto cuesta la habitación para sacar el cálculo
                var habitacion = await _repo.GetHabitacionByIdAsync(reserva.IdHabitacion);
                var tipoHabitacion = await _repo.GetTipoHabitacionByIdAsync(habitacion.IdTipo);

                // Aplicamos un recargo del 50% de la tarifa base por salir tarde
                reserva.MontoLateCheckout = tipoHabitacion.PrecioBase * 0.5m;
            }
            else
            {
                // Salió a tiempo, no hay multa
                reserva.MontoLateCheckout = 0;
            }

            // Opcional pero recomendado: Liberar la habitación para que vuelva a estar disponible
            var hab = await _repo.GetHabitacionByIdAsync(reserva.IdHabitacion);
            if (hab != null) hab.Estado = "Disponible";

            return await _repo.UpdateReservaAsync(reserva);
        }
    }
}