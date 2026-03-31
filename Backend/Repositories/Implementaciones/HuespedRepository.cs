using Microsoft.EntityFrameworkCore;
using MiHotelBackend.Data;
using MiHotelBackend.Models;
using MiHotelBackend.Repositories.Interfaces;

namespace MiHotelBackend.Repositories.Implementations
{
    public class HuespedRepository : IHuespedRepository
    {
        private readonly HotelDbContext _context;

        public HuespedRepository(HotelDbContext context)
        {
            _context = context;
        }

        public async Task<Huesped?> GetHuespedByCIAsync(string ci) =>
            await _context.Huespedes.FirstOrDefaultAsync(h => h.CI == ci);

        public async Task<Huesped> AddHuespedAsync(Huesped huesped)
        {
            _context.Huespedes.Add(huesped);
            await _context.SaveChangesAsync();
            return huesped;
        }

        public async Task<IEnumerable<Huesped>> GetAllHuespedesAsync() =>
            await _context.Huespedes.ToListAsync();
    }
}