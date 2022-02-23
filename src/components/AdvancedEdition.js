import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { editAllEvents } from '@root/actions/events';

import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import Modal from 'react-modal';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const AdvancedEdition = (props) => {
  const [isPaneOpen, setPaneOpened] = useState(false);

  useEffect(() => {
    Modal.setAppElement('#main');
  }, []);

  const handleOnEdit = (r) => {
    if (!r.error) {
      props.dispatch(editAllEvents(r.jsObject));
    }
  };

  return(
    <>
      <SlidingPane
        className={"custom-sliding-pane " + (props.isSidebarOpen && 'sidebar-opened')}
        isOpen={isPaneOpen}
        title="Edit in Advanced Mode"
        width="60%"
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

      {props.viewType == 'button' ? (
        <Button variant="contained" onClick={() => setPaneOpened(!isPaneOpen)}>Advanced Edition <Icon>code</Icon></Button>
      ) : (
        <>
          <ListItem button onClick={() => setPaneOpened(!isPaneOpen)}>
            <ListItemIcon>
              <Icon>code</Icon>
            </ListItemIcon>
            <ListItemText primary="Advanced Edition" />
          </ListItem>
        </>
      )}
      
    </>
  )
}

const mapStateToProps = (state, props) => {
  return {
    events: state.events
  };
}

export default connect(mapStateToProps)(AdvancedEdition);