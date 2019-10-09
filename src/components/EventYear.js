import React, { useState } from 'react';
import config from '../config';

// Redux Store
import { connect } from 'react-redux';
import { editEvent } from '../actions/events';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const EventYear = (props) => {
  const [open, setOpen] = useState(false);
  const { year, id } = props.event;
  const handleYearChange = (e) => {
    const year = e.target.value;
    props.dispatch(editEvent(id, { 'year': year }));
  };
  const handleOpenState = (e, status) => {
    setOpen(status);
    e.preventDefault();
  };
  const getYearsSelector = () => {
    const yearsMax = new Date().getFullYear();
    let renderedOptions = [];
    for (var i = config.yearsMin; i <= yearsMax; i++) {
      renderedOptions.push(<MenuItem key={i} value={i}>{i}</MenuItem>);
    }    
    return renderedOptions
  }
  return (
    <div className="event-year">
      <a href="#" onClick={(e) => handleOpenState(e, true)}>{year}</a><br />
        <Select
          className="hide"
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          value={year}
          onChange={handleYearChange}
        >
        {getYearsSelector()}
        </Select>
    </div>
  )
}

const mapStateToProps = (state, props) => {
  return {
    event: state.events.find((event) => event.id === props.id)
  };
}

export default connect(mapStateToProps)(EventYear);