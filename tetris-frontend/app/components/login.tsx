'use client'

import { supabase } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (user) {
    return (
      <div>
        <span>{user.user_metadata.display_name || user.email}</span>
        <button onClick={handleSignOut}>Sign out</button>
      </div>
    )
  }


  return (
    <button onClick={handleGoogleSignIn}>
      Sign in with Google
    </button>
  )
}
