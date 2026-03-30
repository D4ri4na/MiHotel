using Microsoft.AspNetCore.Mvc;
using MiHotelBackend.Services;

namespace MiHotelBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservasController : ControllerBase
    {
        private readonly ReservaService _reservaService;

        public ReservasController(ReservaService reservaService)
        {
            _reservaService = reservaService;
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
    }
}