using ChatBot.Api.Domain.Models;
using ChatBot.Api.Infrastructure.Chat;
using ChatBot.Api.Infrastructure.Options;
using ChatBot.Api.Infrastructure.Supabase.Models;
using Microsoft.Extensions.Options;
using Supabase;

namespace ChatBot.Api.Infrastructure.Supabase;

/// <summary>
/// Proveedor de chat que persiste mensajes en Supabase (tabla chat_messages).
/// <para>
/// Aún devuelve la respuesta mock; sustituye BuildMockReply por tu LLM o servicio externo.
/// </para>
/// </summary>
public class SupabaseChatProvider : IChatProvider
{
    private readonly SupabaseClientProvider _clientProvider;
    private readonly ChatSettings _settings;

    public SupabaseChatProvider(SupabaseClientProvider clientProvider, IOptions<ChatSettings> settings)
    {
        _clientProvider = clientProvider;
        _settings = settings.Value;
    }

    public async Task<ChatResponse> ReplyAsync(ChatRequest request)
    {
        var client = await _clientProvider.GetClientAsync();

        var userMessage = new ChatMessage(
            Id: Guid.NewGuid().ToString(),
            Sender: "user",
            Content: request.Message,
            CreatedAt: DateTimeOffset.UtcNow
        );

        var assistantMessage = new ChatMessage(
            Id: Guid.NewGuid().ToString(),
            Sender: "assistant",
            Content: await BuildReplyAsync(client, request.Message),
            CreatedAt: DateTimeOffset.UtcNow
        );

        // Persistir ambos mensajes
        var dbRows = new List<DbChatMessage>
        {
            new()
            {
                Id = Guid.Parse(userMessage.Id),
                UserId = Guid.TryParse(request.UserId, out var uid) ? uid : null,
                Sender = userMessage.Sender,
                Content = userMessage.Content,
                CreatedAt = userMessage.CreatedAt
            },
            new()
            {
                Id = Guid.Parse(assistantMessage.Id),
                UserId = Guid.TryParse(request.UserId, out var uid2) ? uid2 : null,
                Sender = assistantMessage.Sender,
                Content = assistantMessage.Content,
                CreatedAt = assistantMessage.CreatedAt
            }
        };

        await client.From<DbChatMessage>().Insert(dbRows);

        return new ChatResponse(
            ConversationId: Guid.NewGuid().ToString(),
            UserMessage: userMessage,
            AssistantMessage: assistantMessage
        );
    }

    private static async Task<string> BuildReplyAsync(Client client, string input)
    {
        // Busca coincidencias simples en bot_responses (keywords contiene el texto)
        var rows = await client.From<DbBotResponse>().Get();
        var ordered = rows.Models
            .Select(r => new
            {
                r.Reply,
                Score = r.Keywords.Any(k => input.Contains(k, StringComparison.OrdinalIgnoreCase)) ? 1 : 0
            })
            .OrderByDescending(x => x.Score)
            .FirstOrDefault();

        if (ordered is not null && ordered.Score > 0)
            return ordered.Reply;

        return $"Recibí tu mensaje: \"{input}\". No encontré coincidencias; agrega respuestas en la tabla bot_responses.";
    }
}
