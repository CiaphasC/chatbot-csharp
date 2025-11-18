import { supabase } from './supabase-client'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

async function authFetch(path: string, options?: RequestInit) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options?.headers || {}),
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || res.statusText)
  }
  return res.json()
}

export type ServiceDto = { id: string; name: string; duration_minutes: number; description?: string }
export type ClientDto = { id: string; full_name: string; email: string; role?: string; status?: string }
export type AppointmentDto = {
  id: string
  client_id: string
  service_id: string
  start_at: string
  end_at?: string
  status: string
  client_name?: string
  service_name?: string
}

export type ChatMessage = {
  conversationId: string
  userMessage: { id: string; sender: string; content: string; createdAt: string }
  assistantMessage: { id: string; sender: string; content: string; createdAt: string }
}

export const api = {
  async listServices(): Promise<ServiceDto[]> {
    return authFetch('/api/services')
  },
  async updateService(id: string, payload: { name: string; duration_minutes: number; description?: string }) {
    return authFetch(`/api/services/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
  },
  async deleteService(id: string) {
    return authFetch(`/api/services/${id}`, { method: 'DELETE' })
  },
  async createService(payload: { name: string; duration_minutes: number; description?: string }) {
    return authFetch('/api/services', { method: 'POST', body: JSON.stringify(payload) })
  },
  async listClients(): Promise<ClientDto[]> {
    return authFetch('/api/clients')
  },
  async approveClient(id: string) {
    return authFetch(`/api/clients/${id}/approve`, { method: 'POST' })
  },
  async rejectClient(id: string) {
    return authFetch(`/api/clients/${id}/reject`, { method: 'POST' })
  },
  async listAppointments(date?: string): Promise<AppointmentDto[]> {
    const q = date ? `?date=${date}` : ''
    return authFetch(`/api/appointments${q}`)
  },
  async createAppointment(payload: { client_id: string; service_id: string; date: string; time: string }) {
    return authFetch('/api/appointments', { method: 'POST', body: JSON.stringify(payload) })
  },
  async cancelAppointment(id: string) {
    return authFetch(`/api/appointments/${id}`, { method: 'DELETE' })
  },
  async chat(message: string): Promise<ChatMessage> {
    return authFetch('/api/chat', { method: 'POST', body: JSON.stringify({ message }) })
  },
}
