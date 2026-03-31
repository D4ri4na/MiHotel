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

        // AQUÍ ESTÁ LA SOLUCIÓN: Le decimos que en la BD esto es un "date"
        [Column("fecha_estimada_ingreso", TypeName = "date")]
        public DateTime FechaIngreso { get; set; }

        [Column("fecha_estimada_salida", TypeName = "date")]
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
    [Table("servicios")]
    public class Servicio
    {
        [Key]
        [Column("id_servicio")]
        public int IdServicio { get; set; }

        [Column("nombre_servicio")]
        public string NombreServicio { get; set; } = string.Empty;
    }

    [Table("empleados")]
    public class Empleado
    {
        [Key]
        [Column("id_empleado")]
        public int IdEmpleado { get; set; }

        // AHORA USAMOS LAS DOS COLUMNAS QUE PEDISTE
        [Column("nombre")]
        public string Nombre { get; set; } = string.Empty;

        [Column("apellido")]
        public string Apellido { get; set; } = string.Empty;

        [Column("telefono")]
        public string Telefono { get; set; } = string.Empty;
    }

    [Table("contactoservicios")]
    public class ContactoServicio
    {
        [Key]
        [Column("id_contacto")]
        public int IdContacto { get; set; }

        [Column("id_servicio")]
        public int IdServicio { get; set; }

        [Column("id_empleado_encargado")]
        public int IdEmpleadoEncargado { get; set; }
    }
}