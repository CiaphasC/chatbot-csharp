using ChatBot.Api.Endpoints;
using ChatBot.Api.Infrastructure;
using ChatBot.Api.Infrastructure.Appointments;
using ChatBot.Api.Infrastructure.Options;
using ChatBot.Api.Infrastructure.Supabase;
using ChatBot.Api.Infrastructure.Auth;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// CORS para permitir requests desde Vercel y localhost
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "https://*.vercel.app",
            "https://vercel.app"
        )
        .SetIsOriginAllowedToAllowWildcardSubdomains()
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

// JSON limpio
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});

// Binding de configuración
builder.Services.Configure<ChatSettings>(builder.Configuration.GetSection("Chat"));

// Dependencias de dominio
builder.Services.AddSingleton<AppDataStore>();
builder.Services.AddSingleton<SupabaseClientProvider>();
builder.Services.AddMemoryCache();
builder.Services.AddHttpClient();
builder.Services.AddSingleton<IAppointmentService>(sp =>
{
  // Si hay service role, usar Supabase; si no, fallback memoria
  var hasSupabase = !string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("SUPABASE_URL")) &&
                    !string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("SUPABASE_SERVICE_ROLE_KEY"));
  return hasSupabase
    ? new SupabaseAppointmentService(sp.GetRequiredService<SupabaseClientProvider>())
    : new AppointmentService(sp.GetRequiredService<AppDataStore>());
});
builder.Services.AddSingleton<IChatProvider>(sp =>
{
  var hasSupabase = !string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("SUPABASE_URL")) &&
                    !string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("SUPABASE_SERVICE_ROLE_KEY"));
  return hasSupabase
    ? new SupabaseChatProvider(sp.GetRequiredService<SupabaseClientProvider>(), sp.GetRequiredService<IOptions<ChatSettings>>())
    : new ChatProviderMock(sp.GetRequiredService<IOptions<ChatSettings>>());
});
builder.Services.AddSingleton<IProfileService, ProfileService>();

var app = builder.Build();

// Habilitar CORS
app.UseCors("AllowFrontend");

// Middleware JWT Supabase
app.UseMiddleware<SupabaseJwtMiddleware>();

app.MapGet("/health", () => Results.Ok(new { status = "ok", version = "v1" }))
   .WithName("Health");

app.MapApi(); // rutas principales

app.Run();
