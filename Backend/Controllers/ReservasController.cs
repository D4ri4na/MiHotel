using Microsoft.AspNetCore.Mvc;
using MiHotelBackend.Services;
using MiHotelBackend.Repositories;

namespace MiHotelBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservasController : ControllerBase
    {
        private readonly ReservaService _reservaService;
        private readonly IHotelRepository _repo;

        public ReservasController(ReservaService reservaService, IHotelRepository repo)
        {
            _reservaService = reservaService;
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetReservas()
        {
            var reservas = await _repo.GetAllReservasAsync();
            return Ok(reservas);
        }

        // Endpoint para crear reserva
        [HttpPost]
        public async Task<IActionResult> CrearReserva([FromBody] NuevaReservaDto dto)
        {
            try
            {
                var reserva = await _reservaService.CrearReservaAsync(
                    dto.IdHuespedTitular, dto.IdHabitacion, dto.FechaIngreso, dto.FechaSalida, dto.CantidadPersonas);
                return Ok(reserva);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("{id}/checkout")]
        public async Task<IActionResult> Checkout(int id, [FromBody] DateTime fechaSalida)
        {
            try
            {
                var resultado = await _reservaService.RegistrarCheckoutAsync(id, fechaSalida);
                return Ok(new { mensaje = "Check-out exitoso", reserva = resultado });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
        // HU-04: Endpoint para Check-in
        [HttpPost("{id}/checkin")]
        public async Task<IActionResult> Checkin(int id)
        {
            try
            {
                var resultado = await _reservaService.RegistrarCheckinAsync(id);
                return Ok(new { mensaje = "Check-in exitoso", reserva = resultado });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }

    public class NuevaReservaDto
    {
        public int IdHuespedTitular { get; set; }
        public int IdHabitacion { get; set; }
        public DateTime FechaIngreso { get; set; }
        public DateTime FechaSalida { get; set; }
        public int CantidadPersonas { get; set; }
    }
}