using MiHotelBackend.Models;

namespace MiHotelBackend.Repositories
{
    public interface IHotelRepository
    {
        Task<Huesped?> GetHuespedByCIAsync(string ci);
        Task<Huesped> AddHuespedAsync(Huesped huesped);
        Task<Reserva?> GetReservaByIdAsync(int id);
        Task<Reserva> UpdateReservaAsync(Reserva reserva);
        Task<Habitacion?> GetHabitacionByIdAsync(int id);
        Task<TipoHabitacion?> GetTipoHabitacionByIdAsync(int id);
        // Agrégalos dentro de la interfaz IHotelRepository
        Task<IEnumerable<Huesped>> GetAllHuespedesAsync();
        Task<IEnumerable<Reserva>> GetAllReservasAsync();
        Task<IEnumerable<Habitacion>> GetAllHabitacionesAsync();
    }
}