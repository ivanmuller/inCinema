import React from 'react';

// Redux Store
import { connect } from 'react-redux';
import { editEvent } from '../actions/events';

import EventYear from './EventYear';
import EventType from './EventType';

const EventTitle = (props) => {
    const { title, id} = props.event;
    const handleTitleChange = (e) => {
      const title = e.target.value;
      props.dispatch(editEvent(id, { title }));
    };
    return (
      <div className="event-item-section event-title">
        <h2>
          <input type="text" placeholder="Movie Title" onChange={handleTitleChange} size={title.length} value={title} />
        </h2>
        {<EventType id={id} />}
        {<EventYear id={id} />}
      </div>
    )
}

const mapStateToProps = (state, props) => {
  return {
    event: state.events.find((event) => event.id === props.id)
  };
}

export default connect(mapStateToProps)(EventTitle);