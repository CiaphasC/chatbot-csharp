using ChatBot.Api.Infrastructure.Options;

namespace ChatBot.Api.Infrastructure.Chat;

/// <summary>
/// Proveedor basado en respuestas locales sin IA. Fallback cuando no hay Supabase disponible.
/// </summary>
public class ChatProviderMock : IChatProvider
{
    private readonly List<BotReply> _replies;

    public ChatProviderMock(IOptions<ChatSettings> settings)
    {
        _replies = new List<BotReply>
        {
            new("citas_info", "Puedo ayudarte a ver o agendar una cita. Indica servicio, fecha y hora que prefieres.", new[]{"cita","agendar","agenda","disponible"}),
            new("servicios_info", "Servicios disponibles: Consulta General, Seguimiento y Diagnóstico. ¿Cuál necesitas?", new[]{"servicio","servicios","consulta","diagnostico","diagnóstico","seguimiento"}),
            new("disponibilidad", "Indica servicio, fecha y hora y verifico si hay disponibilidad en la agenda.", new[]{"disponibilidad","horario","agenda","hora libre","libre"}),
            new("cancelacion", "Cancelaciones hasta 24h antes. Indica fecha/hora y servicio para procesar.", new[]{"cancelar","cancelación","anular"}),
            new("reagendar", "Para reagendar, dime la fecha/hora actual y la nueva preferida.", new[]{"reagendar","cambiar hora","mover cita","modificar cita"}),
            new("pagos", "Aceptamos tarjeta, pago en línea y efectivo en sitio. ¿Cuál prefieres?", new[]{"pago","pagos","pagar","factura","facturación","facturacion","efectivo","tarjeta"}),
            new("ubicacion", "Nuestra dirección está en tu panel. Si necesitas mapa o referencias, avísame.", new[]{"ubicación","direccion","dirección","mapa"}),
            new("recordatorio", "Podemos enviar recordatorios por correo. Indica la cita que quieres recordar.", new[]{"recordatorio","recordatorios","avisar","notificación"}),
            new("saludo", "¡Hola! Soy tu asistente. Pregúntame por citas, servicios o pagos y te ayudo.", new[]{"hola","buenas","saludo","hey"}),
            new("fallback", "No encontré coincidencia. Pregunta por citas, servicios, pagos o ubicación y te respondo.", new[]{"?"})
        };
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
            Content: BuildReply(request.Message),
            CreatedAt: DateTimeOffset.UtcNow
        );

        return Task.FromResult(new ChatResponse(
            ConversationId: Guid.NewGuid().ToString(),
            UserMessage: userMessage,
            AssistantMessage: assistantMessage
        ));
    }

    private string BuildReply(string input)
    {
        var scored = _replies
            .Select(r => new { r.Reply, Score = r.Keywords.Count(k => input.Contains(k, StringComparison.OrdinalIgnoreCase)) })
            .OrderByDescending(x => x.Score)
            .FirstOrDefault();

        if (scored is not null && scored.Score > 0)
            return scored.Reply;

        return "No encontré coincidencia. Pregunta por citas, servicios, pagos o ubicación y te respondo.";
    }

    private record BotReply(string Intent, string Reply, IEnumerable<string> Keywords)
    {
        public List<string> Keywords { get; } = Keywords.ToList();
    }
}
