import {useEffect, useState, useRef, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {get, set} from '../store/store';

import {
  Autocomplete as MUIAutocomplete,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormLabel,
} from '@mui/material';

import React from 'react';

const keyPress = (event) => {
  if (event.key === 'Enter') {  // focus next field
    const form = event.target.form;

    if (form) {
      let index = Array.prototype.indexOf.call(form, event.target) + 1;
      while (
        index < form.elements.length &&
        form.elements[index].tagName !== 'INPUT') {  // skip over dropdown button elements
        index++;
      }
      if (form.elements[index]) {
        form.elements[index].focus();
        form.elements[index].select();
      }
      event.preventDefault();
    }
  }
} // keyPress

const Input = ({type, name, id=name, options, isOptionEqualToValue, renderInput, property, index='', value, onChange, onInput, immediate, ...props}) => {
  console.log(`Render: Input ${id} ${property}`);

  const dispatch = useDispatch();
  let obj = property ? id + '.' + property : id;
  if (Number.isFinite(index)) {
    obj += index;
  }

  const focus = useSelector(get.focus) === obj;
  const focusRef = useRef(null);

  const sel = get[id];
  if (!sel) {
    alert('Unknown Input: ' + id);
  }
  
  let sel2 = useSelector(sel);

  const [v2] = useState(sel2);
  const [changed, setChanged] = useState(false);

  const isArray = Array.isArray(sel2);

  if (!type && /\$/.test(id)) {
    type = 'dollar';
  }

  type = type                               ? type :
         sel2 === undefined                 ? 'number' :
         /number|dollar/.test(typeof sel2)  ? 'number' :
         typeof sel2 === 'boolean'          ? 'checkbox' :
                                              'text';

  // console.log(id, typeof sel2);
  let val;

  if (property) {
    val = sel2[property];
  } else if (isArray) {
    val = sel2[index] || '';
  } else {
    val = sel2;
  }

  if (type === 'dollar' && val) {
    val = (+val).toFixed(2);
  }

  let [v, setValue] = useState(value || val);

  useEffect(() => {
    if (v2 !== sel2) {
      setChanged(true);
    }
  }, [v2, sel2]);

  useEffect(() => {
    if (changed) {
      setValue(val);
      setChanged(false);
    }
    if (focus) { // TODO: is props.autoFocus working?
      if (focusRef.current) {
        const input = focusRef.current.querySelector('input');
        input.focus();
        setTimeout(() => input.select(), 100);
        dispatch(set.focus(null));
      }
    }
  }, [changed, val, focus, dispatch, props]);

  const change = (value) => {
    setValue(value);
  } // change

  const update = useCallback((value) => {
    if (/dollar|number/.test(type)) {
      if (value === '') {
        value = undefined;
      } else {
        value = +value;
      }
    }

    if (isArray) {
      if (sel2[index] !== value) {
        dispatch(set[id]({index, value}));
      }
    } else if (property) {
      dispatch(set[id][property](value));
    } else {
      dispatch(set[id](value));
    }
  }, [dispatch, id, index, isArray, property, sel2, type]); // update

  useEffect(() => {
    if (value) {
      update(value);
    }
  }, [update, value]);

  value = value !== undefined ? value : val;

  if (type === 'checkbox') {
    if (value === '') {
      value = false;
    } else if (value === 'on') {
      value = true;
    } else if (value !== true && value !== false) {
      alert(`Bad Boolean value for ${id}: ${value}`);
    }
  }

  if (v === 'NaN') {
    console.log(id, v, property, typeof v, Number.isNaN(v));
  }

  if (type === 'radio' && options) {
    return (
      <>
        <FormLabel>{props.label}</FormLabel>
        <RadioGroup
          {...props}
        >
          {options.map((option, i) => (
            <FormControlLabel 
              value={option}
              key={option}
              control={<Radio />}
              label={props.labels ? props.labels[i] : option}
              checked={option.toString() === value.toString()}
              onChange={(e) => {
                change(e.target.value);
                update(e.target.value);
                if (onChange) {
                  onChange(e);
                }
              }}
            />
          ))}
        </RadioGroup>
      </>
    )
  } else if (options) {
    // let max = Math.max.apply(Math, options.map(option => option.description ? option.description.length : option.length));
    const max = '100%';
    if (!isOptionEqualToValue) {
      isOptionEqualToValue = (option, value) => option.value === value.value;
    }

    if (!renderInput) {
      renderInput = (params) => {
        return (
          <TextField
            autoFocus={props.autoFocus}
            variant={props.variant || 'outlined'}
            sx={{background: 'white', width: max, padding: 0}}
            {...params}
          />
        )
      }
    }
  
    return (
      <MUIAutocomplete
        {...props}

        onKeyPress={keyPress}

        sx={{width: max}}

        isOptionEqualToValue={isOptionEqualToValue}   // avoids warning, per https://stackoverflow.com/q/61947941/3903374

        groupBy={props.groupBy}
        getOptionLabel={props.getOptionLabel}
        onInputChange={props.onInputChange}
        includeInputInList={props.includeInputInList}
        filterSelectedOptions={props.filterSelectedOptions}

        renderInput={renderInput}
        
        options={options}

        value={value}

        onChange={(e, value) => {
          console.log(value);
          update(value);
          
          if (onChange) {
            onChange(e, value);
          }
        }}
      />
    )
  } else {
    return (
      type === 'radio' || name ?
        <Radio
          {...props}
          id={id}
          name={name}
          checked={val === value}
          value={value}
          style={{padding: 0}}
          onChange={(e) => {
            change(e.target.value);
            update(e.target.value);
            if (onChange) {
              onChange(e);
            }
          }}
        />
        :
      type === 'checkbox' ? 
        <Checkbox
          {...props}
          id={id}
          checked={v}
          style={{padding: 0}}
          onChange={(e) => {
            change(e.target.checked);
            update(e.target.checked);
            if (onChange) {
              onChange(e);
            }
          }}
        />
        :
        <>
          {type === 'dollar' && <span style={{position: 'absolute', marginTop: '0.3rem'}}>$</span>}
          <TextField
            {...props}
            id={id}
            value={v === undefined ? '' : v}  // https://github.com/facebook/react/issues/6222

            onFocus={(e) => e.target.select()}

            size="small"

            type={type === 'dollar' ? 'number' : type || 'text'}

            sx={{
              display: props.fullWidth ? 'block' : 'span',
              paddingLeft: type === 'dollar' ? '0.7rem' : 0,
              boxSizing: 'border-box',
              marginBottom: 1,
            }}

            variant={props.variant || 'outlined'}

            inputProps={{
              role: 'presentation',
              autoComplete: 'off',
              style: {
                zpadding: 5,
                background: 'white',
                ...props.style
              },
            }}

            InputLabelProps={{ style: { marginLeft: type === 'dollar' ? '0.7em' : 0} }}

            ref={focusRef}

            onKeyPress={keyPress}

            onWheel={e => e.target.blur()} // https://github.com/mui/material-ui/issues/7960#issuecomment-760367956

            onKeyDown={(e) => {
              if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.nativeEvent.preventDefault();  // for number type
              } else if (e.key === 'Enter') {
                update(e.target.value);
              }
            }}
            
            onChange={(e) => {
              const value = e.target.value;
              change(value);
              if (immediate || (e.target.form && (e.target.form.getAttribute('options') || '').includes('immediate'))) {
                update(value);
                if (onChange) {
                  onChange(e);
                }
              }
            }}

            onBlur={(e) => {
              let value = e.target.value;

              if (!(immediate || (e.target.form && (e.target.form.getAttribute('options') || '').includes('immediate')))) {
                update(value);
              }
              if (onChange) {
                onChange(e);
              }
            }}

            onInput={(e) => {
              if (onInput) {
                onInput(e);
              }
            }}
          />
        </>
    )
  }
} // Input

export {
  Input,
}