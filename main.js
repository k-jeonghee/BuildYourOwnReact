import Didact from './src/didact.js';
import App from './src/App.js';

const element = Didact.createElement(App);
const container = document.getElementById('root');
Didact.render(element, container);
