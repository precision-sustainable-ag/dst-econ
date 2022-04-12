import {useContext} from 'react';
import {Context} from './Store';

import {
  Input as MUIInput,
  Autocomplete as MUIAutocomplete,
  TextField,
  Radio,
  Checkbox,
} from '@mui/material';

import NumberFormat from 'react-number-format';

const focus = (obj) => {
  if (obj) {
    document.querySelector('#' + obj).focus();
  } else {
    let found = false;

    document.querySelectorAll('input:not([tabIndex="-1"]), select:not([tabIndex="-1"]), button:not([tabIndex="-1"])').forEach(function(obj) {
      if (found) {
        obj.focus();
        found = false;
      } else if (obj === document.activeElement) {
        found = true;
      }
    });
  }
} // focus

const keyPress = (event, props) => {
  return;
  if (event.key === 'Enter') {
    const form = event.target.form;
    const index = Array.prototype.indexOf.call(form, event.target);
    form.elements[index + 1].focus();
    event.preventDefault();    
    // focus(props.next);
  }
} // keyPress

const Input = ({type, id, value, defaultChecked, onInput}) => {
  const {state, change} = useContext(Context);

  value = value !== undefined ? value : state[id]; // || defaultChecked;

  if (state[id] === undefined) {
    state[id] = value || defaultChecked;
  }

  if (value || defaultChecked) {
    change('addkey', id, value || defaultChecked);
  }

  if (!(id in state)) {
    return;
  }

  if (Array.isArray(value)) {
    value = state[id][state['index' + id]];
  }

  return (
    type === 'radio' ? 
      <Radio
        checked={state[id] === value}
        value={value}
        style={{padding: 0}}
        onChange={(e) => {
          change('change', id, e.target.value);
          if (onInput) {
            onInput(e);
          }
        }}
      />    
      :
    type === 'checkbox' ? 
      <Checkbox
        checked={value}
        style={{padding: 0}}
        onChange={(e) => {
          change('change', id, e.target.checked);
          if (onInput) {
            onInput(e);
          }
        }}
      />    
      :
    type === 'number' ?
      <NumberFormat
        autoComplete="off"
        
        onKeyPress={(e) => {
          return keyPress(e)
        }}
        
        value={value}

        onChange={(e) => {
          change('change', id, e.target.value)
          if (onInput) {
            onInput(e);
          }
        }}

        type="text"
      />
      :
    type === 'dollar' ?
      <NumberFormat
        autoComplete="off"
        
        onKeyPress={(e) => {
          return keyPress(e)
        }}
        
        value={value}

        onChange={(e) => {
          change('change', id, e.target.value.replace('$', ''));
          if (onInput) {
            onInput(e);
          }
        }}

        decimalScale={2}
        fixedDecimalScale={true}
        prefix={'$'}
    
        type="text"
      />
      :
      <MUIInput
        autoComplete="off"
        
        onKeyPress={(e) => {
          return keyPress(e)
        }}
        
        value={value}

        onChange={(e, value) => {
          change('change', id, value.replace('$', ''))
          if (onInput) {
            onInput(e);
          }
        }}

        type="text"
      />
  )
} // Input

const Autocomplete = ({id, options, value, onInput, onInputChange, groupBy}) => {
  const {state, change} = useContext(Context);

  value = value !== undefined ? value : state[id];

  if (state[id] === undefined) {
    state[id] = value;
  }

  if (value) {
    change('addkey', id, value);
  }

  if (!(id in state)) {
    return;
  }

  // console.log(id);
  // console.log(value);
  // console.log(state[id]);
  // console.log(JSON.stringify(state));

  const max = Math.max.apply(Math, options.map(option => option.length));

  return (
    <MUIAutocomplete
      onKeyPress={(e) => keyPress(e)}

      sx={{width: (max * 0.8) + 'rem'}}

      isOptionEqualToValue={(option, value) => {
        return option === value || (option.value && option.value === value) || (option.label && option.label === value);
      }}

      groupBy={groupBy}

      onInputChange={onInputChange}

      renderInput={(params) => {
        return (
          <TextField
            variant="standard"
            {...params}
          />
        )
      }}
      
      options={options}

      value={value}
      
      onChange={(e, value) => {
        change('change', id, value);
        if (onInput) {
          onInput(e);
        }
      }}
    />
  )
} // Autocomplete

export {
  Autocomplete,
  Input,
}