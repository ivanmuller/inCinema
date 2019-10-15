import uuid from 'uuid';
import moment from 'moment';
import config from '../config';

// ADD_EVENT
export const addEvent = (
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
    type: 'ADD_EVENT',
    event: {
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

// REMOVE_EVENT
export const removeEvent = ({id} = {}) => ({
  type: 'REMOVE_EVENT',
  id
});

// EDIT_EVENT
export const editEvent = (id, updates) => ({
  type: 'EDIT_EVENT',
  id,
  updates
});

// EDIT_ALL
export const editAllEvents = (events) => {
  return ({
    type: 'EDIT_ALL',
    events
  })
};

// FETCH_ALL
export const fetchAllEvents = (events) => {
  return ({
    type: 'FETCH_ALL',
    events
  })
};