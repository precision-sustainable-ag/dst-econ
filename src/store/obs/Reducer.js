export const initialState = {
  screen        : 'Home',
  previousScreen: 'Home',  
  help          : '',
  helpX         : 0,
  helpY         : 0,
  mapZoom       : 13,
  mapType       : 'hybrid',
  lat           : 40.7849,
  lon           : -74.8073,
  location      : '',
  state         : '',
};

export const Reducer = (state, action, value = action && action.data && action.data.value) => {  
  switch (action.type) {
    case 'change': {
      if (state[action.e] === value) {
        return state;
      }
      return {
        ...state,
        [action.e]: value
      }
    }

    case 'delete': {
      const st = {...state};
      delete st[value];
      return st;
    }

    case 'addkey': {
      if (action.e in state) {
        return state;
      } else {
        return {
          ...state,
          [action.e]: value
        }
      }
    }

    default:
      return state;
  }
};
