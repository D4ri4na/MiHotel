using MiHotelBackend.Models;

namespace MiHotelBackend.Repositories
{
    public interface IHotelRepository
    {
        Task<Huesped?> GetHuespedByCIAsync(string ci);
        Task<Huesped> AddHuespedAsync(Huesped huesped);

        Task<Reserva?> GetReservaByIdAsync(int id);
        Task<Reserva> UpdateReservaAsync(Reserva reserva);
        // AQUÍ ESTÁ LA FUNCIÓN RECUPERADA:
        Task<Reserva> AddReservaAsync(Reserva reserva);

        Task<Habitacion?> GetHabitacionByIdAsync(int id);
        Task<TipoHabitacion?> GetTipoHabitacionByIdAsync(int id);

        Task<IEnumerable<Huesped>> GetAllHuespedesAsync();
        Task<IEnumerable<Reserva>> GetAllReservasAsync();
        Task<IEnumerable<Habitacion>> GetAllHabitacionesAsync();
        Task<IEnumerable<TipoHabitacion>> GetAllTiposHabitacionAsync();

        Task<IEnumerable<object>> GetContactosServiciosAsync();
    }
}