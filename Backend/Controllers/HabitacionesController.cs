using Microsoft.AspNetCore.Mvc;
using MiHotelBackend.Repositories;

namespace MiHotelBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HabitacionesController : ControllerBase
    {
        private readonly IHotelRepository _repo;

        public HabitacionesController(IHotelRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetHabitaciones()
        {
            var habitaciones = await _repo.GetAllHabitacionesAsync();
            return Ok(habitaciones);
        }

        // NUEVO: Endpoint para que el Frontend lea el catálogo y cumpla la HU-05
        [HttpGet("Tipos")]
        public async Task<IActionResult> GetTiposHabitacion()
        {
            var tipos = await _repo.GetAllTiposHabitacionAsync();
            return Ok(tipos);
        }
    }
}