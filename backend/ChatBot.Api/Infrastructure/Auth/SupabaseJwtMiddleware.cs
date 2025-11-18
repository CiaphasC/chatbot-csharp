using Microsoft.Extensions.Caching.Memory;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace ChatBot.Api.Infrastructure.Auth;

/// <summary>
/// Middleware para validar el JWT emitido por Supabase (GoTrue) usando JWKS.
/// Si es válido, coloca el user_id en HttpContext.Items["UserId"].
/// </summary>
public class SupabaseJwtMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IMemoryCache _cache;
    private readonly string _jwksUrl;

    public SupabaseJwtMiddleware(RequestDelegate next, IConfiguration config, IMemoryCache cache)
    {
        _next = next;
        _cache = cache;
        var supabaseUrl = config["SUPABASE_URL"] ?? Environment.GetEnvironmentVariable("SUPABASE_URL");
        if (string.IsNullOrWhiteSpace(supabaseUrl))
            throw new InvalidOperationException("SUPABASE_URL no configurado para validar JWT.");
        _jwksUrl = $"{supabaseUrl}/auth/v1/keys";
    }

    public async Task InvokeAsync(HttpContext context, IHttpClientFactory httpClientFactory)
    {
        var authHeader = context.Request.Headers.Authorization.ToString();
        if (string.IsNullOrWhiteSpace(authHeader) || !authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            await _next(context);
            return;
        }

        var token = authHeader["Bearer ".Length..].Trim();

        try
        {
            var handler = new JwtSecurityTokenHandler();
            var keys = await GetSigningKeys(httpClientFactory);

            var parameters = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKeys = keys
            };

            var principal = handler.ValidateToken(token, parameters, out _);
            var userId = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier || c.Type == "sub")?.Value;
            if (!string.IsNullOrEmpty(userId))
            {
                context.Items["UserId"] = userId;
                context.Items["ClaimsPrincipal"] = principal;
            }
        }
        catch
        {
            // token inválido: no se setea UserId; deja pasar a políticas para devolver 401/403 donde aplique
        }

        await _next(context);
    }

    private async Task<IEnumerable<SecurityKey>> GetSigningKeys(IHttpClientFactory httpClientFactory)
    {
        if (_cache.TryGetValue("supabase_jwks", out List<SecurityKey>? cachedKeys) && cachedKeys is not null)
            return cachedKeys;

        var http = httpClientFactory.CreateClient();
        var res = await http.GetFromJsonAsync<JwksResponse>(_jwksUrl);
        if (res?.Keys is null || res.Keys.Count == 0)
            throw new InvalidOperationException("No se pudieron obtener las llaves JWKS de Supabase.");

        var keys = res.Keys.Select(k => JsonWebKey.Create(JsonSerializer.Serialize(k))).ToList<SecurityKey>();
        _cache.Set("supabase_jwks", keys, TimeSpan.FromHours(1));
        return keys;
    }

    private record JwksResponse
    {
        [JsonPropertyName("keys")]
        public List<JsonWebKey> Keys { get; init; } = new();
    }
}
