'use client'

import { useEffect, useState } from "react"
import { Leaderboard } from "../interfaces/backendtypes"
import { GetLeaderboardsByScore } from "../context/api";
import { Skeleton } from "@/components/ui/skeleton";


export default function LeaderboardPage() {

  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);

  useEffect(() => {
    GetLeaderboardsByScore().then(setLeaderboard)
  }, [])


  return (
    <>

    </>
  )

}
