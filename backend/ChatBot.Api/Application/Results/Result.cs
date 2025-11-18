namespace ChatBot.Api.Application.Results;

/// <summary>
/// Wrapper simple para devolver éxito o error de manera expresiva.
/// </summary>
public readonly record struct Result<T>(bool IsSuccess, T? Value, string? Error)
{
    public static Result<T> Success(T value) => new(true, value, null);
    public static Result<T> Failure(string error) => new(false, default, error);

    public TResult Match<TResult>(Func<T, TResult> onSuccess, Func<string, TResult> onError) =>
        IsSuccess && Value is not null ? onSuccess(Value) : onError(Error ?? "Error desconocido");
}
