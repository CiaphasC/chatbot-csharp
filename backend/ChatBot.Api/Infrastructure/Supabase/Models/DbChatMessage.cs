using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace ChatBot.Api.Infrastructure.Supabase.Models;

[Table("chat_messages")]
public class DbChatMessage : BaseModel
{
    [PrimaryKey("id")]
    public Guid Id { get; set; }

    [Column("user_id")]
    public Guid? UserId { get; set; }

    [Column("sender")]
    public string Sender { get; set; } = string.Empty;

    [Column("content")]
    public string Content { get; set; } = string.Empty;

    [Column("created_at")]
    public DateTimeOffset CreatedAt { get; set; }
}
