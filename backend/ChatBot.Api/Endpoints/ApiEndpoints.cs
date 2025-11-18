using ChatBot.Api.Application.Results;
using ChatBot.Api.Domain.Models;
using ChatBot.Api.Infrastructure;
using ChatBot.Api.Infrastructure.Appointments;
using ChatBot.Api.Infrastructure.Chat;
using ChatBot.Api.Infrastructure.Options;
using Microsoft.Extensions.Options;

namespace ChatBot.Api.Endpoints;

public static class ApiEndpoints
{
    public static RouteGroupBuilder MapApi(this IEndpointRouteBuilder app)
    {
        var api = app.MapGroup("/api");

        api.MapGet("/clients", (AppDataStore db, HttpContext ctx) =>
        {
            if (!IsAdmin(ctx)) return Results.Forbid();
            return Results.Ok(db.Clients);
        });
        api.MapPost("/clients", (CreatePersonRequest req, AppDataStore db, HttpContext ctx) =>
        {
            if (!IsAdmin(ctx)) return Results.Forbid();
            var client = db.AddClient(req.FullName, req.Email);
            return Results.Created($"/api/clients/{client.Id}", client);
        });

        api.MapGet("/services", (AppDataStore db) => Results.Ok(db.Services)); // lectura pública
        api.MapPost("/services", async (CreateServiceRequest req, AppDataStore db, HttpContext ctx, SupabaseClientProvider supa) =>
        {
            if (!IsAdmin(ctx)) return Results.Forbid();
            if (req.DurationMinutes <= 0) return Results.BadRequest(new { error = "DurationMinutes must be > 0" });
            var hasSupabase = HasSupabase();
            if (hasSupabase)
            {
                var client = await supa.GetClientAsync();
                var insert = new Infrastructure.Supabase.Models.DbService
                {
                    Id = Guid.NewGuid(),
                    Name = req.Name,
                    DurationMinutes = req.DurationMinutes,
                    Description = req.Description
                };
                var res = await client.From<Infrastructure.Supabase.Models.DbService>().Insert(insert);
                return Results.Created($"/api/services/{insert.Id}", res.Models.First());
            }
            else
            {
                var service = db.AddService(req.Name, req.DurationMinutes, req.Description);
                return Results.Created($"/api/services/{service.Id}", service);
            }
        });

        api.MapPut("/services/{id:guid}", async (Guid id, CreateServiceRequest req, AppDataStore db, HttpContext ctx, SupabaseClientProvider supa) =>
        {
            if (!IsAdmin(ctx)) return Results.Forbid();
            if (req.DurationMinutes <= 0) return Results.BadRequest(new { error = "DurationMinutes must be > 0" });
            if (HasSupabase())
            {
                var client = await supa.GetClientAsync();
                var res = await client.From<Infrastructure.Supabase.Models.DbService>()
                    .Where(s => s.Id == id)
                    .Update(new { name = req.Name, duration_minutes = req.DurationMinutes, description = req.Description });
                if (!res.Models.Any()) return Results.NotFound();
                return Results.Ok(res.Models.First());
            }
            else
            {
                var svc = db.Services.FirstOrDefault(s => s.Id == id);
                if (svc is null) return Results.NotFound();
                db.Services.Remove(svc);
                db.Services.Add(new Domain.Models.Service(id, req.Name, req.DurationMinutes, req.Description));
                return Results.Ok();
            }
        });

        api.MapDelete("/services/{id:guid}", async (Guid id, AppDataStore db, HttpContext ctx, SupabaseClientProvider supa) =>
        {
            if (!IsAdmin(ctx)) return Results.Forbid();
            if (HasSupabase())
            {
                var client = await supa.GetClientAsync();
                await client.From<Infrastructure.Supabase.Models.DbService>().Where(s => s.Id == id).Delete();
                return Results.Ok();
            }
            else
            {
                db.Services.RemoveAll(s => s.Id == id);
                return Results.Ok();
            }
        });

        api.MapGet("/appointments", async (AppDataStore db, string? date, HttpContext ctx, SupabaseClientProvider supa) =>
        {
            if (!IsAuthenticated(ctx)) return Results.Unauthorized();
            var userId = GetUserGuid(ctx);

            if (HasSupabase())
            {
                var client = await supa.GetClientAsync();
                var apptsQuery = client.From<Infrastructure.Supabase.Models.DbAppointment>();
                if (!string.IsNullOrEmpty(date))
                {
                    if (DateOnly.TryParse(date, out var d))
                    {
                        var start = DateTime.SpecifyKind(DateTime.Parse($"{d:yyyy-MM-dd}T00:00:00Z"), DateTimeKind.Utc);
                        var end = start.AddDays(1);
                        apptsQuery.Where(a => a.StartAt >= start && a.StartAt < end);
                    }
                }
                if (!IsAdmin(ctx) && userId is not null)
                {
                    apptsQuery.Where(a => a.ClientId == userId.Value);
                }

                var appts = (await apptsQuery.Get()).Models;
                var clientIds = appts.Select(a => a.ClientId).Distinct().ToList();
                var serviceIds = appts.Select(a => a.ServiceId).Distinct().ToList();

                var profiles = (await client.From<Infrastructure.Supabase.Models.DbProfile>().In("id", clientIds)).Models;
                var services = (await client.From<Infrastructure.Supabase.Models.DbService>().In("id", serviceIds)).Models;

                var result = appts.Select(a => new
                {
                    a.Id,
                    a.ClientId,
                    a.ServiceId,
                    a.StartAt,
                    a.EndAt,
                    a.Status,
                    client_name = profiles.FirstOrDefault(p => p.Id == a.ClientId)?.FullName,
                    service_name = services.FirstOrDefault(s => s.Id == a.ServiceId)?.Name,
                });

                return Results.Ok(result);
            }
            else
            {
                IEnumerable<Domain.Models.Appointment> list = db.Appointments;
                if (!string.IsNullOrEmpty(date) && DateOnly.TryParse(date, out var d))
                {
                    list = list.Where(a => a.Date == d);
                }
                if (!IsAdmin(ctx) && userId is not null)
                {
                    list = list.Where(a => a.ClientId == userId.Value);
                }

                var clients = db.Clients;
                var servicesMem = db.Services;

                var result = list.Select(a => new
                {
                    id = a.Id,
                    client_id = a.ClientId,
                    service_id = a.ServiceId,
                    start_at = a.Date.ToString("yyyy-MM-dd") + "T" + a.Time,
                    end_at = (DateTimeOffset.UtcNow).ToString("o"),
                    status = a.Status,
                    client_name = clients.FirstOrDefault(c => c.Id == a.ClientId)?.FullName,
                    service_name = servicesMem.FirstOrDefault(s => s.Id == a.ServiceId)?.Name,
                });

                return Results.Ok(result);
            }
        });

        api.MapPost("/appointments", async (CreateAppointmentRequest req, IAppointmentService svc, HttpContext ctx) =>
        {
            // cliente: debe coincidir client_id con auth.user
            if (!IsAdmin(ctx) && !UserMatches(ctx, req.ClientId))
                return Results.Forbid();

            var result = await svc.ScheduleAsync(req);
            return result.Match(
                success => Results.Created($"/api/appointments/{success.Id}", success),
                error => Results.BadRequest(new { error })
            );
        });

        api.MapPost("/appointments/check", async (CheckAvailabilityRequest req, IAppointmentService svc, HttpContext ctx) =>
        {
            if (!IsAdmin(ctx)) return Results.Forbid();
            var result = await svc.CheckAvailabilityAsync(req);
            return result.Match(
                success => Results.Ok(new { available = success }),
                error => Results.BadRequest(new { error })
            );
        });

        api.MapDelete("/appointments/{id:guid}", async (Guid id, IAppointmentService svc, HttpContext ctx) =>
        {
            if (!IsAuthenticated(ctx)) return Results.Unauthorized();
            var uidStr = GetUserId(ctx);
            if (uidStr is null) return Results.Unauthorized();
            var uid = Guid.Parse(uidStr);
            var result = await svc.CancelAsync(id, uid, IsAdmin(ctx));
            return result.Match(
                success => Results.Ok(new { canceled = success }),
                error => Results.BadRequest(new { error })
            );
        });

        api.MapPost("/chat", async (ChatRequest req, IChatProvider chatProvider, IOptions<ChatSettings> chatOptions, HttpContext ctx) =>
        {
            // ChatSettings está disponible por si quieres enrutar a un provider diferente
            if (!IsAuthenticated(ctx)) return Results.Unauthorized();
            req = req with { UserId = GetUserId(ctx) ?? req.UserId };
            var response = await chatProvider.ReplyAsync(req);
            return Results.Ok(response);
        });

        api.MapPost("/clients/{id:guid}/approve", async (Guid id, IProfileService profiles) =>
        {
            var result = await profiles.ApproveAsync(id);
            return result.Match(
                success => Results.Ok(success),
                error => Results.BadRequest(new { error })
            );
        });

        api.MapPost("/clients/{id:guid}/reject", async (Guid id, IProfileService profiles) =>
        {
            var result = await profiles.RejectAsync(id);
            return result.Match(
                success => Results.Ok(success),
                error => Results.BadRequest(new { error })
            );
        });

        return api;
    }

    private static bool IsAdmin(HttpContext ctx) =>
        ctx.Items.TryGetValue("ClaimsPrincipal", out var cp) &&
        cp is ClaimsPrincipal principal &&
        principal.Claims.Any(c => c.Type == "role" && c.Value == "admin");

    private static bool IsAuthenticated(HttpContext ctx) =>
        ctx.Items.ContainsKey("UserId");

    private static bool UserMatches(HttpContext ctx, Guid clientId)
    {
        var sub = GetUserId(ctx);
        return sub is not null && Guid.TryParse(sub, out var uid) && uid == clientId;
    }

    private static string? GetUserId(HttpContext ctx) =>
        ctx.Items.TryGetValue("UserId", out var val) ? val?.ToString() : null;

    private static Guid? GetUserGuid(HttpContext ctx)
    {
        var sub = GetUserId(ctx);
        if (sub is null) return null;
        return Guid.TryParse(sub, out var g) ? g : null;
    }

    private static bool HasSupabase() =>
        !string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("SUPABASE_URL")) &&
        !string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("SUPABASE_SERVICE_ROLE_KEY"));
}

public record CreatePersonRequest(string FullName, string Email, string? Role);
public record CreateServiceRequest(string Name, int DurationMinutes, string? Description);

