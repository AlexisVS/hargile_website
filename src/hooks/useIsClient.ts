"use client";

import {useSyncExternalStore} from "react";

const subscribe = (): (() => void) => () => {};
const getSnapshot = (): boolean => true;
const getServerSnapshot = (): boolean => false;

// React 19 / React Compiler-safe replacement for the
// `const [isMounted, setIsMounted] = useState(false); useEffect(() => setIsMounted(true), [])`
// pattern. Returns false on SSR, true on the client after hydration —
// without triggering a cascading render warning.
export function useIsClient(): boolean {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
