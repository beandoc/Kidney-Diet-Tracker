
'use client';

import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = (value: T | ((val: T) => T)) => void;

function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  // Pass initialValue to useState so it's only used on the initial render
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  });


  const setValue: SetValue<T> = useCallback(
    value => {
      if (typeof window == 'undefined') {
        console.warn(
          `Tried setting localStorage key “${key}” even though environment is not a client`
        );
      }

      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        
        setStoredValue(valueToStore);

        window.dispatchEvent(new Event('local-storage'));
      } catch (error) {
        console.warn(`Error setting localStorage key “${key}”:`, error);
      }
    },
    [key, storedValue]
  );
  
  useEffect(() => {
    const readValue = (): T => {
        if (typeof window === 'undefined') {
          return initialValue;
        }
    
        try {
          const item = window.localStorage.getItem(key);
          return item ? (JSON.parse(item) as T) : initialValue;
        } catch (error) {
          console.warn(`Error reading localStorage key “${key}”:`, error);
          return initialValue;
        }
      };

    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]); // Only re-run if key changes

  useEffect(() => {
     const readValue = (): T => {
      if (typeof window === 'undefined') {
        return initialValue;
      }
  
      try {
        const item = window.localStorage.getItem(key);
        return item ? (JSON.parse(item) as T) : initialValue;
      } catch (error) {
        console.warn(`Error reading localStorage key “${key}”:`, error);
        return initialValue;
      }
    };
    
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };
    
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("local-storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("local-storage", handleStorageChange);
    };
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;
