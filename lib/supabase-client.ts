'use client';

// TODO: inicializar Supabase client aquí
// Ejemplo de estructura:
// import { createBrowserClient } from '@supabase/ssr';
//
// export const supabase = createBrowserClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
// );

// Placeholder functions para Supabase
export async function handleEmailPasswordLogin(email: string, password: string) {
  // TODO: implementar con supabase.auth.signInWithPassword
  console.log('handleEmailPasswordLogin:', { email, password });
  return { data: null, error: null };
}

export async function handleSupabaseSignup(
  email: string,
  password: string,
  userData: any
) {
  // TODO: implementar con supabase.auth.signUp
  // TODO: handleSupabaseInsertUser para guardar datos adicionales
  console.log('handleSupabaseSignup:', { email, userData });
  return { data: null, error: null };
}

export async function handleGoogleLogin() {
  // TODO: implementar con supabase.auth.signInWithOAuth({ provider: 'google' })
  console.log('handleGoogleLogin');
  return { data: null, error: null };
}

export async function fetchAppointments() {
  // TODO: SELECT * FROM appointments WHERE user_id = current_user_id
  console.log('fetchAppointments');
  return [];
}

export async function bookAppointment(appointmentData: any) {
  // TODO: verificar disponibilidad contra Supabase (appointments table)
  // TODO: bloquear slots ya ocupados para ese día y servicio
  console.log('bookAppointment:', appointmentData);
  return { data: null, error: null };
}

export async function updateAppointmentStatus(
  appointmentId: number,
  newStatus: string
) {
  // TODO: UPDATE appointments SET status = newStatus WHERE id = appointmentId
  console.log('updateAppointmentStatus:', { appointmentId, newStatus });
  return { data: null, error: null };
}

export async function approveUser(userId: number) {
  // TODO: actualizar estado en Supabase
  // TODO: enviar correo con Supabase + Gmail / servicio de correo
  console.log('approveUser:', userId);
  return { data: null, error: null };
}

export async function fetchEmployees() {
  // TODO: SELECT * FROM users WHERE role = 'employee'
  console.log('fetchEmployees');
  return [];
}

export async function fetchClients() {
  // TODO: SELECT * FROM users WHERE role = 'client'
  console.log('fetchClients');
  return [];
}

export async function fetchServiceTypes() {
  // TODO: SELECT * FROM service_types
  console.log('fetchServiceTypes');
  return [];
}

export async function handleLogout() {
  // TODO: implementar con supabase.auth.signOut()
  console.log('handleLogout');
  return { data: null, error: null };
}

