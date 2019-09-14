import uuid from 'uuid';

// ADD_MOVIE
export const addMovie = (
  {
    description = '', 
    note = '', 
    amount = 0, 
    createdAt = 0
    } = {}
  ) => ({
    type: 'ADD_MOVIE',
    expense: {
      id: uuid(),
      description,
      note,
      amount,
      createdAt
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