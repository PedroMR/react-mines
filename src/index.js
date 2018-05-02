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

var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();
console.log("params", urlParams);

if (urlParams.clear) {
  localStorage.clear();
  console.log("clearing localStorage");
}

const devToolsOptions = {shouldHotReload: true};

const storage = adapter(window.localStorage);
const composeEnhancers =  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? 
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(devToolsOptions) : compose;
const enhancer = composeEnhancers(
  persistState(storage, 'mines'),
  applyMiddleware(invariant()),
)

const rehydratedReducer = compose(
  mergePersistedState()
)(reducer);

const store = createStore(rehydratedReducer, enhancer);


ReactDOM.render(<Provider store={store}><Main /></Provider>, document.getElementById('root'));
registerServiceWorker();
