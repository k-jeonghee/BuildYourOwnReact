import Didact from '../didact.js';
import { useEffect } from '../hooks/useEffect.js';
import { useCallback } from '../hooks/useCallback';
import ChildCounter from './ChildCounter.js';

function ParentCounter() {
	console.log('Parent');
	const [count, setCount] = Didact.useState(1);
	const [count2, setCount2] = Didact.useState(100);
	const memoizedCallback = useCallback(() => console.log(`useCallback 호출: ${count}`), [count]);
	useEffect(() => {
		console.log('useEffect 실행');
	}, []);
	return Didact.createElement(
		'div',
		null,
		Didact.createElement(
			'p',
			{
				onClick: () => setCount((c) => c + 10),
			},
			`Count: ${count}`
		),
		Didact.createElement(
			'p',
			{
				onClick: () => setCount2((c) => c + 10),
			},
			`Count2: ${count2}`
		),
		ChildCounter(count, memoizedCallback)
	);
}

export default ParentCounter;
