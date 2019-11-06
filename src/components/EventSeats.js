import React from 'react';
import config from '../config';

import { connect } from 'react-redux';

import Icon from '@material-ui/core/Icon';

const EventsSeats = ({ finished, event: { seats }}) => {

  const handleSeats = () => {
    switch (true) {
      case (seats === 0 || finished):
        return "Sold";
        break;
      case (seats == 1):
        return `${seats} seat left`;
        break;
      case (seats <= 10):
        return `${seats} seats left`;
        break;
      default:
        return `Seats Available`;
        break;
    }
  };

  const handleSeatsIcons = () => {
    let renderedIcons = [];
    if (seats <= config.seatsWarningThresold) {
      for (let i = 0; i < seats; i++) {
        renderedIcons.push(<Icon key={i} color="error">event_seat</Icon>);
      }
      return (
        <div className="icons-seats blink-1">{renderedIcons}</div>
      )
    }else{
      return (
        <div className="icons-seats"><Icon>event_seat</Icon> {seats}+</div>
      )
    }
  };

  return (
    <div className="event-item-section event-tickets">
      <span>{handleSeats()}</span>
      {(seats > 0 && !finished) && 
        handleSeatsIcons()
      }
    </div>
  )
}

const mapStateToProps = (state, props) => {
  return {
    event: state.events.find((event) => {
      return event.id === props.id
    })
  };
}

export default connect(mapStateToProps)(EventsSeats);