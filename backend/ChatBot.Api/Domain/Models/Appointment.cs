namespace ChatBot.Api.Domain.Models;

/// <summary>
/// Cita entre un cliente y un servicio.
/// </summary>
public record Appointment(
    Guid Id,
    Guid ClientId,
    Guid ServiceId,
    DateOnly Date,
    TimeSpan Time,
    TimeSpan Duration,
    string Status);
