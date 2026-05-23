using System;
using System.Threading.Tasks;
using Moq;
using Xunit;
using MiHotelBackend.Models;
using MiHotelBackend.Repositories.Interfaces;
using MiHotelBackend.Services;

namespace Backend.Tests
{
    public class ReservaServiceTests
    {
        //1
        [Fact]
        public async Task CrearReserva_FechaSalidaAnterior_LanzaExcepcion()
        {
            var mockReservaRepo = new Mock<IReservaRepository>();
            var mockHabRepo = new Mock<IHabitacionRepository>();
            var service = new ReservaService(mockReservaRepo.Object, mockHabRepo.Object, null);

            DateTime ingreso = new DateTime(2026, 5, 20);
            DateTime salida = new DateTime(2026, 5, 19); 

            var excepcion = await Assert.ThrowsAsync<Exception>(() =>
                service.CrearReservaAsync(1, 101, ingreso, salida, 2));

            Assert.Equal("La fecha de salida debe ser posterior a la de ingreso.", excepcion.Message);
        }

        //2
        [Fact]
        public async Task RegistrarCheckin_ReservaCancelada_LanzaExcepcion()
        {
            var mockReservaRepo = new Mock<IReservaRepository>();
            var mockHabRepo = new Mock<IHabitacionRepository>();

            mockReservaRepo.Setup(r => r.GetReservaByIdAsync(1))
                           .ReturnsAsync(new Reserva { IdReserva = 1, Estado = "Cancelada" });

            var service = new ReservaService(mockReservaRepo.Object, mockHabRepo.Object, null);

            var excepcion = await Assert.ThrowsAsync<Exception>(() => service.RegistrarCheckinAsync(1));
            Assert.Equal("La reserva está cancelada.", excepcion.Message);
        }

        //3
        [Fact]
        public async Task RegistrarCheckout_ReservaFinalizada_LanzaExcepcion()
        {
            var mockReservaRepo = new Mock<IReservaRepository>();
            var mockHabRepo = new Mock<IHabitacionRepository>();

            mockReservaRepo.Setup(r => r.GetReservaByIdAsync(1))
                           .ReturnsAsync(new Reserva { IdReserva = 1, Estado = "Finalizada" });

            var service = new ReservaService(mockReservaRepo.Object, mockHabRepo.Object, null);

            var excepcion = await Assert.ThrowsAsync<Exception>(() => service.RegistrarCheckoutAsync(1, DateTime.Now));
            Assert.Equal("Esta reserva ya ha sido finalizada.", excepcion.Message);
        }
    }
}