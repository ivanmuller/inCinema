import React, { useState } from 'react';
import config from '../config';
import { prepareDataToSave, oderEvents } from '../utils/utils';

import { connect } from 'react-redux';
import { addEvent } from '../actions/events';

// Firebase
import * as firebase from '../firebase/firebase';

import Event from './Event';
import EventAdd from './EventAdd';
import EventAddButtons from './EventAddButtons';

import FlipMove from 'react-flip-move';
import Sidebar from './Sidebar';

import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';

const DashboardAdmin = (props) => {
  const [isOpenDialogSearchEvent, setOpenDialogSearch] = useState(false);
  const [queueToDelete,setQueueToDelete] = useState([]);
  const [deployDisabled,setDeployDisabled] = useState(true);
  const [deployingStatus,setDeployingStatus] = useState(0);//0:idle 1:deploying 2:done
  const [isSidebarOpen, setSidebarOpened] = useState(false);

  const handleOpenDialogSearchEvent = (status) => {
    setOpenDialogSearch(status);
  };
  
  const handleAddEventManual = () => {
    props.dispatch(addEvent());
  };

  const handleQueueToDelete = (id) => {
    setQueueToDelete([...queueToDelete,id]);
  };

  const handleSidebarOpen = (status) => {
    setSidebarOpened(status);
  };

  const handleDeploy = () => {
    if (config.enableFirebase) {
      setDeployingStatus(1);
      setDeployDisabled(true);
      const deployedData = prepareDataToSave(props.events, queueToDelete);
      firebase.sSet(firebase.eventsRefDB, deployedData).then(
        ()=> {
          setTimeout(() => setDeployingStatus(2), 1000);
          setTimeout(() => {
            setDeployDisabled(true);
            setDeployingStatus(0)
          }, 3000);
        }
      ).catch(()=> {
        console.log(config.errors.deploy);
      });
    }
  };

  return (
    <>
      <div id="main" className={"admin " + (isSidebarOpen && 'sidebar-opened')}>
    
        <div className="events-list">
          <FlipMove leaveAnimation="none">
            {props.events.map((event, index) => (
              <div key={event.id}><Event key={index} {...event} index={index} handleQueueToDelete={handleQueueToDelete}/></div>
            ))}
          </FlipMove>
        </div>

        <AppBar className={"app-bar " + (isSidebarOpen && 'sidebar-opened')} position="fixed" color="default">
          <Toolbar disableGutters={true} className="tool-bar">

            <img src={require("@/images/icon.svg")} alt="Popcorn" className="logo"/>
            <h1>{config.appTitle}</h1>

            <EventAddButtons handleAddEventManual={handleAddEventManual} handleOpenDialogSearchEvent={handleOpenDialogSearchEvent} />

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
              onClick={() => { handleSidebarOpen(!isSidebarOpen)}}
            >
              <Icon>menu</Icon>
            </IconButton>

          </Toolbar>
        </AppBar>  
          
        <EventAdd handleOpenDialogSearchEvent={handleOpenDialogSearchEvent} isOpenDialogSearchEvent={isOpenDialogSearchEvent} />

      </div>
      <Sidebar isSidebarOpen={isSidebarOpen} handleSidebarOpen={handleSidebarOpen}/>
    </>
  )
};

const mapStateToProps = (state) => {
  return {
    events: oderEvents(state.events)
  }
}

//HOC
export default connect(mapStateToProps)(DashboardAdmin);