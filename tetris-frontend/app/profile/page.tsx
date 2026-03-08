'use client';

import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import * as lucideReact from "lucide-react";
import { useState, useEffect } from "react";
import { DeleteUser, GetUserByID, GetUserStatsByID } from "../context/api";
import { Profile, UserStats } from "../interfaces/backendtypes";
import { Button } from "@/components/ui/button";

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
      <Button>
        <lucideReact.User className=" h-4 w-4" />
        {profile?.username || user?.email}</Button>
      <Button variant="destructive" onClick={DeleteUser}>Delete Account</Button>
      <pre>{JSON.stringify(stats, null, 2)}</pre>
    </div>
  )
}
