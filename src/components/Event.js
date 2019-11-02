import React, { useState, useEffect } from 'react';
import config from '../config';

import { isAdmin } from '../utils/utils';

// Redux Store
import { connect } from 'react-redux';
import { editEvent, removeEvent } from '../actions/events';

import Icon from '@material-ui/core/Icon';
import Card from '@material-ui/core/Card';

import useInterval from '../hooks/useInterval';
import EventPoster from './EventPoster';
import EventTitle from './EventTitle';
import EventSeats from './EventSeats';
import EventRoom from './EventRoom';

import moment from 'moment';
import {DateTimePicker,  MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';

const Event = (props) => {
  const [timeDifference, setTimeDifference] = useState('first');
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [pickerIsOpen, setPickerIsOpen] = useState(false);
  const [tempDateTimeSelected, setTempDateTimeSelected] = useState(props.dateTime);

  const handleDateChange = (date) => {
    setTempDateTimeSelected(date.format('YYYY-MM-DD HH:mm:ss'));
  };

  const handleRemoveEvent = (e) => {
    let thisId = props.id;
    props.handleQueueToDelete(thisId);
    props.dispatch(removeEvent({ id: thisId }));
    e.preventDefault();
  };

  const setDatePickerOpen = (e, status) => {
    setPickerIsOpen(status);
    if(status == false){
      props.dispatch(editEvent(props.id, { 'datetime': tempDateTimeSelected }));
      console.log('dispatch!');
    }
    if(e){e.preventDefault()}
  };

  const handleDate = () => {
    const now = moment();
    const eventTime = moment(props.datetime);
    const humanDiff = moment(eventTime).fromNow(true);
    const eventTimeFinished = moment(props.datetime).add(props.duration, 'm');
    if (now.isAfter(eventTimeFinished)) { //Finished Event
      const humanDiff = moment(eventTimeFinished).fromNow(true);
      setTimeDifference(`<span>Finished</span> ${humanDiff} ago`);
      setPlaying(false);
      setFinished(true);
    } else if(eventTime.isBefore(now)) {//already started event
      setTimeDifference(`<span>Started</span> ${humanDiff} ago`);
      setPlaying(true);
      setFinished(false);
    }else {//not started event
      setTimeDifference(`<span>Starts in</span> ${humanDiff}`);
      setPlaying(false);
      setFinished(false);
    }
  };

  useInterval(() => {
    handleDate();
  }, config.dateIntervalrefresh);

  useEffect(() => {
    handleDate();
  }, []);

  useEffect(() => {
    handleDate();
  }, [pickerIsOpen])
  
  return (
    <Card className={['event-item', finished && 'finished', playing && 'playing'].join(" ")}>

      <EventPoster id={props.id} playing={playing} />
      <EventTitle id={props.id} />

      <div className="event-item-section event-time">
        <a href="#" onClick={(e) => setDatePickerOpen(e, true)} dangerouslySetInnerHTML={{ __html: timeDifference }}></a><br />
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <DateTimePicker
            className="hide"
            variant="inline"
            ampm={true}
            open={pickerIsOpen}
            onOpen={(e) => setDatePickerOpen(e, true)}
            onClose={(e) => setDatePickerOpen(e, false)}
            value={props.datetime}
            onChange={handleDateChange} />
        </MuiPickersUtilsProvider>
      </div>

      <EventSeats id={props.id} finished={finished} />
      <EventRoom id={props.id} />
      <div className="event-actions">
        <a href="/#"><Icon>visibility_off</Icon></a>
        <a href="/#"><Icon>file_copy</Icon></a>
        <a href="/#" className="delete" onClick={(e) => handleRemoveEvent(e)}><Icon>delete</Icon></a>
      </div>
    </Card>
  )
}

const mapStateToProps = (state, props) => {
  return {
    events: state.events.find((event) => event.id === props.id)
  };
}

export default connect(mapStateToProps)(Event);
