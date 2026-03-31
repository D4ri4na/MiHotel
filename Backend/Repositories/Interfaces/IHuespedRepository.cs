using MiHotelBackend.Models;

namespace MiHotelBackend.Repositories.Interfaces
{
    public interface IHuespedRepository
    {
        Task<Huesped?> GetHuespedByCIAsync(string ci);
        Task<Huesped> AddHuespedAsync(Huesped huesped);
        Task<IEnumerable<Huesped>> GetAllHuespedesAsync();
    }
}