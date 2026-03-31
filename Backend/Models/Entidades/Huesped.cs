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
}