using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace ChatBot.Api.Infrastructure.Supabase.Models;

[Table("services")]
public class DbService : BaseModel
{
    [PrimaryKey("id")]
    public Guid Id { get; set; }

    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Column("duration_minutes")]
    public int DurationMinutes { get; set; }

    [Column("description")]
    public string? Description { get; set; }
}
