namespace MiHotelBackend.Repositories.Interfaces
{
    public interface IServicioRepository
    {
        Task<IEnumerable<object>> GetContactosServiciosAsync();
    }
}