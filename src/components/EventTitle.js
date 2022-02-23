import React from 'react';

import { connect } from 'react-redux';
import { editEvent } from '@root/actions/events';

import { EventYearAdminConn as EventYearAdmin, EventYearPublicConn as EventYearPublic } from '@root/components/EventYear';
import { EventTypeAdminConn as EventTypeAdmin, EventTypePublicConn as EventTypePublic } from '@root/components/EventType';

const EventTitleAdmin = ({dispatch, event: { title, id }}) => {

    const handleTitleChange = (e) => {
      const title = e.target.value;
      dispatch(editEvent(id, { title }));
    };

    return (
      <div className="event-item-section event-title">
        <h2>
          <input type="text" placeholder="Movie Title" onChange={handleTitleChange} size={title.length} value={title} />
        </h2>
        <EventTypeAdmin id={id} />
        <EventYearAdmin id={id} />
      </div>
    )
}

const EventTitlePublic = ({event: { title, id }}) => {
  return (
    <div className="event-item-section event-title">
      <h2>{title}</h2>
      <EventTypePublic id={id} />
      <EventYearPublic id={id} />
    </div>
  )
}

const mapStateToProps = (state, props) => {
  return {
    event: state.events.find((event) => event.id === props.id)
  };
}

export const EventTitleAdminConn = connect(mapStateToProps)(EventTitleAdmin);
export const EventTitlePublicConn = connect(mapStateToProps)(EventTitlePublic);