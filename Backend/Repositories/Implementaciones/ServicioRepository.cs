using Microsoft.EntityFrameworkCore;
using MiHotelBackend.Data;
using MiHotelBackend.Repositories.Interfaces;

namespace MiHotelBackend.Repositories.Implementations
{
    public class ServicioRepository : IServicioRepository
    {
        private readonly HotelDbContext _context;

        public ServicioRepository(HotelDbContext context)
        {
            _context = context;
        }

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