namespace ChatBot.Api.Domain.Models;

/// <summary>
/// Cita entre un cliente y un empleado para un servicio específico.
/// </summary>
public record Appointment(
    Guid Id,
    Guid ClientId,
    Guid EmployeeId,
    Guid ServiceId,
    DateOnly Date,
    TimeSpan Time,
    TimeSpan Duration,
    string Status);
