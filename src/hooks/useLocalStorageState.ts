"use client";

import {useCallback, useSyncExternalStore} from "react";

type Subscriber = () => void;

const subscribers = new Set<Subscriber>();
// Cache parsed values per key so that getSnapshot returns a stable
// reference between renders. useSyncExternalStore would loop infinitely
// if we returned a fresh JSON.parse() object each call.
const cache = new Map<string, {raw: string; parsed: unknown}>();

const subscribe = (callback: Subscriber): (() => void) => {
    const handler = (): void => callback();
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

const notify = (): void => {
    subscribers.forEach((cb) => cb());
};

interface Options<T> {
    serialize?: (value: T) => string;
    deserialize?: (raw: string) => T;
}

const readSnapshot = <T,>(
    key: string,
    defaultValue: T,
    deserialize: (raw: string) => T,
): T => {
    if (typeof window === "undefined") return defaultValue;
    let raw: string | null;
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
    if (cached && cached.raw === raw) return cached.parsed as T;
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
export function useLocalStorageState<T>(
    key: string,
    defaultValue: T,
    options: Options<T> = {},
): [T, (next: T | ((prev: T) => T)) => void] {
    const {
        serialize = JSON.stringify as (value: T) => string,
        deserialize = JSON.parse as (raw: string) => T,
    } = options;

    const value = useSyncExternalStore(
        subscribe,
        () => readSnapshot(key, defaultValue, deserialize),
        () => defaultValue,
    );

    const setValue = useCallback(
        (next: T | ((prev: T) => T)): void => {
            if (typeof window === "undefined") return;
            try {
                const resolved =
                    typeof next === "function"
                        ? (next as (prev: T) => T)(value)
                        : next;
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
