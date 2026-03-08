'use client'

import { supabase } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { GetUserByID } from "../context/api"
import { Profile } from "../interfaces/backendtypes"
import { Button } from "@/components/ui/button"
import * as lucideReact from "lucide-react"
import { useRouter } from "next/navigation"

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null);

  const router = useRouter();


  useEffect(() => {
    GetUserByID().then(setProfile)
  }, [])


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
        <Button onClick={() => router.push("/profile")}>
          <lucideReact.User className=" h-4 w-4" />
          {profile?.username || user?.email}
        </Button>
      </div>
    )
  }


  return (
    <button onClick={handleGoogleSignIn}>
      Sign in with Google
    </button>
  )
}
