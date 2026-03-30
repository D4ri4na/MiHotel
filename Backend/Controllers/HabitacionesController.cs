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

        // Responde a: GET /api/Habitaciones
        [HttpGet]
        public async Task<IActionResult> GetHabitaciones()
        {
            var habitaciones = await _repo.GetAllHabitacionesAsync();
            return Ok(habitaciones);
        }
    }
}