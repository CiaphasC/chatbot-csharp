using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace ChatBot.Api.Infrastructure.Supabase.Models;

[Table("bot_responses")]
public class DbBotResponse : BaseModel
{
    [PrimaryKey("id")]
    public Guid Id { get; set; }

    [Column("intent")]
    public string Intent { get; set; } = string.Empty;

    [Column("reply")]
    public string Reply { get; set; } = string.Empty;

    [Column("keywords")]
    public List<string> Keywords { get; set; } = new();
}
