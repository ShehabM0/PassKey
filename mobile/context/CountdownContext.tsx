import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

type CountdownContextType = {
  countdown: number;
  setCountdown: (duration: number) => void;
  finishedCountdown: boolean;
};

const CountdownContext = createContext<CountdownContextType | null>(null);

export function CountdownProvider({ children }: { children: React.ReactNode }) {
  const [countdown, setCountdown] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const startCountdown = (duration: number) => {
    setCountdown(duration);
  };

  useEffect(() => {
    if (countdown <= 0) {
      intervalRef.current && clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setCountdown((s) => s - 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [countdown]);

  return (
    <CountdownContext.Provider
      value={{ countdown, setCountdown, finishedCountdown: countdown === 0 }}
    >
      {children}
    </CountdownContext.Provider>
  );
}

export function useCountdown() {
  const ctx = useContext(CountdownContext);
  if (!ctx) throw new Error('useCountdown must be used inside CountdownProvider');
  return ctx;
}