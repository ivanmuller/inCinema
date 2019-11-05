import React from 'react';

// Redux Store
import { connect } from 'react-redux';
import { addEvent,removeEvent } from '../actions/events';

import Icon from '@material-ui/core/Icon';

const EventActions = (props) => {

    const handleRemoveEvent = (e) => {
      let thisId = props.event.id;
      props.handleQueueToDelete(thisId);
      props.dispatch(removeEvent({ id: thisId }));
      e.preventDefault();
    };

    const handleCopyEvent = (e) => {
      props.dispatch(addEvent({
        ...props.event
      }));
      e.preventDefault();
    };
    
    return (
      <div className="event-actions">
        <a href="/#"><Icon>visibility_off</Icon></a>
        <a href="/#" onClick={(e) => handleCopyEvent(e)}><Icon>file_copy</Icon></a>
        <a href="/#" className="delete" onClick={(e) => handleRemoveEvent(e)}><Icon>delete</Icon></a>
      </div>
    )
}

const mapStateToProps = (state, props) => {
  return {
    event: state.events.find((event) => event.id === props.id)
  };
}

export default connect(mapStateToProps)(EventActions);