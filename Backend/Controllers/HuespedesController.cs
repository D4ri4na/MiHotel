using Microsoft.AspNetCore.Mvc;
using MiHotelBackend.Models;
using MiHotelBackend.Repositories;

namespace MiHotelBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HuespedesController : ControllerBase
    {
        private readonly IHotelRepository _repo;

        public HuespedesController(IHotelRepository repo)
        {
            _repo = repo;
        }

        // Responde a: GET /api/Huespedes
        [HttpGet]
        public async Task<IActionResult> GetHuespedes()
        {
            var huespedes = await _repo.GetAllHuespedesAsync();
            return Ok(huespedes);
        }

        // Responde a: POST /api/Huespedes (Desde tu modal de JavaScript)
        [HttpPost]
        public async Task<IActionResult> CrearHuesped([FromBody] Huesped huesped)
        {
            try
            {
                // Validación: Evitar CI duplicado (Criterio de Aceptación HU-01)
                var existente = await _repo.GetHuespedByCIAsync(huesped.CI);
                if (existente != null) return BadRequest(new { error = "Ya existe un huésped con este CI." });

                var nuevoHuesped = await _repo.AddHuespedAsync(huesped);
                return Ok(nuevoHuesped);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}