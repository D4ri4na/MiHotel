using Microsoft.EntityFrameworkCore;
using MiHotelBackend.Data;
using MiHotelBackend.Models;
using MiHotelBackend.Repositories.Interfaces;

namespace MiHotelBackend.Repositories.Implementations
{
    public class ReservaRepository : IReservaRepository
    {
        private readonly HotelDbContext _context;

        public ReservaRepository(HotelDbContext context)
        {
            _context = context;
        }

        public async Task<Reserva?> GetReservaByIdAsync(int id) =>
            await _context.Reservas.FindAsync(id);

        public async Task<Reserva> AddReservaAsync(Reserva reserva)
        {
            _context.Reservas.Add(reserva);
            await _context.SaveChangesAsync();
            return reserva;
        }

        public async Task<Reserva> UpdateReservaAsync(Reserva reserva)
        {
            _context.Reservas.Update(reserva);
            await _context.SaveChangesAsync();
            return reserva;
        }

        public async Task<IEnumerable<Reserva>> GetAllReservasAsync() =>
            await _context.Reservas.ToListAsync();
    }
}