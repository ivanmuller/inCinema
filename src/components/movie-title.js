import React from 'react';

// Redux Store
import { connect } from 'react-redux';
import { editMovie } from '../actions/movies.js';

import MovieYear from './movie-year';
import MovieType from './movie-type';

import Icon from '@material-ui/core/Icon';

const MovieTitle = (props) => {
    const { title, id} = props.movie;
    const { playing } = props.processed;
    const handleTitleChange = (e) => {
      const title = e.target.value;
      props.dispatch(editMovie(id, { title }));
    };
    return (
      <div className="event-item-section event-title">
        <h2>
          {playing && <Icon className="blink-1">play_arrow</Icon>}
          <input type="text" onChange={handleTitleChange} size={title.length} value={title} />
        </h2>
        {<MovieType id={id} />}
        {<MovieYear id={id} />}
      </div>
    )
}

const mapStateToProps = (state, props) => {
  return {
    movie: state.movies.find((movie) => movie.id === props.id)
  };
}

export default connect(mapStateToProps)(MovieTitle);