using ChatBot.Api.Domain.Models;

namespace ChatBot.Api.Infrastructure;

/// <summary>
/// Almacén en memoria para demos. Sustituir por repositorios Supabase/Postgres en producción.
/// </summary>
public class AppDataStore
{
    public List<Person> Clients { get; } = new();
    public List<Service> Services { get; } = new();
    public List<Appointment> Appointments { get; } = new();

    public AppDataStore()
    {
        // Seed de ejemplo
        AddClient("Ana Martínez", "ana@example.com");
        AddClient("Pedro Sánchez", "pedro@example.com");
        AddService("Consulta General", 30, "Consulta inicial");
        AddService("Seguimiento", 20, "Revisión");
        AddService("Diagnóstico", 45, "Evaluación avanzada");
    }

    public Person AddClient(string fullName, string email) =>
        AddPerson(Clients, fullName, email, role: null);

    public Service AddService(string name, int durationMinutes, string? description)
    {
        var service = new Service(Guid.NewGuid(), name, durationMinutes, description);
        Services.Add(service);
        return service;
    }

    public Appointment AddAppointment(Guid clientId, Guid serviceId, DateOnly date, TimeSpan time, int durationMinutes)
    {
        var appt = new Appointment(
            Guid.NewGuid(),
            clientId,
            serviceId,
            date,
            time,
            TimeSpan.FromMinutes(durationMinutes),
            Status: "confirmada"
        );
        Appointments.Add(appt);
        return appt;
    }

    private static Person AddPerson(List<Person> list, string fullName, string email, string? role)
    {
        var person = new Person(Guid.NewGuid(), fullName, email, role);
        list.Add(person);
        return person;
    }
}
