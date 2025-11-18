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

        api.MapGet("/employees", (AppDataStore db) => Results.Ok(db.Employees));
        api.MapPost("/employees", (CreatePersonRequest req, AppDataStore db) =>
        {
            var employee = db.AddEmployee(req.FullName, req.Email, req.Role ?? "Empleado");
            return Results.Created($"/api/employees/{employee.Id}", employee);
        });

        api.MapGet("/clients", (AppDataStore db) => Results.Ok(db.Clients));
        api.MapPost("/clients", (CreatePersonRequest req, AppDataStore db) =>
        {
            var client = db.AddClient(req.FullName, req.Email);
            return Results.Created($"/api/clients/{client.Id}", client);
        });

        api.MapGet("/services", (AppDataStore db) => Results.Ok(db.Services));
        api.MapPost("/services", (CreateServiceRequest req, AppDataStore db) =>
        {
            if (req.DurationMinutes <= 0) return Results.BadRequest(new { error = "DurationMinutes must be > 0" });
            var service = db.AddService(req.Name, req.DurationMinutes, req.Description);
            return Results.Created($"/api/services/{service.Id}", service);
        });

        api.MapGet("/appointments", (AppDataStore db, string? date) =>
        {
            if (!string.IsNullOrEmpty(date) && DateOnly.TryParse(date, out var d))
            {
                return Results.Ok(db.Appointments.Where(a => a.Date == d));
            }
            return Results.Ok(db.Appointments);
        });

        api.MapPost("/appointments", async (CreateAppointmentRequest req, IAppointmentService svc) =>
        {
            var result = await svc.ScheduleAsync(req);
            return result.Match(
                success => Results.Created($"/api/appointments/{success.Id}", success),
                error => Results.BadRequest(new { error })
            );
        });

        api.MapPost("/chat", async (ChatRequest req, IChatProvider chatProvider, IOptions<ChatSettings> chatOptions) =>
        {
            // ChatSettings está disponible por si quieres enrutar a un provider diferente
            var response = await chatProvider.ReplyAsync(req);
            return Results.Ok(response);
        });

        return api;
    }
}

public record CreatePersonRequest(string FullName, string Email, string? Role);
public record CreateServiceRequest(string Name, int DurationMinutes, string? Description);
