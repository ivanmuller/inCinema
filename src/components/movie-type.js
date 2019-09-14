import React, {useState} from 'react';
import config from '../config';

// Redux Store
import { connect } from 'react-redux';
import { editMovie } from '../actions/movies.js';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

function MovieType(props) {
  const { type, id } = props.movie;
  const [open, setOpen] = useState(false);
  const handleChange = (e) => {
    const type = e.target.value;
    props.dispatch(editMovie(id, { type }));
  };  
  return (
    <React.Fragment>
        <a href="#" onClick={() => setOpen(true)}>{type}</a><br/>
        <Select
          className="hide"
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          value={type}
          onChange={handleChange}
        >
          {config.types.map((typeItem,i) => {
            return (
              <MenuItem key={i} value={typeItem}>{typeItem}</MenuItem>
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

export default connect(mapStateToProps)(MovieType);