import { useEffect, useRef } from "react";

import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";

type TimerFunction = typeof setTimeout | typeof setInterval;
type ClearTimerFunction = typeof clearTimeout | typeof clearInterval;

function useTimer(
  callback: () => void,
  delay: number | null,
  deps: unknown[] = [],
  timerFn: TimerFunction,
  clearTimerFn: ClearTimerFunction,
): void {
  const savedCallback = useRef(callback);

  // Remember the latest callback if it changes.
  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback;
  }, deps);

  // Set up the timer
  useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (!delay && delay !== 0) {
      return;
    }

    const id = timerFn(() => {
      savedCallback.current();
    }, delay);

    return () => {
      clearTimerFn(id);
    };
  }, [delay]); // eslint-disable-line react-hooks/exhaustive-deps
}

export function useTimeout(
  callback: () => void,
  delay: number | null,
  deps: unknown[] = [],
): void {
  useTimer(callback, delay, deps, setTimeout, clearTimeout);
}

export function useInterval(
  callback: () => void,
  delay: number | null,
  deps: unknown[] = [],
): void {
  useTimer(callback, delay, deps, setInterval, clearInterval);
}
