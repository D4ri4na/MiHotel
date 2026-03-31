using Microsoft.AspNetCore.Mvc;
using MiHotelBackend.Models;
using MiHotelBackend.Repositories.Interfaces;

namespace MiHotelBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HuespedesController : ControllerBase
    {
        private readonly IHuespedRepository _repo;

        public HuespedesController(IHuespedRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetHuespedes()
        {
            var huespedes = await _repo.GetAllHuespedesAsync();
            return Ok(huespedes);
        }

        [HttpPost]
        public async Task<IActionResult> RegistrarHuesped([FromBody] Huesped huesped)
        {
            var existente = await _repo.GetHuespedByCIAsync(huesped.CI);
            if (existente != null) return BadRequest(new { error = "El CI ya está registrado en el sistema." });

            var nuevo = await _repo.AddHuespedAsync(huesped);
            return Ok(nuevo);
        }
    }
}