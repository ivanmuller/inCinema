import React from 'react';
import ReactDOM from 'react-dom';

// Store
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';

// My components
import Dashboard from './components/Dashboard';

// My Styles
import 'normalize.css/normalize.css';
import './styles/styles.scss';

const store = configureStore();
store.subscribe(() => {
  const state = store.getState();
});

const app = (
  <Provider store={store}>
    <Dashboard />
  </Provider>
);

ReactDOM.render(app, document.getElementById('app'));