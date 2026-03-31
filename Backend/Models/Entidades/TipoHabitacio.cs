using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MiHotelBackend.Models
{
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
}