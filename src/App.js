import ChildCounter from './ChildCounter';
import ParentCounter from './ParentCounter';
import Didact from './didact';

function App() {
	return Didact.createElement('div', null, ParentCounter(), ChildCounter());
}

export default App;
