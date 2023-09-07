import React, { useState, useEffect } from "react";

interface SecondsCounterHook {
  seconds: number;
  isActive: boolean;
  reset: () => void;
}

export function useSecondsCounter(): SecondsCounterHook {
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  let interval: NodeJS.Timeout | null = null;

  useEffect(() => {
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else {
      clearInterval(interval!);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive]);

  const reset = () => {
    // starts counting right away
    setSeconds(0);
    setIsActive(true);
  };

  return {
    seconds,
    isActive,
    reset,
  };
}
