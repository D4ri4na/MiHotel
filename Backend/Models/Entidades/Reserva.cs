using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MiHotelBackend.Models
{
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
}