import Didact from '../didact.js';
import ChildCounter from './ChildCounter.js';

function ParentCounter() {
	console.log('Parent');
	const [count, setCount] = Didact.useState(1);
	const [memo, setMemo] = Didact.useState(100);
	return Didact.createElement(
		'div',
		{
			onClick: () => setMemo((c) => c + 10),
		},
		'Count ',
		memo,
		ChildCounter(count)
	);
}

export default ParentCounter;
