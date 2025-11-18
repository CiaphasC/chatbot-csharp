using ChatBot.Api.Application.Results;
using ChatBot.Api.Infrastructure.Supabase.Models;

namespace ChatBot.Api.Infrastructure.Supabase;

public interface IProfileService
{
    Task<Result<DbProfile>> ApproveAsync(Guid profileId);
    Task<Result<DbProfile>> RejectAsync(Guid profileId);
}

/// <summary>
/// Servicio para actualizar el estado de perfiles (aprobación/rechazo) en Supabase.
/// </summary>
public class ProfileService : IProfileService
{
    private readonly SupabaseClientProvider _clientProvider;

    public ProfileService(SupabaseClientProvider clientProvider)
    {
        _clientProvider = clientProvider;
    }

    public async Task<Result<DbProfile>> ApproveAsync(Guid profileId) =>
        await UpdateStatus(profileId, "active");

    public async Task<Result<DbProfile>> RejectAsync(Guid profileId) =>
        await UpdateStatus(profileId, "rejected");

    private async Task<Result<DbProfile>> UpdateStatus(Guid profileId, string status)
    {
        var client = await _clientProvider.GetClientAsync();
        
        var profile = await client.From<DbProfile>()
            .Where(p => p.Id == profileId)
            .Single();
            
        if (profile is null)
            return Result<DbProfile>.Failure("Perfil no encontrado");
            
        profile.Status = status;
        var response = await client.From<DbProfile>()
            .Update(profile);

        var updated = response.Models.FirstOrDefault();
        return updated is null
            ? Result<DbProfile>.Failure("Error al actualizar perfil")
            : Result<DbProfile>.Success(updated);
    }
}
