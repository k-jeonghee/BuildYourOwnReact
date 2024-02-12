import { didactState } from '../core';

export function useState(initial) {
	const oldHook =
		didactState.wipFiber.alternate &&
		didactState.wipFiber.hooks &&
		didactState.wipFiber.alternate.hooks[didactState.hookIndex];

	const hook = {
		state: oldHook ? oldHook.state : initial,
		queue: [],
	};

	const actions = oldHook ? oldHook.queue : [];
	actions.forEach((action) => {
		hook.state = action(hook.state);
	});

	const setState = (action) => {
		if (typeof action === 'function') {
			hook.queue.push(action);
		} else {
			hook.queue.push(() => action);
		}

		didactState.wipRoot = {
			dom: didactState.currentRoot.dom,
			props: didactState.currentRoot.props,
			alternate: didactState.currentRoot,
		};
		didactState.nextUnitOfWork = didactState.wipRoot;
		didactState.deletions = [];
	};

	didactState.wipFiber.hooks.push(hook);
	didactState.hookIndex++;
	return [hook.state, setState];
}
