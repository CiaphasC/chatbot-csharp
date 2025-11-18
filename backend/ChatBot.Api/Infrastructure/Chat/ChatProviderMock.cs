using ChatBot.Api.Domain.Models;
using ChatBot.Api.Infrastructure.Options;
using Microsoft.Extensions.Options;

namespace ChatBot.Api.Infrastructure.Chat;

public interface IChatProvider
{
    Task<ChatResponse> ReplyAsync(ChatRequest request);
}

/// <summary>
/// Proveedor mock; sustituir por implementación real (OpenAI/Azure/LLM propio).
/// </summary>
public class ChatProviderMock : IChatProvider
{
    private readonly ChatSettings _settings;

    public ChatProviderMock(IOptions<ChatSettings> settings)
    {
        _settings = settings.Value;
    }

    public Task<ChatResponse> ReplyAsync(ChatRequest request)
    {
        var userMessage = new ChatMessage(
            Id: Guid.NewGuid().ToString(),
            Sender: "user",
            Content: request.Message,
            CreatedAt: DateTimeOffset.UtcNow
        );

        var assistantMessage = new ChatMessage(
            Id: Guid.NewGuid().ToString(),
            Sender: "assistant",
            Content: BuildMockReply(request.Message),
            CreatedAt: DateTimeOffset.UtcNow
        );

        return Task.FromResult(new ChatResponse(
            ConversationId: Guid.NewGuid().ToString(),
            UserMessage: userMessage,
            AssistantMessage: assistantMessage
        ));
    }

    private static string BuildMockReply(string input)
    {
        if (input.Contains("cita", StringComparison.OrdinalIgnoreCase))
            return "Puedo ayudarte a gestionar citas. Sustituye ChatProviderMock por el proveedor real y persiste en Supabase.";
        if (input.Contains("emplead", StringComparison.OrdinalIgnoreCase))
            return "Los empleados se devolverán desde Supabase; este es un mock.";
        if (input.Contains("servicio", StringComparison.OrdinalIgnoreCase))
            return "Servicios vienen del catálogo Supabase; integra tu provider real aquí.";

        return $"Recibí tu mensaje: \"{input}\". Integra tu LLM en ChatProviderMock o crea otro proveedor.";
    }
}
