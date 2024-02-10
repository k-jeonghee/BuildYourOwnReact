import Didact from './didact';

function ChildCounter() {
	console.log('Child');
	const [num, setNum] = Didact.useState(2);
	return Didact.createElement(
		'p',
		{
			onClick: () => setNum((c) => c * 2),
		},
		'Num ',
		num
	);
}

export default ChildCounter;
