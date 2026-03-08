import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Trophy, Gamepad2, Rows3 } from "lucide-react"

interface ProfileCardProps {
  username: string;
  highScore: number;
  gamesPlayed: number;
  linesCleared: number;
}

export function ProfileCard({ username, highScore, gamesPlayed, linesCleared }: ProfileCardProps) {
  return (
    <Card className="mx-auto w-full max-w-2xl bg-zinc-900 text-white border-zinc-700">
      <CardHeader>
        <CardTitle className="text-2xl">{username}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center gap-1">
            <Trophy className="size-5 text-muted-foreground" />
            <span className="text-2xl font-bold">{highScore}</span>
            <span className="text-xs text-muted-foreground">High Score</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Gamepad2 className="size-5 text-muted-foreground" />
            <span className="text-2xl font-bold">{gamesPlayed}</span>
            <span className="text-xs text-muted-foreground">Games Played</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Rows3 className="size-5 text-muted-foreground" />
            <span className="text-2xl font-bold">{linesCleared}</span>
            <span className="text-xs text-muted-foreground">Lines Cleared</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
