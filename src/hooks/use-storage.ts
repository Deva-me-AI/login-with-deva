import { useEffect, useCallback, useState } from "react";

export function useStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const item = sessionStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item) as T);
      }
    } catch (error) {
      console.error(error);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(error);
      }
    },
    [key],
  );

  useEffect(() => {
    const storageEventHandler = (event: StorageEvent) => {
      if (event.storageArea === window.sessionStorage && event.key === key) {
        if (event.newValue === null) {
          setStoredValue(undefined as T);
        } else {
          try {
            setStoredValue(JSON.parse(event.newValue ?? "") as T);
          } catch {
            console.warn(
              `Failed to handle storageEvent's newValue='${event.newValue}' for key '${key}'`,
            );
          }
        }
      }
    };
    window.addEventListener("storage", storageEventHandler, false);
    return () =>
      window.removeEventListener("storage", storageEventHandler, false);
  }, [key]);

  return [storedValue, setValue];
}
