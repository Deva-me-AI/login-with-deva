import { useEffect, useState } from "react";

function useStorage<T>(
  key: string,
  initialValue: T,
  type: "session" | "local" = "session",
): [T, (v: T) => void] {
  const storage = type === "session" ? sessionStorage : localStorage;

  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = storage.getItem(key);
    try {
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(
        `Failed to parse stored value for '${key}'.\nContinuing with default value.`,
      );
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)): void => {
    if (value === undefined) {
      setStoredValue(value);
      storage.removeItem(key);
      return;
    }
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      storage.setItem(key, JSON.stringify(valueToStore));
    } catch (_error) {
      console.error(`Failed to store value for key '${key}'`);
      console.error(_error);
    }
  };

  useEffect(() => {
    const storageEventHandler = (event: StorageEvent) => {
      if (event.storageArea === storage && event.key === key) {
        if (event.newValue === null) {
          setStoredValue(undefined as T);
        } else {
          try {
            setStoredValue(JSON.parse(event.newValue ?? "") as T);
          } catch (error) {
            console.warn(
              `Failed to handle storageEvent's newValue='${event.newValue}' for key '${key}'`,
            );
            console.log(error);
          }
        }
      }
    };
    window.addEventListener("storage", storageEventHandler, false);
    return () =>
      window.removeEventListener("storage", storageEventHandler, false);
  }, [key, storage]);

  return [storedValue, setValue];
}

export default useStorage;
