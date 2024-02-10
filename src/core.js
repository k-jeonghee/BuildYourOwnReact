const fiberType = {
	TextElement: 'TEXT_ELEMENT',
};

const fiberEffectTag = {
	Deletion: 'DELETION',
	Update: 'UPDATE',
	Placement: 'PLACEMENT',
};

export const didactState = {
	nextUnitOfWork: null,
	deletions: null,
	currentRoot: null,
	wipFiber: null,
	wipRoot: null,
	hookIndex: null,
};

export function createElement(type, props, ...children) {
	return {
		type,
		props: {
			...props,
			children: children.map((child) => {
				if (typeof child === 'object') {
					return child;
				} else {
					return createTextElement(child);
				}
			}),
		},
	};
}

function createTextElement(text) {
	return {
		type: fiberType.TextElement,
		props: {
			nodeValue: text,
			children: [],
		},
	};
}

function createDomNode(fiber) {
	const domNode =
		fiber.type === fiberType.TextElement
			? document.createTextNode(fiber.props.nodeValue)
			: document.createElement(fiber.type);

	updateDom(domNode, {}, fiber.props);

	return domNode;
}

const isEvent = (key) => key.startsWith('on');
const isProperty = (key) => key !== 'children' && !isEvent(key);
const isNew = (prev, next) => (key) => prev[key] !== next[key];
const isGone = (prev, next) => (key) => !(key in next);

function convertStyleObjectToCssString(styleObj) {
	return Object.entries(styleObj).reduce((acc, [key, value]) => {
		return (
			acc +
			`${key.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`)}:${value};`
		);
	}, '');
}

function updateDom(domNode, prevProps, nextProps) {
	//Remove old or changed event listeners
	Object.keys(prevProps)
		.filter(isEvent)
		.filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
		.forEach((name) => {
			const eventType = name.toLowerCase().substring(2);
			domNode.removeEventListener(eventType, prevProps[name]);
		});

	// Remove old properties
	Object.keys(prevProps)
		.filter(isProperty)
		.filter(isGone(prevProps, nextProps))
		.forEach((name) => {
			domNode[name] = '';
		});

	// Set new or changed properties
	Object.keys(nextProps)
		.filter(isProperty)
		.filter(isNew(prevProps, nextProps))
		.forEach((name) => {
			if (name === 'style') {
				domNode[name] = convertStyleObjectToCssString(nextProps[name]);
			} else {
				domNode[name] = nextProps[name];
			}
		});

	// Add event listeners
	Object.keys(nextProps)
		.filter(isEvent)
		.filter(isNew(prevProps, nextProps))
		.forEach((name) => {
			const eventType = name.toLowerCase().substring(2);
			domNode.addEventListener(eventType, nextProps[name]);
		});
}

export function render(element, container) {
	didactState.wipRoot = {
		dom: container,
		props: {
			children: [element],
		},

		alternate: didactState.currentRoot,
	};

	didactState.deletions = [];
	didactState.nextUnitOfWork = didactState.wipRoot;
}

function commitRoot() {
	didactState.deletions.forEach(commitWork);
	if (didactState.wipRoot) {
		commitWork(didactState.wipRoot.child);
	}
	didactState.currentRoot = didactState.wipRoot;
	didactState.wipRoot = null;
}

function commitDeletion(fiber, domParent) {
	if (fiber.dom) {
		domParent.removeChild(fiber.dom);
	} else {
		commitDeletion(fiber.child, domParent);
	}
}

function commitWork(fiber) {
	if (!fiber) {
		return;
	}

	let domParentFiber = fiber.parent;
	while (!domParentFiber.dom) {
		domParentFiber = domParentFiber.parent;
	}
	const domParent = domParentFiber.dom;

	if (fiber.effectTag === fiberEffectTag.Placement && fiber.dom != null) {
		domParent.appendChild(fiber.dom);
	} else if (fiber.effectTag == fiberEffectTag.Update && fiber.dom != null) {
		updateDom(fiber.dom, fiber.alternate.props, fiber.props);
	} else if (fiber.effectTag === fiberEffectTag.Deletion) {
		commitDeletion(fiber, domParent);
	}
	commitWork(fiber.child);
	commitWork(fiber.sibling);
}

function performUnitOfWork(fiber) {
	const isFunctionComponent = fiber.type instanceof Function;
	if (isFunctionComponent) {
		updateFunctionComponent(fiber);
	} else {
		updateHostComponent(fiber);
	}

	if (fiber.child) {
		return fiber.child;
	}

	let nextFiber = fiber;
	while (nextFiber) {
		if (nextFiber.sibling) {
			return nextFiber.sibling;
		}
		nextFiber = nextFiber.parent;
	}
}

function updateFunctionComponent(fiber) {
	didactState.wipFiber = fiber;
	didactState.wipFiber.hooks = [];
	didactState.hookIndex = 0;

	const children = [fiber.type(fiber.props)];

	reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
	if (!fiber.dom) {
		fiber.dom = createDomNode(fiber);
	}
	reconcileChildren(fiber, fiber.props.children);
}

function reconcileChildren(wipFiber, elements) {
	let index = 0;
	let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
	let prevSibling = null;

	while (index < elements.length || oldFiber != null) {
		const element = elements[index];
		let newFiber;

		const sameType = oldFiber && element && element.type == oldFiber.type;

		if (sameType) {
			newFiber = {
				type: oldFiber.type,
				props: element.props,
				dom: oldFiber.dom,
				parent: wipFiber,
				alternate: oldFiber,
				effectTag: fiberEffectTag.Update,
			};
		}
		if (element && !sameType) {
			newFiber = {
				type: element.type,
				props: element.props,
				dom: null,
				parent: wipFiber,
				alternate: null,
				effectTag: fiberEffectTag.Placement,
			};
		}
		if (oldFiber && !sameType) {
			oldFiber.effectTag = fiberEffectTag.Deletion;
			didactState.deletions.push(oldFiber);
		}

		if (oldFiber) {
			oldFiber = oldFiber.sibling;
		}

		if (index === 0) {
			wipFiber.child = newFiber;
		} else if (element) {
			prevSibling.sibling = newFiber;
		}

		prevSibling = newFiber;
		index++;
	}
}

function workLoop(deadline) {
	let shouldYield = false;

	while (didactState.nextUnitOfWork && !shouldYield) {
		didactState.nextUnitOfWork = performUnitOfWork(didactState.nextUnitOfWork);
		shouldYield = deadline.timeRemaining() < 1;
	}

	if (!didactState.nextUnitOfWork && didactState.wipRoot) {
		commitRoot();
	}

	requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);
