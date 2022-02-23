import React, { useState, useEffect } from 'react';
import config from '@root/config';

import { connect } from 'react-redux';

import Card from '@material-ui/core/Card';
import moment from 'moment';
import useInterval from '@root/hooks/useInterval';

import { 
  EventPosterAdminConn as EventPosterAdmin, 
  EventPosterPublicConn as EventPosterPublic 
} from '@root/components/EventPoster';
import { 
  EventTitleAdminConn as EventTitleAdmin, 
  EventTitlePublicConn as EventTitlePublic 
} from '@root/components/EventTitle';
import { 
  EventTimeAdminConn as EventTimeAdmin, 
  EventTimePublicConn as EventTimePublic 
} from '@root/components/EventTime';
import EventSeats from '@root/components/EventSeats';
import { 
  EventRoomAdminConn as EventRoomAdmin, 
  EventRoomPublicConn as EventRoomPublic }
   from '@root/components/EventRoom';
import EventActions from "@root/components/EventActions";

const Event = (props) => {
  const [timeDifference, setTimeDifference] = useState('first');
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);

  const calculateDate = () => {
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
    calculateDate();
  }, config.dateIntervalrefresh);

  useEffect(() => {
    calculateDate();
  }, []);

  const shouldShowAdmin = props.auth.uid && window.location.pathname == '/admin'; 
  
  return (
    <Card className={['event-item', finished && 'finished', playing && 'playing'].join(" ")}>
      {shouldShowAdmin ? (
          <>
            <div className="event-number">{props.index + 1}</div>
            <EventPosterAdmin id={props.id} playing={playing} />
            <EventTitleAdmin id={props.id} />
            <EventTimeAdmin id={props.id} timeDifference={timeDifference} calculateDate={calculateDate} />
            <EventSeats id={props.id} finished={finished} />
            <EventRoomAdmin id={props.id} />
            <EventActions id={props.id} handleQueueToDelete={props.handleQueueToDelete} />
          </>
        ) : (
          <>
            <EventPosterPublic id={props.id} playing={playing} />
            <EventTitlePublic id={props.id} />
            <EventTimePublic id={props.id} timeDifference={timeDifference} calculateDate={calculateDate} />
            <EventSeats id={props.id} finished={finished} />
            <EventRoomPublic id={props.id} />
          </>
      )}
    </Card>
  )
}

const mapStateToProps = (state, props) => {
  return {
    events: state.events.find((event) => event.id === props.id),
    auth: state.auth
  };
}

export default connect(mapStateToProps)(Event);
