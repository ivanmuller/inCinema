// Movies Reducer
import moviesReducerDefaultState from '../data/movies.js';

const moviesReducer = (state = moviesReducerDefaultState, action) => {
  switch (action.type) {
    case 'ADD_MOVIE':
      return [...state,action.movie];
    case 'EDIT_ALL':
      return [...action.movies];
    case 'REMOVE_MOVIE':
      return state.filter(({ id }) => id !== action.id)
    case 'EDIT_MOVIE':
      return state.map((mov) => {
        if(mov.id === action.id){
          return {
            ...mov,
            ...action.updates
          }
        }else{
          return mov
        }
      });
    default:
      return state
  }
};

export default moviesReducer;