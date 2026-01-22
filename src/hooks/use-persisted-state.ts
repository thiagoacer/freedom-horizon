import { useState, useEffect } from "react";

/**
 * A hook that syncs state to localStorage.
 * 
 * @param key The localStorage key to use.
 * @param initialValue The initial value if key is not found.
 */
export function usePersistedState<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    // Initialize state function to read from localStorage only on first render
    const [state, setState] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Effect to update localStorage whenever state changes
    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.warn(`Error writing localStorage key "${key}":`, error);
        }
    }, [key, state]);

    return [state, setState];
}
