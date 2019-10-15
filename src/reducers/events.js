// Events Reducer

const eventsReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_EVENT':
      return [...state,action.event];
    case 'EDIT_ALL':
      return [...action.events];
    case 'FETCH_ALL':
      return [...action.events];
    case 'REMOVE_EVENT':
      return state.filter(({ id }) => id !== action.id)
    case 'EDIT_EVENT':
      return state.map((item) => {
        if(item.id === action.id){
          return {
            ...item,
            ...action.updates
          }
        }else{
          return item
        }
      });
    default:
      return state
  }
};

export default eventsReducer;