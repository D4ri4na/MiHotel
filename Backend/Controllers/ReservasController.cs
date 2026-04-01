using Microsoft.AspNetCore.Mvc;
using MiHotelBackend.Models.DTOs;
using MiHotelBackend.Repositories.Interfaces;
using MiHotelBackend.Services.Interfaces;

namespace MiHotelBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservasController : ControllerBase
    {
        private readonly IReservaRepository _repo;
        private readonly IReservaService _service;

        public ReservasController(IReservaRepository repo, IReservaService service)
        {
            _repo = repo;
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetReservas()
        {
            var reservas = await _repo.GetAllReservasAsync();
            return Ok(reservas);
        }

        [HttpPost]
        public async Task<IActionResult> CrearReserva([FromBody] ReservaCreateDto dto)
        {
            try
            {
                var reserva = await _service.CrearReservaAsync(dto.IdHuespedTitular, dto.IdHabitacion, dto.FechaIngreso, dto.FechaSalida, dto.CantidadPersonas);
                return Ok(reserva);
            }
            catch (Exception ex)
            {
                // Extraemos el error oculto de la base de datos
                string detalle = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return BadRequest(new { error = detalle });
            }
        }

        [HttpPost("{id}/checkin")]
        public async Task<IActionResult> CheckIn(int id)
        {
            try
            {
                var reserva = await _service.RegistrarCheckinAsync(id);
                return Ok(new { mensaje = "Check-in exitoso", reserva });
            }
            catch (Exception ex)
            {
                string detalle = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return BadRequest(new { error = detalle });
            }
        }

        [HttpPost("{id}/checkout")]
        public async Task<IActionResult> CheckOut(int id, [FromBody] DateTime fechaSalida)
        {
            try
            {
                var reserva = await _service.RegistrarCheckoutAsync(id, fechaSalida);
                return Ok(new { mensaje = "Check-out exitoso", reserva });
            }
            catch (Exception ex)
            {
                string detalle = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return BadRequest(new { error = detalle });
            }
        }
    }
}