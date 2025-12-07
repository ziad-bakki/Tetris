import { Button } from "@/components/ui/button";
import { GridCell } from "../interfaces/interfaces";
import { testDraw } from "../context/gamecontext";

interface ControlsProps {
  grid: GridCell[][];
  setGrid: (grid: GridCell[][]) => void;
}

export function Controls({ grid, setGrid }: ControlsProps) {
  return (
    <Button onClick={() => setGrid(testDraw(grid))}>draw</Button>
  );
}
