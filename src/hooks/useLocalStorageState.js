"use client";

import {useCallback, useSyncExternalStore} from "react";

const subscribers = new Set();

const subscribe = (callback) => {
    const handler = (e) => {
        if (!e || subscribers.has(callback)) callback();
    };
    subscribers.add(callback);
    if (typeof window !== "undefined") {
        window.addEventListener("storage", handler);
    }
    return () => {
        subscribers.delete(callback);
        if (typeof window !== "undefined") {
            window.removeEventListener("storage", handler);
        }
    };
};

const notify = () => {
    subscribers.forEach((cb) => cb());
};

const readRaw = (key) => {
    if (typeof window === "undefined") return null;
    try {
        return window.localStorage.getItem(key);
    } catch {
        return null;
    }
};

// React Compiler-safe `useLocalStorageState` — replaces the
// `useEffect(() => setX(JSON.parse(localStorage.getItem(...))), [])` pattern
// that triggers cascading renders. Returns [value, setValue].
// `serialize` defaults to JSON; pass `String`/identity for raw strings.
export function useLocalStorageState(key, defaultValue, options = {}) {
    const {serialize = JSON.stringify, deserialize = JSON.parse} = options;

    const value = useSyncExternalStore(
        subscribe,
        () => {
            const raw = readRaw(key);
            if (raw === null) return defaultValue;
            try {
                return deserialize(raw);
            } catch {
                return defaultValue;
            }
        },
        () => defaultValue,
    );

    const setValue = useCallback(
        (next) => {
            if (typeof window === "undefined") return;
            try {
                const resolved = typeof next === "function" ? next(value) : next;
                if (resolved === null || resolved === undefined) {
                    window.localStorage.removeItem(key);
                } else {
                    window.localStorage.setItem(key, serialize(resolved));
                }
                notify();
            } catch {
                /* ignore — quota exceeded or storage disabled */
            }
        },
        [key, value, serialize],
    );

    return [value, setValue];
}
