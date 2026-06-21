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
            var service = new ReservaService(mockReservaRepo.Object, mockHabRepo.Object, null!);

            DateTime ingreso = new DateTime(2026, 5, 20);
            DateTime salida = new DateTime(2026, 5, 19); 

            var excepcion = await Assert.ThrowsAsync<InvalidOperationException>(() =>
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

            var service = new ReservaService(mockReservaRepo.Object, mockHabRepo.Object, null!);

            var excepcion = await Assert.ThrowsAsync<InvalidOperationException>(() => service.RegistrarCheckinAsync(1));
            Assert.Contains("cancelada", excepcion.Message);
        }

        //3
        [Fact]
        public async Task RegistrarCheckout_ReservaFinalizada_LanzaExcepcion()
        {
            var mockReservaRepo = new Mock<IReservaRepository>();
            var mockHabRepo = new Mock<IHabitacionRepository>();

            mockReservaRepo.Setup(r => r.GetReservaByIdAsync(1))
                           .ReturnsAsync(new Reserva { IdReserva = 1, Estado = "Finalizada" });

            var service = new ReservaService(mockReservaRepo.Object, mockHabRepo.Object, null!);

            var excepcion = await Assert.ThrowsAsync<InvalidOperationException>(() => service.RegistrarCheckoutAsync(1, DateTime.Now));
            Assert.Equal("Esta reserva ya ha sido finalizada.", excepcion.Message);
        }

        // Prueba unitaria de la defensa
        [Fact]
        public void CalcularYAplicarMora_SalidaTardeMismoDia_AplicaRecargoDel50PorCiento()
        {
            var reserva = new Reserva
            {
                FechaSalida = new DateTime(2026, 5, 20, 10, 0, 0) 
            };
            DateTime checkoutEfectivo = new DateTime(2026, 5, 20, 14, 0, 0);
            decimal precioBaseHabitacion = 100m;

            reserva.CalcularYAplicarMora(checkoutEfectivo, precioBaseHabitacion);

            Assert.Equal(50m, reserva.MontoLateCheckout); 
        }

        //EF
        [Fact]
        public void CalcularTotalEstadia_DebeRetornarMontoCorrecto_ParaMultiplesNoches()
        {
            var reservaService = new ReservaService(null!, null!, null!);
            var checkIn = new DateTime(2026, 7, 1);
            var checkOut = new DateTime(2026, 7, 4); 
            decimal tarifaPorNoche = 50m;

            var total = reservaService.CalcularTotalEstadia(checkIn, checkOut, tarifaPorNoche);

            Assert.Equal(150m, total);
        }

        [Fact]
        public void ConfirmarReserva_HabitacionNoDisponible_DebeLanzarExcepcion()
        {
            var reservaService = new ReservaService(null!, null!, null!); 
            var habitacionOcupada = new Habitacion { Estado = "Ocupada" }; 
            var nuevaReserva = new Reserva();

            Assert.Throws<InvalidOperationException>(() => 
                reservaService.ValidarDisponibilidad(habitacionOcupada, nuevaReserva)
            );
        }
    }
}