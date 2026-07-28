/**
 * Generic data-fetching hook for GET-style requests.
 */

import {
  type DependencyList,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface UseFetchResult<T> {
  data: T | null;
  // True only until the first successful/failed load completes.
  isLoading: boolean;
  // True whenever a request is in flight, including refetches.
  isFetching: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

function isAbortError(err: unknown): boolean {
  return err instanceof DOMException && err.name === "AbortError";
}

export function useFetch<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: DependencyList = [],
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Lets effects/callbacks always call the latest fetcher without
  // needing it in the dependency array (callers often pass an inline fn).
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  // Guards against a race where an older request resolves after a newer one
  // (e.g. deps change twice in quick succession) and overwrites fresher data.
  const requestIdRef = useRef(0);
  // Actually cancels the in-flight network request, rather than just
  // ignoring its result, when superseded or when the component unmounts.
  const abortControllerRef = useRef<AbortController | null>(null);

  const run = useCallback(async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const requestId = ++requestIdRef.current;
    setIsFetching(true);
    setError(null);
    try {
      const result = await fetcherRef.current(controller.signal);
      if (requestId !== requestIdRef.current) return; // superseded, drop it
      setData(result);
    } catch (err) {
      if (requestId !== requestIdRef.current || isAbortError(err)) return;
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      if (requestId === requestIdRef.current) {
        setIsFetching(false);
        setIsLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
    return () => abortControllerRef.current?.abort();
  }, [run]);

  return { data, isLoading, isFetching, error, refetch: run };
}
