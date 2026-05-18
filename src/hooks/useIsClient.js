"use client";

import {useSyncExternalStore} from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

// React 19 / React Compiler-safe replacement for the
// `const [isMounted, setIsMounted] = useState(false); useEffect(() => setIsMounted(true), [])`
// pattern. Returns false on SSR, true on the client after hydration —
// without triggering a cascading render warning.
export function useIsClient() {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
