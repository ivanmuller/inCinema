import React from 'react';
import ReactDOM from 'react-dom';

import config from '@root/config';
import { isAdminPage } from '@root/utils/utils';
import AppRouter from '@root/routers/AppRouter';
import fakeData from '@root/data/data';
import { login, logout } from '@root/actions/auth';

// Store
import { Provider } from 'react-redux';
import configureStore from '@root/store/configureStore';
import { fetchAllEvents } from '@root/actions/events';

// Firebase
import * as firebase from '@root/firebase/firebase';

import cogoToast from 'cogo-toast';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from '@root/theme/theme'; 

// My Styles
import 'normalize.css/normalize.css';
import '@root/styles/styles.scss';

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
if (config.enableFirebase) {
  firebase.onAuthStateChanged(firebase.auth, (user) => {
    if (user) {
      setTimeout(() => {
        store.dispatch(login(user.uid));
      }, config.loginTimeout);
    } else {
      store.dispatch(logout());
    }
  });
}
