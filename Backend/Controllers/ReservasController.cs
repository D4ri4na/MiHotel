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
        private readonly IHotelRepository _repo; // Agregamos el repositorio para la lectura directa

        public ReservasController(ReservaService reservaService, IHotelRepository repo)
        {
            _reservaService = reservaService;
            _repo = repo;
        }

        // NUEVO: Responde a GET /api/Reservas
        [HttpGet]
        public async Task<IActionResult> GetReservas()
        {
            var reservas = await _repo.GetAllReservasAsync();
            return Ok(reservas);
        }

        // Mantenemos intacto tu endpoint de Checkout (HU-08)
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
    }
}