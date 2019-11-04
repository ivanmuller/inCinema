import React, {useState, useEffect} from 'react';
import config from '../config';

// Redux Store
import { connect } from 'react-redux';
import { editEvent } from '../actions/events';

import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';

const EventTimeAdmin = ({ dispatch, timeDifference, calculateDate, event: {id, datetime}}) => {
  const [tempDateTimeSelected, setTempDateTimeSelected] = useState(datetime);
  const [pickerIsOpen, setPickerIsOpen] = useState(false);
  
  const handleDateChange = (date) => {
    setTempDateTimeSelected(date.format('YYYY-MM-DD HH:mm:ss'));
  };

  const setDatePickerOpen = (e, status) => {
    setPickerIsOpen(status);
    if (status == false) {
      dispatch(editEvent(id, { 'datetime': tempDateTimeSelected }));
    }
    if (e) { e.preventDefault() }
  };

  useEffect(() => {
    calculateDate();
  }, [pickerIsOpen])
  
  return (
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
          value={datetime}
          onChange={handleDateChange} />
      </MuiPickersUtilsProvider>
    </div>
  )
}

const EventTimePublic = ({ timeDifference, calculateDate }) => (
  <div className="event-item-section event-time">
    <a dangerouslySetInnerHTML={{ __html: timeDifference }}></a>
  </div>
)

const mapStateToProps = (state, props) => {
  return {
    event: state.events.find((event) => event.id === props.id)
  };
}

export const EventTimeAdminConn = connect(mapStateToProps)(EventTimeAdmin);
export const EventTimePublicConn = connect(mapStateToProps)(EventTimePublic);