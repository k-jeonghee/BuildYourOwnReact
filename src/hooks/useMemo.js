import { didactState } from '../core';
import { shallowEqual } from '../utils/shallowEqual';

export function useMemo(compute, deps) {
	const oldHook =
		didactState.wipFiber.alternate &&
		didactState.wipFiber.alternate.hooks &&
		didactState.wipFiber.alternate.hooks[didactState.hookIndex];

	const hook = {
		value: null,
		deps,
	};

	if (oldHook) {
		if (shallowEqual(oldHook.deps, hook.deps)) {
			hook.value = oldHook.value;
		} else {
			hook.value = compute();
		}
	} else {
		hook.value = compute();
	}

	didactState.wipFiber.hooks.push(hook);
	didactState.hookIndex++;

	return hook.value;
}
