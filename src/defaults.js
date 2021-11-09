import {useState} from 'react';

const defaults = (change, p) => {
  const set = {};

  const parms = {  // default parameters
    screen    : 'Home',
    help      : '',
    helpX     : 0,
    helpY     : 0,
    mapZoom   : 13,
    mapType   : 'hybrid',
    lat       : 40.7849,
    lng       : -74.8073,
    location  : '',
    state     : '',
    ...p
  }

  // Would love to be able to do this:
  //   for (const [parm, value] of Object.entries(parms)) {
  //     State(parm, value);
  //   }
  // However, that gives the error:
  //    "React Hook "useState" may be executed more than once. Possibly because it is called in a loop."
  // The following code gets around this problem:

  const State = (parm, value) => {
    [parms[parm], set[parm]] = useState(value);
  }
  
  for (const [parm, value] of Object.entries(parms)) {
    State(parm, value);
  }

  const props = (parm) => ({
    id: parm,                                         // allows the parameter to be styled in CSS
    parms: parms,                                     // saves the need to pass parms to each component
    value: parms[parm] || '',                         // the parameter's curent value
    checked: parms[parm] === 'true',                  // handle checkboxes
    set: set,                                         // the parameter's useState function
    onChange: ({target}, value=target.value, index) => {
      if (value !== null) {
        value = value.value || value.label || value;  // Autocomplete
      }

      if (Array.isArray(parms[parm])) {
        set[parm](arr => {
          arr[index] = value;
          return [...arr];
        });        
      } else {
        set[parm](value);
      }

      console.log(parm, value);

      try {
        change(parm, value, target, index);
      } catch(ee) {
        console.log(parm, ee.message);
      }
    }
  }); // props

  return {
    parms,
    set,
    props
  }
}

export {
  defaults
}