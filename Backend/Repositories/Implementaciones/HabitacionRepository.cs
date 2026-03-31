using Microsoft.EntityFrameworkCore;
using MiHotelBackend.Data;
using MiHotelBackend.Models;
using MiHotelBackend.Repositories.Interfaces;

namespace MiHotelBackend.Repositories.Implementations
{
    public class HabitacionRepository : IHabitacionRepository
    {
        private readonly HotelDbContext _context;

        public HabitacionRepository(HotelDbContext context)
        {
            _context = context;
        }

        public async Task<Habitacion?> GetHabitacionByIdAsync(int id) =>
            await _context.Habitaciones.FindAsync(id);

        public async Task<TipoHabitacion?> GetTipoHabitacionByIdAsync(int id) =>
            await _context.TiposHabitacion.FindAsync(id);

        public async Task<IEnumerable<Habitacion>> GetAllHabitacionesAsync() =>
            await _context.Habitaciones.ToListAsync();

        public async Task<IEnumerable<TipoHabitacion>> GetAllTiposHabitacionAsync() =>
            await _context.TiposHabitacion.ToListAsync();
    }
}