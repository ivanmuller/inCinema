import React, { useState } from 'react';
import config from '@root/config';

import { connect } from 'react-redux';
import { startLogin } from '@root/firebase/firebase';

import { Link } from "react-router-dom";

import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import icon from '@root/images/icon.svg';

const LoginPage = ({ startLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [clickStatus, setClickStatus] = useState(0);//0:idle 1:loading 2:done
  const [transitionClass, setTransitionClass] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setClickStatus(1);
    startLogin({ email, password }).then(() => {
      setTransitionClass(true);
      setClickStatus(2);
    }).catch((error) => {
      setError(error);
      setClickStatus(0);
    });       
  };

  return (
    <div className={"login-mask " + (transitionClass ? 'transition' : '')}>
      node_env: {process.env.NODE_ENV} <br />
      fb_db: {process.env.FIREBASE_DATABASE_URL}
      <div className="login-wrapper">
        <img src={icon} className="logo" />
        <Card className="login-box">
          <h1>{config.appTitle}</h1>
          <form>
            <TextField
              id="email"
              label="Email"
              type="text"
              margin="normal"
              autoComplete="username"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button disabled={clickStatus != 0} onClick={handleSubmit} color="primary" variant="contained">
              {clickStatus == 0 && 'Log In'}
              {clickStatus == 1 && <>Logging In <CircularProgress color="primary" className="progress" size={16} /></>}
              {clickStatus == 2 && 'Done!'}
            </Button>
          </form>
          {error && <span className="error">{error.message}</span>}
        </Card>
        <Link className="link" to="/" exact="true">Go to Public Dashboard</Link>
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  startLogin: (email, password) => dispatch(startLogin(email, password))
});

export default connect(undefined, mapDispatchToProps)(LoginPage);