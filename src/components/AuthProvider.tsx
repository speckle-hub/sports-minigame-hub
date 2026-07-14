import { useEffect, useRef } from "react"
import { supabase } from "../lib/supabase"
import { useAuthStore } from "../stores/authStore"
import { migrateGuestResults } from "../lib/gameService"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setProfile, setIsLoading, loadProfile } = useAuthStore()
  const migratedRef = useRef(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        loadProfile(session.user.id)
        migrateGuestResults(session.user.id).catch(console.error)
      } else {
        setIsLoading(false)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        loadProfile(session.user.id)
        if (!migratedRef.current) {
          migratedRef.current = true
          migrateGuestResults(session.user.id).catch(console.error)
        }
      } else {
        migratedRef.current = false
        setProfile(null)
        setUser(null)
        setIsLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return <>{children}</>
}
