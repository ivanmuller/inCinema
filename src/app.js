import React from 'react';
import ReactDOM from 'react-dom';

// Store
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';

// My components
import Dashboard from './components/dashboard';

// My Styles
import 'normalize.css/normalize.css';
import './styles/styles.scss';

const store = configureStore();
//console.log(store.getState());
store.subscribe(() => {
  const state = store.getState();
  //const visibleExpenses = getVisibleExpenses(state.expenses, state.filters);
  //console.log(state);
});

const app = (
  <Provider store={store}>
    <Dashboard />
  </Provider>
);

ReactDOM.render(app, document.getElementById('app'));