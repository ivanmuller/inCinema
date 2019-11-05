import React, { useState, useEffect } from 'react';

import config from '../config';

import { connect } from 'react-redux';
import { addEvent, editAllEvents } from '../actions/events';
import { startLogout } from '../actions/auth';

import database from '../firebase/firebase';

import Event from './Event';
import EventAdd from './EventAdd';
import EventAddButtons from './EventAddButtons';

import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import Modal from 'react-modal';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import FlipMove from 'react-flip-move';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';

const prepareDataToSave = (mapper,itemsToRemove) => {
  let dataToSave = {};
  mapper.forEach(({id,...event}) => {
    dataToSave[id] = event;
  });
  itemsToRemove.forEach((id) => {
    dataToSave[id] = null;
  });
  return dataToSave;
}

const oderEvents = (events) => {
  return events.sort((a, b) => {
    return a.datetime < b.datetime ? -1 : 1;
  });
};

const DashboardAdmin = (props) => {
  const [isPaneOpen, setPaneOpened] = useState(false);
  const [isOpenDialogSearchEvent, setOpenDialogSearch] = useState(false);
  const [queueToDelete,setQueueToDelete] = useState([]);
  const [deployDisabled,setDeployDisabled] = useState(true);
  const [deployingStatus,setDeployingStatus] = useState(0);//0:idle 1:deploying 2:done

  useEffect(() => {
    Modal.setAppElement('#main');
  }, []);

  const handleOnEdit = (r) => {
    if (!r.error) {
      props.dispatch(editAllEvents(r.jsObject));
    }
  };

  const handleOpenDialogSearchEvent = (status) => {
    setOpenDialogSearch(status);
  };
  
  const handleAddEventManual = () => {
    props.dispatch(addEvent());
  };

  const handleQueueToDelete = (id) => {
    setQueueToDelete([...queueToDelete,id]);
  };

  const handleDeploy = () => {
    if (config.enableFirebase) {
      setDeployingStatus(1);
      setDeployDisabled(true);
      const deployedData = prepareDataToSave(props.events, queueToDelete);
      database.ref('events').update(deployedData).then(
        ()=> {
          setTimeout(() => setDeployingStatus(2), 1000);
          setTimeout(() => {
            setDeployDisabled(true);
            setDeployingStatus(0)
          }, 3000);
        }
      ).catch(()=> {
        alert('Error Updating Items');
      });
    }
  };

  return (
    <div id="main" className="admin">
  
        <SlidingPane
          className="custom-sliding-pane"
          isOpen={isPaneOpen}
          title="Edit in Advanced Mode"
          onRequestClose={() => {
            setPaneOpened(false)
          }}>
          <JSONInput
            id="advEditor"
            placeholder={props.events}
            locale={locale}
            onChange={handleOnEdit}
            width="100%"
            height="100%"
          />
        </SlidingPane>

        <div className="events-list">
          <FlipMove leaveAnimation="none">
            {props.events.map((event, index) => (
              <div key={event.id}><Event key={index} {...event} index={index} handleQueueToDelete={handleQueueToDelete}/></div>
            ))}
          </FlipMove>
        </div>

        <AppBar className="app-bar" position="fixed" color="default">
          <Toolbar disableGutters={true} className="tool-bar">
            <img src="images/icon.svg" alt="Popcorn" className="logo"/>
            <h1>{config.appTitle}</h1>
            <Button onClick={() => props.dispatch(startLogout())}>Log Out</Button>
            <EventAddButtons handleAddEventManual={handleAddEventManual} handleOpenDialogSearchEvent={handleOpenDialogSearchEvent} />
            <Button variant="contained" onClick={() => setPaneOpened(!isPaneOpen)}>Advanced Edition <Icon className="icon-button">code</Icon></Button>
            
            <ButtonGroup aria-label="button group">
              <Button disabled={deployDisabled} color="primary" variant="contained" onClick={handleDeploy}>
                Save & Deploy 
                { deployingStatus == 0 ? <Icon className="icon-button">screen_share</Icon> : ''}
                { deployingStatus == 1 ? <CircularProgress color="primary" className="progress" size={16}/> : ''}
                { deployingStatus == 2 ? <Icon className="icon-button">check_circle</Icon> : ''}     
              </Button>
              <Button color="primary" variant="contained" onClick={() => setDeployDisabled(!deployDisabled)}><Icon fontSize="small">{deployDisabled ? 'lock_open' : 'lock'}</Icon></Button>
            </ButtonGroup>
          </Toolbar>
        </AppBar>  
        
      <EventAdd handleOpenDialogSearchEvent={handleOpenDialogSearchEvent} isOpenDialogSearchEvent={isOpenDialogSearchEvent} />

    </div>
  )
};

const mapStateToProps = (state) => {
  return {
    events: oderEvents(state.events)
  }
}

//HOC
export default connect(mapStateToProps)(DashboardAdmin);