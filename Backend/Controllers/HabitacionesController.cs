using Microsoft.AspNetCore.Mvc;
using MiHotelBackend.Repositories.Interfaces;

namespace MiHotelBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HabitacionesController : ControllerBase
    {
        private readonly IHabitacionRepository _repo;

        public HabitacionesController(IHabitacionRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetHabitaciones()
        {
            var habitaciones = await _repo.GetAllHabitacionesAsync();
            return Ok(habitaciones);
        }

        [HttpGet("Tipos")]
        public async Task<IActionResult> GetTiposHabitacion()
        {
            var tipos = await _repo.GetAllTiposHabitacionAsync();
            return Ok(tipos);
        }
    }
}