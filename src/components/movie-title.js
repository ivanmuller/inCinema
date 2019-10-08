import React from 'react';

// Redux Store
import { connect } from 'react-redux';
import { editMovie } from '../actions/movies.js';

import MovieYear from './movie-year';
import MovieType from './movie-type';

const MovieTitle = (props) => {
    const { title, id} = props.movie;
    const handleTitleChange = (e) => {
      const title = e.target.value;
      props.dispatch(editMovie(id, { title }));
    };
    return (
      <div className="event-item-section event-title">
        <h2>
          <input type="text" placeholder="Movie Title" onChange={handleTitleChange} size={title.length} value={title} />
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