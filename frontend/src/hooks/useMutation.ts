/**
 * Generic mutation hook for POST/PUT/DELETE-style requests.
 */

import { useCallback, useState } from "react";

interface UseMutationResult<TArgs extends unknown[], TResult> {
  mutate: (...args: TArgs) => Promise<TResult>;
  isLoading: boolean;
  error: Error | null;
}

export function useMutation<TArgs extends unknown[], TResult>(
  mutationFn: (...args: TArgs) => Promise<TResult>,
): UseMutationResult<TArgs, TResult> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (...args: TArgs) => {
      setIsLoading(true);
      setError(null);
      try {
        return await mutationFn(...args);
      } catch (err) {
        const normalized = err instanceof Error ? err : new Error(String(err));
        setError(normalized);
        // Re-throw so callers (e.g. forms) can still keep a modal open on failure.
        throw normalized;
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn],
  );

  return { mutate, isLoading, error };
}
