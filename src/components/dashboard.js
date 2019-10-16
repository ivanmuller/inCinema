import React, { useState, useEffect } from 'react';

import config from '../config';

// Redux Store
import { connect } from 'react-redux';
import { addEvent, editAllEvents } from '../actions/events';

// Firebase
import database from '../firebase/firebase';

// Components
import Event from './Event';
import EventAdd from './EventAdd';
import EventAddButtons from './EventAddButtons';

// Third Party
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import Modal from 'react-modal';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import FlipMove from 'react-flip-move';

// Third party styles
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import Button from '@material-ui/core/Button';
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

const Dashboard = (props) => {
  const [isPaneOpen, setPaneOpened] = useState(false);
  const [isOpenDialogSearchEvent, setOpenDialogSearch] = useState(false);
  const [queueToDelete,setQueueToDelete] = useState([]);
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
    setDeployingStatus(1);
    const deployedData = prepareDataToSave(props.events, queueToDelete);
    database.ref('events').update(deployedData).then(
      ()=> {
        setTimeout(() => setDeployingStatus(2), 1000);
        setTimeout(() => setDeployingStatus(0), 3000);
      }
    ).catch(()=> {
      console.log('Error Updating Items')
    });
  };

  return (
    <div id="main">
    
      <MuiThemeProvider theme={theme}>
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
              <h1>{config.appTitle}</h1>
              <EventAddButtons handleAddEventManual={handleAddEventManual} handleOpenDialogSearchEvent={handleOpenDialogSearchEvent} />
              <Button variant="contained" onClick={() => setPaneOpened(!isPaneOpen)}>Advanced Edition <Icon>code</Icon></Button>
              <Button disabled={deployingStatus != 0} color="primary" variant="contained" onClick={handleDeploy}>
                Save & Deploy 
                { deployingStatus == 0 ? <Icon>screen_share</Icon> : ''}
                { deployingStatus == 1 ? <CircularProgress color="primary" className="progress" size={16}/> : ''}
                { deployingStatus == 2 ? <Icon>check_circle</Icon> : ''}                
              </Button>
            </Toolbar>
          </AppBar>  
          
        <EventAdd handleOpenDialogSearchEvent={handleOpenDialogSearchEvent} isOpenDialogSearchEvent={isOpenDialogSearchEvent} />

      </MuiThemeProvider>
    </div>
  )
};

const mapStateToProps = (state) => {
  return {
    events: oderEvents(state.events)
  }
}

//HOC
export default connect(mapStateToProps)(Dashboard);