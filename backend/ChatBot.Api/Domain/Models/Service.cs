namespace ChatBot.Api.Domain.Models;

/// <summary>
/// Tipo de servicio que puede ofrecer la organización.
/// </summary>
public record Service(Guid Id, string Name, int DurationMinutes, string? Description);
