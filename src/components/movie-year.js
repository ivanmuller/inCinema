import React, { useState } from 'react';
import config from '../config';

// Redux Store
import { connect } from 'react-redux';
import { editMovie } from '../actions/movies.js';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

function MovieYear(props) {
  const [open, setOpen] = useState(false);
  const { year, id } = props.movie;
  const handleYearChange = (e) => {
    const year = e.target.value;
    props.dispatch(editMovie(id, { 'year': year }));
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
    <span>
        <a href="#" onClick={() => setOpen(true)}>{year}</a><br/>
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
    </span>
  )
}

const mapStateToProps = (state, props) => {
  return {
    movie: state.movies.find((movie) => movie.id === props.id)
  };
}

export default connect(mapStateToProps)(MovieYear);