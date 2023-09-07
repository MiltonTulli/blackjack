import React, { useState, useEffect, useRef } from "react";

interface SecondsCounterHook {
  seconds: number;
  isActive: boolean;
  reset: () => void;
}

export function useSecondsCounter(): SecondsCounterHook {
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  const reset = () => {
    // Starts counting right away
    setSeconds(0);
    setIsActive(true);
  };

  return {
    seconds,
    isActive,
    reset,
  };
}
