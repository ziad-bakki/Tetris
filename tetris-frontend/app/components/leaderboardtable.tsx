'use client';

import { useState, useEffect } from "react";
import { GetLeaderboardsByScore, GetLeaderboardsByLines } from "../context/api";
import { Leaderboard } from "../interfaces/backendtypes";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface LeaderBoardTableProps {
  sortBy: string;
}

export default function LeaderBoardTable({ sortBy }: LeaderBoardTableProps) {
  const [leaderboard, setLeaderboard] = useState<Leaderboard[] | null>(null);
  useEffect(() => {
    if (sortBy === "high-score") {
      GetLeaderboardsByScore().then(setLeaderboard)
    } else {
      GetLeaderboardsByLines().then(setLeaderboard)
    }


  }, [sortBy]);

  if (leaderboard) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Rank</TableHead>
            <TableHead>Username</TableHead>
            <TableHead className="text-right">High Score</TableHead>
            <TableHead className="text-right">Lines Cleared</TableHead>
            <TableHead className="text-right">Best Lines</TableHead>
            <TableHead className="text-right">Games Played</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboard.map((entry) => {
            const rank = sortBy === "high-score" ? entry.score_rank : entry.lines_rank;
            return (
              <TableRow key={entry.username}>
                <TableCell>{rank}</TableCell>
                <TableCell>{entry.username}</TableCell>
                <TableCell className="text-right">{entry.high_score.toLocaleString()}</TableCell>
                <TableCell className="text-right">{entry.lines_cleared.toLocaleString()}</TableCell>
                <TableCell className="text-right">{entry.best_lines}</TableCell>
                <TableCell className="text-right">{entry.games_played}</TableCell>
              </TableRow>
            )

          })}
        </TableBody>
      </Table>
    )
  }

  return (<div>No Leaderboards Found!</div>)
}
