import React, { useState, useEffect } from 'react';

import config from '../config';

// Redux Store
import { connect } from 'react-redux';
import { addEvent, editAllEvents } from '../actions/events';

// My components
import Event from './Event';

// Third Party
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import Modal from 'react-modal';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';

// Third party styles
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Icon from '@material-ui/core/Icon';

import EventAdd from './EventAdd';
import EventAddButtons from './EventAddButtons';

const Dashboard = (props) => {
  const [isPaneOpen, setPaneOpened] = useState(false);
  const [isOpenDialogSearchEvent, setOpenDialogSearch] = useState(false);
  useEffect(() => {
    Modal.setAppElement('#main');
  }, []);
  const onEditHandle = (r) => {
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
              onChange={onEditHandle}
              width="100%"
              height="100%"
            />
          </SlidingPane>

          <div className="events-list">
              {props.events.map((event, index) => <Event key={index} {...event} index={index} />)}
          </div>

          <AppBar className="app-bar" position="fixed" color="default">
          <Toolbar disableGutters={true} className="tool-bar">
              <h1>{config.appTitle}</h1>
              <EventAddButtons handleAddEventManual={handleAddEventManual} handleOpenDialogSearchEvent={handleOpenDialogSearchEvent} />
              <Button variant="contained" onClick={() => setPaneOpened(true)}>Advanced Edition <Icon>code</Icon></Button>
              <Button color="primary" variant="contained">Save & Deploy <Icon>screen_share</Icon></Button>
            </Toolbar>
          </AppBar>  
          
        <EventAdd handleOpenDialogSearchEvent={handleOpenDialogSearchEvent} isOpenDialogSearchEvent={isOpenDialogSearchEvent} />

      </MuiThemeProvider>
    </div>
  )
};

const orderedEvents = (events) => {
    return events.sort((a, b) => {
        return a.datetime < b.datetime ? -1 : 1;
    });
};

const mapStateToProps = (state) => {
  return {
    events: orderedEvents(state.events)
  }
}

//HOC
export default connect(mapStateToProps)(Dashboard);