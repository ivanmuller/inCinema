import React, {useState} from 'react';
import config from '../config';

// Redux Store
import { connect } from 'react-redux';
import { editMovie } from '../actions/movies.js';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

function MovieRoom({dispatch,movie}) {
  const {room,id} = movie;
  const [open, setOpen] = useState(false);
  const handleRoomChange = (e) => {
    const room = e.target.value;
    dispatch(editMovie(id, { room }));
  };
  const handleSetOpen = (e, status) => {
    setOpen(status);
    if (e) { e.preventDefault() }
  };
  return (
    <React.Fragment>
        <a href="#" onClick={(e) => handleSetOpen(e,true)}>Room {room}</a><br/>
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
    </React.Fragment>
  )
}

const mapStateToProps = (state, props) => {
  return {
    movie: state.movies.find((movie) => movie.id === props.id)
  };
}

export default connect(mapStateToProps)(MovieRoom);