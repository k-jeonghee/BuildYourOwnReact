import { useMemo } from './useMemo';

export function useCallback(callback, deps) {
	return useMemo(() => callback, deps);
}
