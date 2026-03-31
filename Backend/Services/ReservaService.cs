using MiHotelBackend.Models;
using MiHotelBackend.Repositories;

namespace MiHotelBackend.Services
{
    public class ReservaService
    {
        private readonly IHotelRepository _repo;
        private readonly HabitacionFactory _factory; // Declaración del campo factory

        // Constructor actualizado para recibir el Factory
        public ReservaService(IHotelRepository repo, HabitacionFactory factory)
        {
            _repo = repo;
            _factory = factory;
        }

        public async Task<Reserva> CrearReservaAsync(int idHuesped, int idHabitacion, DateTime ingreso, DateTime salida, int personas)
        {
            if (salida.Date <= ingreso.Date) throw new Exception("La fecha de salida debe ser posterior a la de ingreso.");

            // Uso correcto del método del Factory: ObtenerCaracteristicasBaseAsync
            var tipo = await _factory.ObtenerCaracteristicasBaseAsync(idHabitacion);

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

        public async Task<Reserva> RegistrarCheckoutAsync(int idReserva, DateTime fechaCheckoutEfectiva)
        {
            var reserva = await _repo.GetReservaByIdAsync(idReserva);
            if (reserva == null) throw new Exception("Reserva no encontrada.");

            if (reserva.Estado != "EnCurso" || reserva.FechaCheckin == null)
                throw new Exception("Operación denegada: No se puede hacer check-out de una reserva que no está 'En Curso'.");

            reserva.FechaCheckout = fechaCheckoutEfectiva;
            reserva.Estado = "Finalizada";

            TimeSpan horaLimite = new TimeSpan(12, 0, 0);
            bool esLateCheckout = fechaCheckoutEfectiva.TimeOfDay >= horaLimite || fechaCheckoutEfectiva.Date > reserva.FechaSalida.Date;

            if (esLateCheckout)
            {
                var habitacion = await _repo.GetHabitacionByIdAsync(reserva.IdHabitacion);
                // Usamos el operador ! para indicar que confiamos en que tipoHabitacion no será nulo tras las validaciones
                var tipoHabitacion = await _repo.GetTipoHabitacionByIdAsync(habitacion!.IdTipo);

                reserva.MontoLateCheckout = tipoHabitacion!.PrecioBase * 0.5m;
            }
            else
            {
                reserva.MontoLateCheckout = 0;
            }

            var hab = await _repo.GetHabitacionByIdAsync(reserva.IdHabitacion);
            if (hab != null) hab.Estado = "Disponible";

            return await _repo.UpdateReservaAsync(reserva);
        }
    }
}