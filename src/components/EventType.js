import React, {useState} from 'react';
import config from '../config';

// Redux Store
import { connect } from 'react-redux';
import { editEvent } from '../actions/events';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

function EventType(props) {
  const { type, id } = props.event;
  const [open, setOpen] = useState(false);
  const handleChange = (e) => {
    const type = e.target.value;
    props.dispatch(editEvent(id, { type }));
  };  
  const handleSetOpen = (e, status) => {
    setOpen(status);
    if (e) { e.preventDefault() }
  };
  return (
    <div className="event-type">
        <a href="#" onClick={(e) => handleSetOpen(e,true)}>{type}</a><br/>
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

const mapStateToProps = (state, props) => {
  return {
    event: state.events.find((event) => event.id === props.id)
  };
}

export default connect(mapStateToProps)(EventType);