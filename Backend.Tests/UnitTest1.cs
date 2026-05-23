using Xunit;

namespace Backend.Tests
{
    public class DummyTest
    {
        [Fact]
        public void PruebaBase_ParaReporteCero()
        {
            // Al igual que en el frontend, esta prueba es "tonta".
            // Se ejecuta correctamente, pero como no llama a ningún Servicio de tu Backend,
            // Coverlet detectará que el código de tu negocio tiene 0% de uso.
            Assert.True(true);
        }
    }
}