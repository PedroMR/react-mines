import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
//import App from './App';
import './mines.css';
import Main from './Main';
import registerServiceWorker from './registerServiceWorker';
import { compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers.js';

import persistState, {mergePersistedState} from 'redux-localstorage';
import adapter from 'redux-localstorage/lib/adapters/localStorage';

// localStorage.clear();

const storage = adapter(window.localStorage);

const enhancer = compose(
    persistState(storage, 'mines'),
    window.devToolsExtension ? window.devToolsExtension() : f => f,
)

const rehydratedReducer = compose(
  mergePersistedState()
)(reducer);

const store = createStore(rehydratedReducer, enhancer);

ReactDOM.render(<Provider store={store}><Main /></Provider>, document.getElementById('root'));
registerServiceWorker();
