namespace ChatBot.Api.Domain.Models;

public record ChatRequest(string UserId, string Message);

public record ChatMessage(string Id, string Sender, string Content, DateTimeOffset CreatedAt);

public record ChatResponse(string ConversationId, ChatMessage UserMessage, ChatMessage AssistantMessage);
