using MiHotelBackend.Models;

namespace MiHotelBackend.Repositories.Interfaces
{
    public interface IHabitacionRepository
    {
        Task<Habitacion?> GetHabitacionByIdAsync(int id);
        Task<TipoHabitacion?> GetTipoHabitacionByIdAsync(int id);
        Task<IEnumerable<Habitacion>> GetAllHabitacionesAsync();
        Task<IEnumerable<TipoHabitacion>> GetAllTiposHabitacionAsync();
    }
}