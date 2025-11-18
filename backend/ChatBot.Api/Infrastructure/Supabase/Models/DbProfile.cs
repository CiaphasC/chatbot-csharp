using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace ChatBot.Api.Infrastructure.Supabase.Models;

[Table("profiles")]
public class DbProfile : BaseModel
{
    [PrimaryKey("id")]
    public Guid Id { get; set; }

    [Column("full_name")]
    public string FullName { get; set; } = string.Empty;

    [Column("email")]
    public string Email { get; set; } = string.Empty;

    [Column("role")]
    public string Role { get; set; } = "client";

    [Column("status")]
    public string Status { get; set; } = "pending";
}
