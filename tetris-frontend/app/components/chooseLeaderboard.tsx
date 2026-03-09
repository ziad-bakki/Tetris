"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


interface ChooseLeaderboardProps {
  value: string;
  onChange: (value: string) => void;
}

export function ChooseLeaderboard({ value, onChange }: ChooseLeaderboardProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="outline">{value === "high-score" ? "High Score" : "Lines Cleared"}</Button></DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Sort By</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
            <DropdownMenuRadioItem value="high-score">High Score</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="lines-cleared">Lines Cleared</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
