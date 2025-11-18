using ChatBot.Api.Endpoints;
using ChatBot.Api.Infrastructure;
using ChatBot.Api.Infrastructure.Appointments;
using ChatBot.Api.Infrastructure.Chat;
using ChatBot.Api.Infrastructure.Options;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// JSON limpio
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});

// Binding de configuración
builder.Services.Configure<ChatSettings>(builder.Configuration.GetSection("Chat"));

// Dependencias de dominio
builder.Services.AddSingleton<AppDataStore>();
builder.Services.AddSingleton<IAppointmentService, AppointmentService>();
builder.Services.AddSingleton<IChatProvider, ChatProviderMock>();

var app = builder.Build();

app.MapGet("/health", () => Results.Ok(new { status = "ok", version = "v1" }))
   .WithName("Health");

app.MapApi(); // rutas principales

app.Run();
