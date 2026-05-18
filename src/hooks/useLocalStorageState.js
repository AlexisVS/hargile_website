"use client";

import {useCallback, useSyncExternalStore} from "react";

const subscribers = new Set();
// Cache parsed values per key so that getSnapshot returns a stable
// reference between renders. useSyncExternalStore would loop infinitely
// if we returned a fresh JSON.parse() object each call.
const cache = new Map(); // key → {raw, parsed}

const subscribe = (callback) => {
    const handler = () => callback();
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

const readSnapshot = (key, defaultValue, deserialize) => {
    if (typeof window === "undefined") return defaultValue;
    let raw;
    try {
        raw = window.localStorage.getItem(key);
    } catch {
        return defaultValue;
    }
    if (raw === null) {
        cache.delete(key);
        return defaultValue;
    }
    const cached = cache.get(key);
    if (cached && cached.raw === raw) return cached.parsed;
    try {
        const parsed = deserialize(raw);
        cache.set(key, {raw, parsed});
        return parsed;
    } catch {
        return defaultValue;
    }
};

// React Compiler-safe `useLocalStorageState` — replaces the
// `useEffect(() => setX(JSON.parse(localStorage.getItem(...))), [])` pattern
// that triggered cascading renders. Returns [value, setValue].
// `serialize` defaults to JSON; pass `String`/identity for raw strings.
export function useLocalStorageState(key, defaultValue, options = {}) {
    const {serialize = JSON.stringify, deserialize = JSON.parse} = options;

    const value = useSyncExternalStore(
        subscribe,
        () => readSnapshot(key, defaultValue, deserialize),
        () => defaultValue,
    );

    const setValue = useCallback(
        (next) => {
            if (typeof window === "undefined") return;
            try {
                const resolved = typeof next === "function" ? next(value) : next;
                if (resolved === null || resolved === undefined) {
                    window.localStorage.removeItem(key);
                    cache.delete(key);
                } else {
                    const raw = serialize(resolved);
                    window.localStorage.setItem(key, raw);
                    cache.set(key, {raw, parsed: resolved});
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
