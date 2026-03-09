'use client'

import { useEffect, useState } from "react"
import { Leaderboard } from "../interfaces/backendtypes"
import { GetLeaderboardsByLines, GetLeaderboardsByScore } from "../context/api";
import { Skeleton } from "@/components/ui/skeleton";
import { ChooseLeaderboard } from "../components/chooseLeaderboard";
import LeaderBoardTable from "../components/leaderboardtable";


export default function LeaderboardPage() {
  const [sortBy, setSortBy] = useState<string>("high-score");



  return (
    <>
      <ChooseLeaderboard value={sortBy} onChange={setSortBy} />
      <LeaderBoardTable sortBy={sortBy} />

    </>
  )

}
