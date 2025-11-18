export type ChatMessage = {
  id: string
  sender: 'user' | 'assistant' | 'system'
  content: string
  createdAt: number
}

const MOCK_RESPONSES: Array<{ keyword: RegExp; reply: string }> = [
  {
    keyword: /cita|agenda|disponible/i,
    reply:
      'Puedo ayudarte a gestionar citas. Indica servicio y fecha y preparare la solicitud (por ahora uso datos mock).',
  },
  {
    keyword: /emplead/i,
    reply:
      'Los empleados se cargan de Supabase luego; mientras tanto uso la lista mock definida en lib/mocks.ts.',
  },
  {
    keyword: /cliente/i,
    reply:
      'Los clientes estan en modo mock. Cuando conectes el backend, reemplaza fetchClients por la consulta real.',
  },
  {
    keyword: /servicio/i,
    reply:
      'Los servicios estan en lib/mocks.ts. Ajusta service_types en Supabase cuando hagas el backend.',
  },
]

function buildMockReply(input: string): string {
  const hit = MOCK_RESPONSES.find((r) => r.keyword.test(input))
  if (hit) return hit.reply
  return `Recibi tu mensaje: "${input}". Aun estoy en modo mock; conecta Supabase/C# y actualiza sendChatMessageMock para respuestas reales.`
}

export async function sendChatMessageMock(input: string): Promise<ChatMessage> {
  // Simula latencia de red y devuelve una respuesta de asistente.
  await new Promise((res) => setTimeout(res, 650))
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    sender: 'assistant',
    content: buildMockReply(input),
    createdAt: Date.now(),
  }
}
