using MiHotelBackend.Models;
using MiHotelBackend.Repositories;

namespace MiHotelBackend.Services
{
    // Patrón Simple Factory para obtener características de la habitación
    public class HabitacionFactory
    {
        private readonly IHotelRepository _repo;
        public HabitacionFactory(IHotelRepository repo) { _repo = repo; }

        public async Task<TipoHabitacion> ObtenerCaracteristicasBaseAsync(int idHabitacion)
        {
            var habitacion = await _repo.GetHabitacionByIdAsync(idHabitacion);
            if (habitacion == null) throw new Exception("Habitación no válida.");

            return await _repo.GetTipoHabitacionByIdAsync(habitacion.IdTipo)
                   ?? throw new Exception("Tipo no definido.");
        }
    }
}