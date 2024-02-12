import { didactState } from '../core';
import { shallowEqual } from '../utils/shallowEqual';

export function useEffect(callback, deps) {
	const oldHook =
		didactState.wipFiber.alternate &&
		didactState.wipFiber.alternate.hooks &&
		didactState.wipFiber.alternate.hooks[didactState.hookIndex];

	const hook = {
		deps,
	};

	if (!oldHook) {
		callback();
	} else {
		if (!shallowEqual(oldHook.deps, hook.deps)) {
			callback();
		}
	}

	didactState.wipFiber.hooks.push(hook);
	didactState.hookIndex++;
}
