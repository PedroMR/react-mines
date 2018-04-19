import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
//import App from './App';
import './mines.css';
import Game from './mines.jsx';
import registerServiceWorker from './registerServiceWorker';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers.js';

const store = createStore(reducer);

ReactDOM.render(<Provider store={store}><Game /></Provider>, document.getElementById('root'));
registerServiceWorker();
