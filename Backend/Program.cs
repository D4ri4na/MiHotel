using Microsoft.EntityFrameworkCore;
using MiHotelBackend.Data;
using MiHotelBackend.Repositories.Interfaces;
using MiHotelBackend.Repositories.Implementations;
using MiHotelBackend.Services;
using MiHotelBackend.Services.Interfaces;

// 👇 ESTA ES LA LÍNEA MÁGICA QUE SOLUCIONA EL ERROR DE LAS FECHAS EN POSTGRESQL 👇
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

builder.Services.AddDbContext<HotelDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IHuespedRepository, HuespedRepository>();
builder.Services.AddScoped<IReservaRepository, ReservaRepository>();
builder.Services.AddScoped<IHabitacionRepository, HabitacionRepository>();
builder.Services.AddScoped<IServicioRepository, ServicioRepository>();

builder.Services.AddScoped<IReservaService, ReservaService>();
builder.Services.AddScoped<HabitacionFactory>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<HotelDbContext>();
    dbContext.Database.EnsureCreated();
}

app.UseSwagger();
app.UseSwaggerUI();

app.MapGet("/", () => Results.Redirect("/swagger"));

app.UseCors();
app.UseAuthorization();
app.MapControllers();

app.Run();