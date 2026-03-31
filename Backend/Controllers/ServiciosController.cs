using Microsoft.AspNetCore.Mvc;
using MiHotelBackend.Repositories.Interfaces;

namespace MiHotelBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiciosController : ControllerBase
    {
        private readonly IServicioRepository _repo;

        public ServiciosController(IServicioRepository repo)
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