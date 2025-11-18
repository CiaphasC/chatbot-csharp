using Supabase;

namespace ChatBot.Api.Infrastructure.Supabase;

/// <summary>
/// Encapsula la creación y reuso de Supabase.Client (service role).
/// Usa SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY desde variables de entorno.
/// </summary>
public class SupabaseClientProvider
{
    private readonly Lazy<Task<Client>> _clientFactory;

    public SupabaseClientProvider()
    {
        _clientFactory = new Lazy<Task<Client>>(CreateClientAsync);
    }

    public Task<Client> GetClientAsync() => _clientFactory.Value;

    private static async Task<Client> CreateClientAsync()
    {
        var url = Environment.GetEnvironmentVariable("SUPABASE_URL");
        var key = Environment.GetEnvironmentVariable("SUPABASE_SERVICE_ROLE_KEY");

        if (string.IsNullOrWhiteSpace(url) || string.IsNullOrWhiteSpace(key))
        {
            throw new InvalidOperationException("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en entorno.");
        }

        var options = new SupabaseOptions
        {
            AutoRefreshToken = false,
            AutoConnectRealtime = false,
            PersistSession = false,
        };

        var client = new Client(url, key, options);
        await client.InitializeAsync();
        return client;
    }
}
