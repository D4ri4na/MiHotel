using MiHotelBackend.Models;
using MiHotelBackend.Repositories.Interfaces;

namespace MiHotelBackend.Services
{
    public class HabitacionFactory
    {
        private readonly IHabitacionRepository _repo;

        public HabitacionFactory(IHabitacionRepository repo)
        {
            _repo = repo;
        }

        public async Task<TipoHabitacion> ObtenerCaracteristicasBaseAsync(int idHabitacion)
        {
            var habitacion = await _repo.GetHabitacionByIdAsync(idHabitacion);
            if (habitacion == null) throw new Exception("Habitación no encontrada.");

            var tipo = await _repo.GetTipoHabitacionByIdAsync(habitacion.IdTipo);
            return tipo ?? throw new Exception("Tipo de habitación no definido.");
        }
    }
}