import React from 'react';
import ReactDOM from 'react-dom';

import config from './config';
import fakeData from './data/data';

// Store
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import { fetchAllEvents } from './actions/events';

// Firebase
import database from './firebase/firebase';

// My components
import Dashboard from './components/Dashboard';

// My Styles
import 'normalize.css/normalize.css';
import './styles/styles.scss';

const store = configureStore();

const app = (
  <Provider store={store}>
    <Dashboard />
  </Provider>
);
const loading = (
  <div className="spinner-wrap">
    <div className="spinner-loader"></div>
  </div>
);
const error = (
  <p>Loading Error</p>
);

ReactDOM.render(loading, document.getElementById('app'));

// fetching data from databse
if (config.enableFirebase) {
  database.ref('events').on('value', (snapshot) => {
    const events = [];
    snapshot.forEach((childSnapshot) => {
      events.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
      store.dispatch(fetchAllEvents(events));
      ReactDOM.render(app, document.getElementById('app'));
    });
  }, (e) => {
    ReactDOM.render(loading, document.getElementById('app'));
  });
} else {//load fake data
    store.dispatch(fetchAllEvents(fakeData));
    ReactDOM.render(app, document.getElementById('app'));
}

