import React from 'react';
import { connect } from 'react-redux';
import { oderEvents } from '../utils/utils';

import Event from './Event';
import FlipMove from 'react-flip-move';

const DashboardPublic = (props) => {

  return (
    <div id="main" className="public">
      <div className="events-list">
        <FlipMove leaveAnimation="none">
          {props.events.map((event, index) => (
            <div key={event.id}><Event key={index} {...event} index={index} /></div>
          ))}
        </FlipMove>
      </div>
    </div>
  )
};

const mapStateToProps = (state) => {
  return {
    events: oderEvents(state.events)
  }
}

//HOC
export default connect(mapStateToProps)(DashboardPublic);