'use client'

import { supabase } from '@/lib/supabase-client'
import { useEffect, useState } from 'react'

type Profile = {
  id: string
  full_name: string
  email: string
  role: 'admin' | 'client'
  status: 'pending' | 'active' | 'rejected'
}

type UseProfileResult = {
  loading: boolean
  sessionUserId?: string
  profile?: Profile
  error?: string
  refresh: () => Promise<void>
}

export function useProfile(): UseProfileResult {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | undefined>()
  const [sessionUserId, setSessionUserId] = useState<string | undefined>()
  const [error, setError] = useState<string | undefined>()

  const fetchProfile = async () => {
    setLoading(true)
    setError(undefined)
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError
      const user = sessionData.session?.user
      setSessionUserId(user?.id)
      if (!user) {
        setProfile(undefined)
        setLoading(false)
        return
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      if (error) throw error
      setProfile(data as Profile)
    } catch (err: any) {
      setError(err.message || 'Error al cargar perfil')
      setProfile(undefined)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchProfile()
    })
    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  return { loading, sessionUserId, profile, error, refresh: fetchProfile }
}
