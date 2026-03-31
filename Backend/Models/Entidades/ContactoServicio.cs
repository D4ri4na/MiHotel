using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MiHotelBackend.Models
{
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