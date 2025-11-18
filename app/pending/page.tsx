'use client'

import { useEffect } from 'react'
import { useProfile } from '@/hooks/use-profile'

export default function PendingPage() {
  const { profile, loading } = useProfile()

  useEffect(() => {
    if (!loading && profile?.status === 'active') {
      window.location.href = profile.role === 'admin' ? '/dashboard/admin' : '/dashboard/user'
    }
  }, [loading, profile])

  return (
    <div className="flex items-center justify-center h-screen bg-background text-center p-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Cuenta pendiente de aprobación</h1>
        <p className="text-muted-foreground">
          Tu cuenta está en revisión por un administrador. Cuando sea aprobada recibirás un correo y podrás ingresar.
        </p>
      </div>
    </div>
  )
}
