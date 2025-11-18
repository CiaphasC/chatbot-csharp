using ChatBot.Api.Application.Results;
using ChatBot.Api.Domain.Models;
using System.Globalization;

namespace ChatBot.Api.Infrastructure.Appointments;

public interface IAppointmentService
{
    Task<Result<Appointment>> ScheduleAsync(CreateAppointmentRequest req);
    Task<Result<bool>> CheckAvailabilityAsync(CheckAvailabilityRequest req);
    Task<Result<bool>> CancelAsync(Guid appointmentId, Guid requesterId, bool isAdmin);
}

public record CreateAppointmentRequest(Guid ClientId, Guid ServiceId, string Date, string Time);
public record CheckAvailabilityRequest(Guid ServiceId, string Date, string Time);

public class AppointmentService : IAppointmentService
{
    private readonly AppDataStore _db;
    private readonly object _lock = new();

    public AppointmentService(AppDataStore db)
    {
        _db = db;
    }

    public Task<Result<Appointment>> ScheduleAsync(CreateAppointmentRequest req)
    {
        if (!DateOnly.TryParse(req.Date, CultureInfo.InvariantCulture, DateTimeStyles.None, out var date))
        {
            return Task.FromResult(Result<Appointment>.Failure("Fecha inválida. Usa formato YYYY-MM-DD."));
        }

        if (!TimeSpan.TryParse(req.Time, out var time))
        {
            return Task.FromResult(Result<Appointment>.Failure("Hora inválida. Usa formato HH:mm."));
        }

        if (!_db.Services.Any(s => s.Id == req.ServiceId))
            return Task.FromResult(Result<Appointment>.Failure("Servicio no encontrado."));

        if (!_db.Clients.Any(c => c.Id == req.ClientId))
            return Task.FromResult(Result<Appointment>.Failure("Cliente no encontrado."));

        var duration = _db.Services.First(s => s.Id == req.ServiceId).DurationMinutes;
        var endTime = time + TimeSpan.FromMinutes(duration);

        lock (_lock)
        {
            var overlaps = _db.Appointments.Any(a =>
                a.Date == date &&
                TimeRangesOverlap(time, endTime, a.Time, a.Time + a.Duration));

            if (overlaps)
                return Task.FromResult(Result<Appointment>.Failure("La franja horaria ya está ocupada."));

            var created = _db.AddAppointment(req.ClientId, req.ServiceId, date, time, duration);
            return Task.FromResult(Result<Appointment>.Success(created));
        }
    }

    public Task<Result<bool>> CheckAvailabilityAsync(CheckAvailabilityRequest req)
    {
        if (!DateOnly.TryParse(req.Date, CultureInfo.InvariantCulture, DateTimeStyles.None, out var date))
            return Task.FromResult(Result<bool>.Failure("Fecha inválida. Usa formato YYYY-MM-DD."));
        if (!TimeSpan.TryParse(req.Time, out var time))
            return Task.FromResult(Result<bool>.Failure("Hora inválida. Usa formato HH:mm."));
        if (!_db.Services.Any(s => s.Id == req.ServiceId))
            return Task.FromResult(Result<bool>.Failure("Servicio no encontrado."));

        var duration = _db.Services.First(s => s.Id == req.ServiceId).DurationMinutes;
        var end = time + TimeSpan.FromMinutes(duration);
        var overlaps = _db.Appointments.Any(a =>
            a.Date == date &&
            TimeRangesOverlap(time, end, a.Time, a.Time + a.Duration));

        return Task.FromResult(Result<bool>.Success(!overlaps));
    }

    public Task<Result<bool>> CancelAsync(Guid appointmentId, Guid requesterId, bool isAdmin)
    {
        lock (_lock)
        {
            var appt = _db.Appointments.FirstOrDefault(a => a.Id == appointmentId);
            if (appt is null) return Task.FromResult(Result<bool>.Failure("Cita no encontrada"));
            if (!isAdmin && appt.ClientId != requesterId) return Task.FromResult(Result<bool>.Failure("No autorizado"));

            _db.Appointments.Remove(appt);
            return Task.FromResult(Result<bool>.Success(true));
        }
    }

    private static bool TimeRangesOverlap(TimeSpan start1, TimeSpan end1, TimeSpan start2, TimeSpan end2)
    {
        return start1 < end2 && start2 < end1;
    }
}
