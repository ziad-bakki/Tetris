'use client';

import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import * as lucideReact from "lucide-react";
import { useState, useEffect } from "react";
import { DeleteUser, GetUserByID, GetUserStatsByID } from "../context/api";
import { Profile, UserStats } from "../interfaces/backendtypes";
import { Button } from "@/components/ui/button";
import { ProfileCard } from "../components/profilecard";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    GetUserByID().then(setProfile)
    GetUserStatsByID().then(setStats)
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



  return (
    <div>
      {
        user && stats &&
        < ProfileCard
          username={profile?.username || user?.email as string}
          highScore={stats?.high_score}
          linesCleared={stats?.lines_cleared}
          gamesPlayed={stats?.games_played}
        />

      }

      <Button variant="destructive" onClick={DeleteUser}>Delete Account</Button>
      <pre>{JSON.stringify(stats, null, 2)}</pre>
    </div>
  )
}
