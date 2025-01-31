import { useEffect, useCallback, useState } from "react";

const isBrowser = typeof window !== "undefined";

const getStorageValue = <T>(key: string, initialValue: T): T => {
  if (!isBrowser) {
    return initialValue;
  }

  try {
    const item = sessionStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : initialValue;
  } catch (error) {
    console.error(error);
    return initialValue;
  }
};

export function useStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() =>
    getStorageValue(key, initialValue),
  );

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        if (isBrowser) {
          sessionStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        console.error(error);
      }
    },
    [key],
  );

  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    const item = sessionStorage.getItem(key);
    if (item) {
      try {
        setStoredValue(JSON.parse(item) as T);
      } catch (error) {
        console.error(error);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    const storageEventHandler = (event: StorageEvent) => {
      if (event.storageArea === window.sessionStorage && event.key === key) {
        if (event.newValue === null) {
          setStoredValue(initialValue);
        } else {
          try {
            setStoredValue(JSON.parse(event.newValue) as T);
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
  }, [key, initialValue]);

  return [storedValue, setValue];
}
