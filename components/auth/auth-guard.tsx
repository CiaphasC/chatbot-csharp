'use client'

import { useEffect } from 'react'
import { useProfile } from '@/hooks/use-profile'
import { Loader2 } from 'lucide-react'

type AuthGuardProps = {
  children: React.ReactNode
  requiredRole?: 'admin' | 'client'
  requireActive?: boolean
  redirectTo?: string
  pendingRedirect?: string
}

export function AuthGuard({
  children,
  requiredRole,
  requireActive = false,
  redirectTo = '/auth/login',
  pendingRedirect = '/pending',
}: AuthGuardProps) {
  const { loading, profile, sessionUserId } = useProfile()

  const allowed =
    !!sessionUserId &&
    (!requiredRole || profile?.role === requiredRole) &&
    (!requireActive || profile?.status === 'active')

  useEffect(() => {
    if (loading) return
    if (sessionUserId && requiredRole && profile?.role !== requiredRole) {
      window.location.href = redirectTo
      return
    }
    if (requireActive && profile?.status !== 'active') {
      window.location.href = pendingRedirect
      return
    }
    if (!sessionUserId) {
      window.location.href = redirectTo
    }
  }, [allowed, loading, redirectTo, pendingRedirect, profile, requireActive, requiredRole, sessionUserId])

  if (loading || !allowed) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        Verificando sesión...
      </div>
    )
  }

  return <>{children}</>
}
