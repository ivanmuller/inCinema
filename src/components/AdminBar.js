import React, { useState } from 'react';
import config from '@root/config';
import { connect } from 'react-redux';

import { prepareDataToSave } from '@root/utils/utils';
import { addEvent } from '@root/actions/events';

// Firebase
import * as firebase from '@root/firebase/firebase';

import EventAddButtons from '@root/components/EventAddButtons';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';

import icon from '@root/images/icon.svg';

const AdminBar = (props) => {
  const [deployDisabled, setDeployDisabled] = useState(true);
  const [deployingStatus, setDeployingStatus] = useState(0);//0:idle 1:deploying 2:done

  const handleAddEventManual = () => {
    props.dispatch(addEvent());
  };

  const handleDeploy = () => {
    if (config.enableFirebase) {
      setDeployingStatus(1);
      setDeployDisabled(true);
      const deployedData = prepareDataToSave(props.events, props.queueToDelete);
      firebase.sSet(firebase.eventsRefDB, deployedData).then(
        () => {
          setTimeout(() => setDeployingStatus(2), 1000);
          setTimeout(() => {
            setDeployDisabled(true);
            setDeployingStatus(0)
          }, 3000);
        }
      ).catch(() => {
        console.log(config.errors.deploy);
      });
    }
  };

  return (
    <>
      <AppBar className={"app-bar " + (props.isSidebarOpen && 'sidebar-opened')} position="fixed" color="default">
        <Toolbar disableGutters={true} className="tool-bar">

          <img src={icon} alt="Popcorn" className="logo" />
          <h1>{config.appTitle}</h1>

          <EventAddButtons handleAddEventManual={handleAddEventManual} handleOpenDialogSearchEvent={props.handleOpenDialogSearchEvent} />

          <ButtonGroup aria-label="button group">
            <Button disabled={deployDisabled} color="primary" variant="contained" onClick={handleDeploy}>
              {deployingStatus == 0 ? <>Send & Deploy <Icon className="icon-button">screen_share</Icon></> : ''}
              {deployingStatus == 1 ? <>Sending... <CircularProgress color="primary" className="progress" size={16} /></> : ''}
              {deployingStatus == 2 ? <>Done! <Icon className="icon-button">check_circle</Icon></> : ''}
            </Button>
            <Button color="primary" variant="contained" onClick={() => setDeployDisabled(!deployDisabled)}><Icon fontSize="small">{deployDisabled ? 'lock' : 'lock_open'}</Icon></Button>
          </ButtonGroup>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={() => { props.handleSidebarOpen(!props.isSidebarOpen) }}
          >
            <Icon>menu</Icon>
          </IconButton>

        </Toolbar>
      </AppBar>  
    </>
  )
}

const mapStateToProps = (state, props) => {
  return {
    events: state.events
  };
}

export default connect(mapStateToProps)(AdminBar);