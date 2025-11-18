using ChatBot.Api.Domain.Models;

namespace ChatBot.Api.Infrastructure.Chat;

public interface IChatProvider
{
    Task<ChatResponse> ReplyAsync(ChatRequest request);
}
