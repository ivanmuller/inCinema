import React from 'react';
import config from '../config';

// Redux Store
import { connect } from 'react-redux';
import { editEvent, removeEvent } from '../actions/events';

import Icon from '@material-ui/core/Icon';
import Card from '@material-ui/core/Card';

import EventPoster from './EventPoster';
import EventTitle from './EventTitle';
import EventSeats from './EventSeats';
import EventRoom from './EventRoom';

import moment from 'moment';
import {DateTimePicker,  MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';

class Event extends React.Component {
  state = {
    timeDifference: "",
    playing: false,
    finished: false,
    pickerIsOpen: false
  };
  handleDateChange = (date) => {
    this.props.dispatch(editEvent(this.props.id,{'datetime': date.format('YYYY-MM-DD HH:mm:ss')}));
  };
  handleRemoveEvent = (e) => {
    this.props.dispatch(removeEvent({id: this.props.id}));
    this.props.handleQueueToDelete(this.props.id);
    e.preventDefault();
  };
  setDatePickerOpen = (e, status) => {
    this.setState({ pickerIsOpen: status });
    if(e){e.preventDefault()}
  };
  handleDate = () => {
    const now = moment();
    const eventTime = moment(this.props.datetime);
    const humanDiff = moment(eventTime).fromNow(true);
    const eventTimeFinished = moment(this.props.datetime).add(this.props.duration, 'm');
    if (now.isAfter(eventTimeFinished)) { //Finished Event
      const humanDiff = moment(eventTimeFinished).fromNow(true);
      this.setState({
        timeDifference: `<span>Finished</span> ${humanDiff} ago`,
        playing: false,
        finished: true
      });
    } else if(eventTime.isBefore(now)) {//already started event
      this.setState({
        timeDifference: `
          <span>Started</span> ${humanDiff} ago
        `,
        playing: true,
        finished: false
      });
    }else {//not started event
      this.setState({
        timeDifference: `<span>Starts in</span> ${humanDiff}`,
        playing: false,
        finished: false
      });
    }
  };
  componentDidMount() {
    this.handleDate();
    this.interval = setInterval(() => {
      this.handleDate();
    }, config.dateIntervalrefresh);
  };
  componentWillUnmount() {
    clearInterval(this.interval);
  };
  componentDidUpdate(prevPros){
    if (prevPros.datetime !== this.props.datetime || prevPros.duration !== this.props.duration){
      this.handleDate();
    }
  };  
  render() {
    const {id,datetime} = this.props;
    return (
      <Card className={['event-item', this.state.finished && 'finished', this.state.playing && 'playing'].join(" ")}>

        <EventPoster id={id} playing={this.state.playing} />
        <EventTitle id={id} />

        <div className="event-item-section event-time">
          <a href="#" onClick={(e) => this.setDatePickerOpen(e, true)} dangerouslySetInnerHTML={{ __html: this.state.timeDifference }}></a><br />
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DateTimePicker
              className="hide"
              variant="inline"
              ampm={true}
              open={this.state.pickerIsOpen}
              onOpen={(e) => this.setDatePickerOpen(e, true)}
              onClose={(e) => this.setDatePickerOpen(e, false)}
              value={datetime}
              onChange={this.handleDateChange} />
          </MuiPickersUtilsProvider>
        </div>

        <EventSeats id={id} processed={{ ...this.state }} />
        <EventRoom id={id} />
        <div className="event-actions">
          <a href="/#" onClick={this.handleRemoveEvent}><Icon>cancel_presentation</Icon></a>
        </div>
      </Card>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    events: state.events.find((event) => event.id === props.id)
  };
}

export default connect(mapStateToProps)(Event);
