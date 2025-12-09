import { useEffect, useRef, useState } from "react";

interface UseTimerProps {
  isRunning: boolean;
  onTick?: () => void;
}

export function useTimer({ isRunning, onTick }: UseTimerProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onTickRef = useRef(onTick);

  // Update ref when onTick changes
  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 100); // Update every 100ms
          onTickRef.current?.();
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
  }, [isRunning]);

  const resetTimer = () => setElapsedTime(0);

  return { elapsedTime, resetTimer };
}
