import Didact from './didact.js';

function ParentCounter() {
	console.log('Parent');
	const [count, setCount] = Didact.useState(1);
	return Didact.createElement(
		'h1',
		{
			onClick: () => setCount((c) => c + 1),
		},
		'Count ',
		count
	);
}

export default ParentCounter;
