using MiHotelBackend.Models;

namespace MiHotelBackend.Repositories.Interfaces
{
    public interface IReservaRepository
    {
        Task<Reserva?> GetReservaByIdAsync(int id);
        Task<Reserva> AddReservaAsync(Reserva reserva);
        Task<Reserva> UpdateReservaAsync(Reserva reserva);
        Task<IEnumerable<Reserva>> GetAllReservasAsync();
    }
}