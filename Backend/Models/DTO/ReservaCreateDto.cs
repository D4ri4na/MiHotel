namespace MiHotelBackend.Models.DTOs
{
    public class ReservaCreateDto
    {
        public int IdHuespedTitular { get; set; }
        public int IdHabitacion { get; set; }
        public DateTime FechaIngreso { get; set; }
        public DateTime FechaSalida { get; set; }
        public int CantidadPersonas { get; set; }
    }
}