using Microsoft.AspNetCore.Mvc;
using MiHotelBackend.Repositories;

namespace MiHotelBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiciosController : ControllerBase
    {
        private readonly IHotelRepository _repo;

        public ServiciosController(IHotelRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetServicios()
        {
            var servicios = await _repo.GetContactosServiciosAsync();
            return Ok(servicios);
        }
    }
}