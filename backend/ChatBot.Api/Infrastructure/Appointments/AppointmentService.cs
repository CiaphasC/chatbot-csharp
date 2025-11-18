using ChatBot.Api.Application.Results;
using ChatBot.Api.Domain.Models;
using ChatBot.Api.Infrastructure.Options;
using System.Globalization;

namespace ChatBot.Api.Infrastructure.Appointments;

public interface IAppointmentService
{
    Task<Result<Appointment>> ScheduleAsync(CreateAppointmentRequest req);
}

public record CreateAppointmentRequest(Guid ClientId, Guid EmployeeId, Guid ServiceId, string Date, string Time);

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

        if (!_db.Employees.Any(e => e.Id == req.EmployeeId))
            return Task.FromResult(Result<Appointment>.Failure("Empleado no encontrado."));

        var duration = _db.Services.First(s => s.Id == req.ServiceId).DurationMinutes;
        var endTime = time + TimeSpan.FromMinutes(duration);

        lock (_lock)
        {
          var overlaps = _db.Appointments.Any(a =>
              a.EmployeeId == req.EmployeeId &&
              a.Date == date &&
              TimeRangesOverlap(time, endTime, a.Time, a.Time + a.Duration));

          if (overlaps)
              return Task.FromResult(Result<Appointment>.Failure("La franja horaria ya está ocupada para este empleado."));

          var created = _db.AddAppointment(req.ClientId, req.EmployeeId, req.ServiceId, date, time, duration);
          return Task.FromResult(Result<Appointment>.Success(created));
        }
    }

    private static bool TimeRangesOverlap(TimeSpan start1, TimeSpan end1, TimeSpan start2, TimeSpan end2)
    {
        return start1 < end2 && start2 < end1;
    }
}
