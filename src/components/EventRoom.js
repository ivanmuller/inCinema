import React, {useState} from 'react';
import config from '../config';

// Redux Store
import { connect } from 'react-redux';
import { editEvent } from '../actions/events';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

function EventRoom({dispatch,event}) {
  const {room,id} = event;
  const [open, setOpen] = useState(false);
  const handleRoomChange = (e) => {
    const room = e.target.value;
    dispatch(editEvent(id, { room }));
  };
  const handleSetOpen = (e, status) => {
    setOpen(status);
    if (e) { e.preventDefault() }
  };
  return (
    <div className="event-item-section event-room">
      <a href="#" onClick={(e) => handleSetOpen(e, true)}><span>Room</span> {room}</a><br/>
        <Select
          className="hide"
          open={open}
          onClose={(e) => handleSetOpen(e,false)}
          onOpen={(e) => handleSetOpen(e,true)}
          value={room}
          onChange={handleRoomChange}
        >
          {config.rooms.map((roomItem,i) => {
            return (
              <MenuItem key={i} value={roomItem}>{roomItem}</MenuItem>
            )
          })}
        </Select>
    </div>
  )
}

const mapStateToProps = (state, props) => {
  return {
    event: state.events.find((event) => event.id === props.id)
  };
}

export default connect(mapStateToProps)(EventRoom);