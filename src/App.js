import ParentCounter from './components/ParentCounter';
import Didact from './didact';

function App() {
	return Didact.createElement('div', null, ParentCounter());
}

export default App;
