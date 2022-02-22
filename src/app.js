import React from 'react';
import ReactDOM from 'react-dom';

import config from './config';
import { isAdminPage } from './utils/utils';
import AppRouter from './routers/AppRouter';
import fakeData from './data/data';
import { login, logout } from './actions/auth';

// Store
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import { fetchAllEvents } from './actions/events';

// Firebase
import * as firebase from './firebase/firebase';

import cogoToast from 'cogo-toast';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme/theme'; 

// My Styles
import 'normalize.css/normalize.css';
import './styles/styles.scss';

const store = configureStore();

const app = (
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <AppRouter />
    </MuiThemeProvider>
  </Provider>
)

const loading = (
  <div className="spinner-wrap">
    <div className="spinner-loader"></div>
  </div>
)

ReactDOM.render(loading, document.getElementById('app'));

// fetching data from databse
let firstLoad = true;
if (config.enableFirebase) {

  firebase.onValue(firebase.eventsRefDB, (snapshot) => {
    const events = [];
    snapshot.forEach((childSnapshot) => {
      events.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    if (!isAdminPage() && !firstLoad){
      cogoToast.loading('Fetching new data...').then(() => {
        store.dispatch(fetchAllEvents(events));
        firstLoad = false;
      });
    }else{ 
      store.dispatch(fetchAllEvents(events));
      firstLoad = false;
    }    
    ReactDOM.render(app, document.getElementById('app'));
  }, (e) => {
    ReactDOM.render(loading, document.getElementById('app'));
  });

} else {//load fake data
  store.dispatch(fetchAllEvents(fakeData));
  ReactDOM.render(app, document.getElementById('app'));
}

firebase.onAuthStateChanged(firebase.auth, (user) => {
  if (user) {
    setTimeout(() => {
      store.dispatch(login(user.uid));
    }, 2000);
  } else {
    store.dispatch(logout());
  }
});
