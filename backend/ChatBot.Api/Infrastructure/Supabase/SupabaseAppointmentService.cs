using ChatBot.Api.Application.Results;
using ChatBot.Api.Domain.Models;
using ChatBot.Api.Infrastructure.Appointments;
using ChatBot.Api.Infrastructure.Supabase.Models;
using Supabase;
using PostgrestOperator = Supabase.Postgrest.Constants.Operator;

namespace ChatBot.Api.Infrastructure.Supabase;

/// <summary>
/// Implementación de citas contra Supabase (sin empleado asociado).
/// Usa constraint de solape general por servicio/horario.
/// </summary>
public class SupabaseAppointmentService : IAppointmentService
{
    private readonly SupabaseClientProvider _clientProvider;

    public SupabaseAppointmentService(SupabaseClientProvider clientProvider)
    {
        _clientProvider = clientProvider;
    }

    public async Task<Result<Appointment>> ScheduleAsync(CreateAppointmentRequest req)
    {
        var client = await _clientProvider.GetClientAsync();

        var service = await client.From<DbService>().Filter("id", PostgrestOperator.Equals, req.ServiceId).Single();
        if (service == null)
            return Result<Appointment>.Failure("Servicio no encontrado.");

        var startAt = DateTimeOffset.Parse($"{req.Date}T{req.Time}:00Z");
        var endAt = startAt + TimeSpan.FromMinutes(service.DurationMinutes);

        var overlaps = await client
            .From<DbAppointment>()
            .Where(a => a.StartAt < endAt && a.EndAt > startAt)
            .Get();

        if (overlaps.Models.Any())
        {
            return Result<Appointment>.Failure("La franja horaria ya está ocupada.");
        }

        var insert = new DbAppointment
        {
          Id = Guid.NewGuid(),
          ClientId = req.ClientId,
          ServiceId = req.ServiceId,
          StartAt = startAt,
          Status = "confirmada"
        };

        var response = await client.From<DbAppointment>().Insert(insert);
        var created = response.Models.First();

        return Result<Appointment>.Success(new Appointment(
            created.Id,
            created.ClientId,
            created.ServiceId,
            DateOnly.FromDateTime(created.StartAt.UtcDateTime),
            created.StartAt.TimeOfDay,
            TimeSpan.FromMinutes(service.DurationMinutes),
            created.Status));
    }

    public async Task<Result<bool>> CheckAvailabilityAsync(CheckAvailabilityRequest req)
    {
        var client = await _clientProvider.GetClientAsync();

        var service = await client.From<DbService>().Filter("id", PostgrestOperator.Equals, req.ServiceId).Single();
        if (service == null)
            return Result<bool>.Failure("Servicio no encontrado.");

        var startAt = DateTimeOffset.Parse($"{req.Date}T{req.Time}:00Z");
        var endAt = startAt + TimeSpan.FromMinutes(service.DurationMinutes);

        var overlaps = await client
            .From<DbAppointment>()
            .Where(a => a.StartAt < endAt && a.EndAt > startAt)
            .Get();

        return Result<bool>.Success(!overlaps.Models.Any());
    }

    public async Task<Result<bool>> CancelAsync(Guid appointmentId, Guid requesterId, bool isAdmin)
    {
        var client = await _clientProvider.GetClientAsync();
        var appt = await client.From<DbAppointment>().Where(a => a.Id == appointmentId).Single();
        if (appt is null) return Result<bool>.Failure("Cita no encontrada");
        if (!isAdmin && appt.ClientId != requesterId)
            return Result<bool>.Failure("No autorizado");

        await client.From<DbAppointment>().Where(a => a.Id == appointmentId).Delete();
        return Result<bool>.Success(true);
    }
}
