using MiHotelBackend.Models;

namespace MiHotelBackend.Services.Interfaces
{
    public interface IReservaService
    {
        Task<Reserva> CrearReservaAsync(int idHuesped, int idHabitacion, DateTime ingreso, DateTime salida, int personas);
        Task<Reserva> RegistrarCheckinAsync(int idReserva);
        Task<Reserva> RegistrarCheckoutAsync(int idReserva, DateTime fechaCheckoutEfectiva);
    }
}