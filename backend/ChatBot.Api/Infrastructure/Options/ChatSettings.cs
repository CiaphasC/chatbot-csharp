namespace ChatBot.Api.Infrastructure.Options;

/// <summary>
/// Configuración para proveedor de chat (llave de LLM, etc.).
/// </summary>
public class ChatSettings
{
    public string? Provider { get; set; } // ej. "openai", "azure", "mock"
    public string? ApiKey { get; set; }
    public string? Endpoint { get; set; }
}
