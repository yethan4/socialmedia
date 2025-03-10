import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import {thunk} from 'redux-thunk'; 
import allReducers from './reducers';
import './index.css';
import App from './App';
import { ScrollToTop } from './components';


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(allReducers, composeEnhancers(applyMiddleware(thunk))); 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <Router>
      <ScrollToTop />
      <App />
    </Router>
  </Provider>
);
