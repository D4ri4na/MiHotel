using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MiHotelBackend.Models
{
    [Table("huespedes")]
    public class Huesped
    {
        [Key]
        [Column("id_huesped")]
        public int IdHuesped { get; set; }

        [Column("nombre_huesped")]
        public string Nombre { get; set; } = string.Empty;

        [Column("apellido_huesped")]
        public string Apellido { get; set; } = string.Empty;

        [Column("ci")]
        public string CI { get; set; } = string.Empty;

        [Column("telefono")]
        public string? Telefono { get; set; }

        [Column("correo_electronico")]
        public string? CorreoElectronico { get; set; }
    }

    [Table("tiposhabitacion")]
    public class TipoHabitacion
    {
        [Key]
        [Column("id_tipo")]
        public int IdTipo { get; set; }
        [Column("nombre_tipo")]
        public string NombreTipo { get; set; } = string.Empty;
        [Column("capacidad_maxima")]
        public int CapacidadMaxima { get; set; }
        [Column("precio_base")]
        public decimal PrecioBase { get; set; }
    }

    [Table("habitaciones")]
    public class Habitacion
    {
        [Key]
        [Column("id_habitacion")]
        public int IdHabitacion { get; set; }
        [Column("id_tipo")]
        public int IdTipo { get; set; }
        [Column("estado")]
        public string Estado { get; set; } = "Disponible";
    }

    [Table("reservas")]
    public class Reserva
    {
        [Key]
        [Column("id_reserva")]
        public int IdReserva { get; set; }
        [Column("id_huesped_titular")]
        public int IdHuespedTitular { get; set; }
        [Column("id_habitacion")]
        public int IdHabitacion { get; set; }
        [Column("fecha_estimada_ingreso")]
        public DateTime FechaIngreso { get; set; }
        [Column("fecha_estimada_salida")]
        public DateTime FechaSalida { get; set; }
        [Column("fecha_hora_checkin")]
        public DateTime? FechaCheckin { get; set; }
        [Column("fecha_hora_checkout")]
        public DateTime? FechaCheckout { get; set; }
        [Column("estado_reserva")]
        public string Estado { get; set; } = "Pendiente";
        [Column("monto_late_checkout")]
        public decimal? MontoLateCheckout { get; set; }
    }
}