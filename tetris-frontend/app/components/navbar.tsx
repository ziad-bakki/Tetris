import { Trophy, User, LogIn, Sparkles, Icon } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";


function TetrisIcon() {
  return (
    <Image width={96} height={96} src="/tetrisicons/tetris96.png" alt="tetris logo" />

  )
}

export default function NavBar() {
  return (
    <div className="bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center px-4 mx-auto">
          {/* Logo - flex-1 pushes nav to the right */}
          <div className="flex-1">
            <a href="#" className="flex items-center space-x-2 w-fit">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <TetrisIcon />
                {/* <Sparkles className="h-4 w-4 text-primary-foreground" /> */}
              </div>
              <span className="font-bold text-xl">Tetris</span>
            </a>
          </div>

          {/* Navigation */}
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <Button size="sm">

                  <Trophy className="mr-2 h-4 w-4 text-amber-500" />
                  Leaderboards
                </Button>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Button size="sm">
                  <User className="mr-2 h-4 w-4" />
                  Account
                </Button>
              </NavigationMenuItem>

              <Separator orientation="vertical" className="h-6 mx-2" />

              <NavigationMenuItem>
                <Button size="sm">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>
    </div>
  );
}
