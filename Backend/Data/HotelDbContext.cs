using Microsoft.EntityFrameworkCore;
using MiHotelBackend.Models;

namespace MiHotelBackend.Data
{
    public class HotelDbContext : DbContext
    {
        public HotelDbContext(DbContextOptions<HotelDbContext> options) : base(options) { }

        public DbSet<Huesped> Huespedes { get; set; }
        public DbSet<Habitacion> Habitaciones { get; set; }
        public DbSet<TipoHabitacion> TiposHabitacion { get; set; }
        public DbSet<Reserva> Reservas { get; set; }
    }
}