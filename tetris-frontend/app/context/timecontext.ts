import { useEffect, useRef, useState } from "react";

interface UseTimerProps {
  isRunning: boolean;
  onTick?: (elapsedTime: number) => void;
}

export function useTimer({ isRunning, onTick }: UseTimerProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => {
          const newTime = prev + 100; // Update every 100ms
          onTick?.(newTime);
          return newTime;
        });
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onTick]);

  const resetTimer = () => setElapsedTime(0);

  return { elapsedTime, resetTimer };
}
