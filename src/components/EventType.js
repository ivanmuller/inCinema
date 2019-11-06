import React, {useState} from 'react';
import config from '../config';

import { connect } from 'react-redux';
import { editEvent } from '../actions/events';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const EventTypeAdmin = ({ dispatch, event: { type, id }}) => {

  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    const type = e.target.value;
    dispatch(editEvent(id, { type }));
  };  

  const handleSetOpen = (e, status) => {
    setOpen(status);
    if (e) { e.preventDefault() }
  };
  
  return (
    <div className="event-type">
        <a href="#/" onClick={(e) => handleSetOpen(e,true)}>{type}</a><br/>
        <Select
          className="hide"
          open={open}
          onClose={(e) => handleSetOpen(e,false)}
          onOpen={(e) => handleSetOpen(e,true)}
          value={type}
          onChange={handleChange}
        >
          {config.types.map((typeItem,i) => {
            return (
              <MenuItem key={i} value={typeItem}>{typeItem}</MenuItem>
            )
          })}
        </Select>
    </div>
  )
}

const EventTypePublic = ({ event: { type } }) => (
    <div className="event-type">
      <span>{type}</span>
    </div>
  )

const mapStateToProps = (state, props) => {
  return {
    event: state.events.find((event) => event.id === props.id)
  };
}

export const EventTypeAdminConn = connect(mapStateToProps)(EventTypeAdmin);
export const EventTypePublicConn = connect(mapStateToProps)(EventTypePublic);