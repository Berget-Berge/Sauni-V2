import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export interface AdminAuthState {
  session: Session | null
  isAdmin: boolean
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export function useAdminAuth(): AdminAuthState {
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function checkAdmin() {
    const { data, error: rpcError } = await supabase.rpc('is_admin')
    if (rpcError) {
      setIsAdmin(false)
      return
    }
    setIsAdmin(Boolean(data))
  }

  useEffect(() => {
    let cancelled = false
    supabase.auth.getSession().then(async ({ data }) => {
      if (cancelled) return
      setSession(data.session)
      if (data.session) await checkAdmin()
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession)
      if (newSession) {
        await checkAdmin()
      } else {
        setIsAdmin(false)
      }
    })

    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [])

  async function signIn(email: string, password: string) {
    setError(null)
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError(signInError.message)
      return
    }
    setSession(data.session)
    const { data: adminData, error: rpcError } = await supabase.rpc('is_admin')
    const admin = !rpcError && Boolean(adminData)
    setIsAdmin(admin)
    if (!admin) {
      setError('Denne brukaren har ikkje admin-tilgang.')
      await supabase.auth.signOut()
      setSession(null)
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setSession(null)
    setIsAdmin(false)
  }

  return { session, isAdmin, loading, error, signIn, signOut }
}
