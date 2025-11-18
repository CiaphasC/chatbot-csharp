'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, AlertCircle, Loader2 } from 'lucide-react'
import { ChatMessage, sendChatMessageMock } from '@/lib/chatbot'
import { toast } from '@/hooks/use-toast'

function createMessage(sender: ChatMessage['sender'], content: string): ChatMessage {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    sender,
    content,
    createdAt: Date.now(),
  }
}

export function ChatbotPlaceholder() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    createMessage(
      'system',
      'Hola, soy tu asistente. Aún estoy en desarrollo, pero ya puedo simular respuestas con datos mock.',
    ),
  ])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const listRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isSending) return

    const userMessage = createMessage('user', text)
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsSending(true)

    try {
      const reply = await sendChatMessageMock(text)
      setMessages((prev) => [...prev, reply])
    } catch (error) {
      console.error('chat-error', error)
      toast({
        title: 'No pude enviar el mensaje',
        description: 'Revisa tu conexión o inténtalo de nuevo.',
      })
    } finally {
      setIsSending(false)
    }
  }

  const quickPrompts = useMemo(
    () => [
      '¿Qué citas tengo hoy?',
      'Lista de servicios disponibles',
      'Empleados activos',
      'Clientes pendientes de aprobación',
    ],
    [],
  )

  return (
    <motion.div
      className="glass-effect rounded-xl overflow-hidden flex flex-col h-[calc(100vh-180px)] bg-gradient-to-b from-background to-background/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="bg-card/50 border-b border-border p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-foreground text-lg">Asistente de Citas</h3>
            <p className="text-sm text-muted-foreground">Modo mock listo para conectar a Supabase + C#</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide"
      >
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
            >
              <div
                className={`max-w-xl px-4 py-3 rounded-lg text-sm md:text-base leading-relaxed ${
                  message.sender === 'user'
                    ? 'bg-primary/20 text-foreground border border-primary/50'
                    : message.sender === 'system'
                      ? 'bg-muted/30 text-muted-foreground border border-border/40'
                      : 'bg-card text-foreground border border-border'
                }`}
              >
                <p>{message.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Quick prompts */}
      <div className="px-6 pb-3 flex flex-wrap gap-2">
        {quickPrompts.map((prompt) => (
          <Button
            key={prompt}
            variant="outline"
            size="sm"
            className="border-border/60 text-muted-foreground hover:text-foreground"
            onClick={() => setInput(prompt)}
          >
            {prompt}
          </Button>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-border p-6 space-y-3">
        <div className="flex gap-3">
          <Input
            placeholder="Escribe un mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            className="bg-background border-border text-foreground text-base py-3"
            disabled={isSending}
          />
          <Button
            size="lg"
            onClick={handleSend}
            className="bg-primary hover:bg-primary/90 px-6"
            disabled={isSending || !input.trim()}
          >
            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Las respuestas son mock. Reemplaza <code>sendChatMessageMock</code> por tu API cuando conectes Supabase/C#.
        </p>
      </div>
    </motion.div>
  )
}
