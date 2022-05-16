import {useEffect} from 'react';

import {useStore} from '../store/Store';

import {
  Input as MUIInput,
  Autocomplete as MUIAutocomplete,
  TextField,
  Radio,
  Checkbox,
  OutlinedInput,
} from '@mui/material';

import NumberFormat from 'react-number-format';

/*
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
*/

const keyPress = (event) => {
  if (event.key === 'ZEnter') {
    const form = event.target.form;
    const index = Array.prototype.indexOf.call(form, event.target);
    form.elements[index + 1].focus();
    event.preventDefault();    
    // focus(props.next);
  }
} // keyPress

const Input = ({type, id, value, defaultChecked, onInput, style}) => {
  const {state, change} = useStore();

  value = value !== undefined ? value : state[id]; // || defaultChecked;

  if (state[id] === undefined) {
    // state[id] = value || defaultChecked;
  }

  useEffect(() => {
    if (value || defaultChecked) {
      change('addkey', id, value || defaultChecked);
    }
  })

  if (!(id in state)) {
    // return '';
  }

  if (value === undefined) {
    value = '';
  }
  
  if (type === 'checkbox' && value === '') {
    value = false;
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
          return keyPress(e);
        }}

        value={value}

        style={style}

        onChange={(e) => {
          change('change', id, e.target.value);
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

        style={style}

        onChange={(e) => {
          const value = e.target.value || '';
          change('change', id, value.replace('$', ''));
          if (onInput) {
            // onInput(e);
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
          return keyPress(e);
        }}
        
        value={value}

        style={style}

        onChange={(event) => {
          change('change', id, event.target.value);
          if (onInput) {
            onInput(event);
          }
        }}

        type="text"
      />
  )
} // Input

const Autocomplete = ({id, options, value, onInput, onInputChange, groupBy, renderInput, getOptionLabel, autoComplete, includeInputInList, filterSelectedOptions, onChange}) => {
  const {state, change} = useStore();

  if (!renderInput) {
    renderInput = (params) => {
      console.log(params);
      return (
        <TextField
          variant="standard"
          {...params}
        />
      )
    }
  }

  value = value !== undefined ? value : state[id];

  if (state[id] === undefined) {
    state[id] = value;
  }

  if (value) {
    // change('addkey', id, value);
  }

  if (!(id in state)) {
    // return;
  }

  if (value === undefined) {
    value = null;
  }

  const max = Math.max.apply(Math, options.map(option => option.length));

  return (
    <MUIAutocomplete
      onKeyPress={(e) => keyPress(e)}

      sx={{width: (max * 0.8) + 'rem'}}

      isOptionEqualToValue={(option, value) => option.value === value.value}   // avoids warning, per https://stackoverflow.com/q/61947941/3903374

      groupBy={groupBy}
      getOptionLabel={getOptionLabel}
      onInputChange={onInputChange}
      autoComplete={autoComplete}
      includeInputInList={includeInputInList}
      filterSelectedOptions={filterSelectedOptions}

      renderInput={(params) => {
        console.log(params);
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
        if (value) {
          console.log(value);
          change('change', id, value.description || value);
          if (onInput) {
            onInput(e);
          }
          if (onChange) {
            onChange(e, value);
          }
        }
      }}
    />
  )
} // Autocomplete

export {
  Autocomplete,
  Input,
}