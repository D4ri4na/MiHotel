using Microsoft.EntityFrameworkCore;
using MiHotelBackend.Data;
using MiHotelBackend.Repositories;
using MiHotelBackend.Services;

// ESTA ES LA LÍNEA MÁGICA QUE ARREGLA EL PROBLEMA DE LAS FECHAS DE POSTGRESQL
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

var connString = builder.Configuration.GetConnectionString("SupabaseConnection");
builder.Services.AddDbContext<HotelDbContext>(opt => opt.UseNpgsql(connString));

builder.Services.AddScoped<IHotelRepository, HotelRepository>();
builder.Services.AddScoped<HabitacionFactory>();
builder.Services.AddScoped<ReservaService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

app.UseAuthorization();
app.MapControllers();

app.Run();