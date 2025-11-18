// Función Edge para notificar por correo cuando un admin aprueba a un cliente.
// Usa Resend (https://resend.com/) como proveedor de email.
// Variables requeridas:
// - RESEND_API_KEY
// - FROM_EMAIL (ej: "soporte@tudominio.com")

import { Resend } from 'https://esm.sh/resend@2.0.0'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

type ApprovalPayload = {
  email: string
  full_name?: string
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY') ?? '')
const fromEmail = Deno.env.get('FROM_EMAIL') ?? 'noreply@example.com'

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const payload = (await req.json()) as ApprovalPayload
  if (!payload?.email || !payload.email.toLowerCase().endsWith('@gmail.com')) {
    return new Response('Email inválido o no es Gmail', { status: 400 })
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: payload.email,
      subject: 'Tu cuenta ha sido activada',
      html: `<p>Hola ${payload.full_name ?? ''},</p>
             <p>Tu cuenta ha sido activada. Ya puedes ingresar al sistema.</p>
             <p>Gracias.</p>`,
    })

    if (error) {
      console.error(error)
      return new Response('Error enviando correo', { status: 500 })
    }

    return new Response(JSON.stringify({ ok: true, id: data?.id }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    console.error(err)
    return new Response('Error interno', { status: 500 })
  }
})
