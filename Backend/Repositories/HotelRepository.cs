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

        public async Task<Reserva> AddReservaAsync(Reserva reserva)
        {
            _context.Reservas.Add(reserva);
            await _context.SaveChangesAsync();
            return reserva;
        }

        public async Task<Habitacion?> GetHabitacionByIdAsync(int id) =>
            await _context.Habitaciones.FindAsync(id);

        public async Task<TipoHabitacion?> GetTipoHabitacionByIdAsync(int id) =>
            await _context.TiposHabitacion.FindAsync(id);

        public async Task<IEnumerable<Huesped>> GetAllHuespedesAsync() =>
            await _context.Huespedes.ToListAsync();

        public async Task<IEnumerable<Reserva>> GetAllReservasAsync() =>
            await _context.Reservas.ToListAsync();

        public async Task<IEnumerable<Habitacion>> GetAllHabitacionesAsync() =>
            await _context.Habitaciones.ToListAsync();

        public async Task<IEnumerable<TipoHabitacion>> GetAllTiposHabitacionAsync() =>
            await _context.TiposHabitacion.ToListAsync();

        public async Task<IEnumerable<object>> GetContactosServiciosAsync()
        {
            var query = from contacto in _context.ContactosServicios 
                        join servicio in _context.Servicios on contacto.IdServicio equals servicio.IdServicio
                        join empleado in _context.Empleados on contacto.IdEmpleadoEncargado equals empleado.IdEmpleado
                        select new
                        {
                            NombreServicio = servicio.NombreServicio,
                            Encargado = empleado.Nombre + " " + empleado.Apellido,
                            Telefono = empleado.Telefono
                        };

            return await query.ToListAsync();
        }
    }
}