using Microsoft.EntityFrameworkCore;
using MiHotelBackend.Data;
using MiHotelBackend.Models;

namespace MiHotelBackend.Repositories
{
	public class HotelRepository : IHotelRepository
	{
		private readonly HotelDbContext _context;

		public HotelRepository(HotelDbContext context)
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

		public async Task<Reserva?> GetReservaByIdAsync(int id) =>
			await _context.Reservas.FindAsync(id);

		public async Task<Reserva> UpdateReservaAsync(Reserva reserva)
		{
			_context.Reservas.Update(reserva);
			await _context.SaveChangesAsync();
			return reserva;
		}

		public async Task<Habitacion?> GetHabitacionByIdAsync(int id) =>
			await _context.Habitaciones.FindAsync(id);

		public async Task<TipoHabitacion?> GetTipoHabitacionByIdAsync(int id) =>
			await _context.TiposHabitacion.FindAsync(id);

		// Agrégalos dentro de la clase HotelRepository
		public async Task<IEnumerable<Huesped>> GetAllHuespedesAsync() =>
			await _context.Huespedes.ToListAsync();

		public async Task<IEnumerable<Reserva>> GetAllReservasAsync() =>
			await _context.Reservas.ToListAsync();

		public async Task<IEnumerable<Habitacion>> GetAllHabitacionesAsync() =>
			await _context.Habitaciones.ToListAsync();
	}
}