namespace ChatBot.Api.Domain.Models;

/// <summary>
/// Representa un usuario básico (empleado o cliente).
/// </summary>
public record Person(Guid Id, string FullName, string Email, string? Role);
