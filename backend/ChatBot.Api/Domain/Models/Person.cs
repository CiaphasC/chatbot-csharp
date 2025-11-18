namespace ChatBot.Api.Domain.Models;

/// <summary>
/// Representa un usuario básico (cliente o admin).
/// </summary>
public record Person(Guid Id, string FullName, string Email, string? Role);
