using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MiHotelBackend.Models
{
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
}