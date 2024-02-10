import Didact from '../didact';

function ChildCounter(count) {
	console.log('Child');
	return Didact.createElement('div', null, 'Child ', count);
}

export default Didact.memo(ChildCounter);
