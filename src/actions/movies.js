import uuid from 'uuid';
import moment from 'moment';
import config from '../config';

// ADD_MOVIE
export const addMovie = (
  {
    title = "",
    year = config.yearsMin,
    poster = "",
    type = config.types[0],
    room = config.rooms[0],
    datetime = moment().add(2, 'hours').format('YYYY-MM-DD HH:mm:ss'),
    duration = 120,
    seats = 45
    } = {}
  ) => ({
    type: 'ADD_MOVIE',
    movie: {
      id: uuid(),
      title,
      year,
      poster,
      type,
      room,
      datetime,
      duration,
      seats
    }   
});

// REMOVE_MOVIE
export const removeMovie = ({id} = {}) => ({
  type: 'REMOVE_MOVIE',
  id
});

// EDIT_MOVIE
export const editMovie = (id, updates) => ({
  type: 'EDIT_MOVIE',
  id,
  updates
});

// EDIT_MOVIE
export const editAllMovies = (movies) => {
  return ({
    type: 'EDIT_ALL',
    movies
  })
};