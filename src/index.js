import React from 'react';
import ReactDOM from 'react-dom';
import './mines.css';
import Main from './meta/Main';
import registerServiceWorker from './registerServiceWorker';
import { compose, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers.js';
import invariant from 'redux-immutable-state-invariant';
import persistState, {mergePersistedState} from 'redux-localstorage';
import adapter from 'redux-localstorage/lib/adapters/localStorage';

// localStorage.clear();

const storage = adapter(window.localStorage);
const composeEnhancers =  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = compose(
  persistState(storage, 'mines'),
  applyMiddleware(invariant()), 
  // window.devToolsExtension ? window.devToolsExtension() : f => f,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
)

const rehydratedReducer = compose(
  mergePersistedState()
)(reducer);

const store = createStore(rehydratedReducer, enhancer);


ReactDOM.render(<Provider store={store}><Main /></Provider>, document.getElementById('root'));
registerServiceWorker();
