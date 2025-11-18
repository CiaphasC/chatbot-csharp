using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace ChatBot.Api.Infrastructure.Supabase.Models;

[Table("appointments")]
public class DbAppointment : BaseModel
{
    [PrimaryKey("id")]
    public Guid Id { get; set; }

    [Column("client_id")]
    public Guid ClientId { get; set; }

    [Column("service_id")]
    public Guid ServiceId { get; set; }

    [Column("start_at")]
    public DateTimeOffset StartAt { get; set; }

    // end_at es generado en DB; lo marcamos opcional para lectura
    [Column("end_at")]
    public DateTimeOffset? EndAt { get; set; }

    [Column("status")]
    public string Status { get; set; } = "pending";

    [Column("notes")]
    public string? Notes { get; set; }
}
