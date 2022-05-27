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

const Input = ({type, id, options, isOptionEqualToValue, renderInput, index='', value, onChange, onInput, immediate, ...props}) => {
  console.log(`Render: Input ${id}`);

  const dispatch = useDispatch();
  let obj = id;
  if (Number.isFinite(index)) {
    obj += index;
  }

  const focus = useSelector(get.focus) === obj;
  const focusRef = useRef(null);

  let sel = get;
  id.split('.').forEach(k => sel = sel[k]);
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

  let val = isArray ? sel2[index] || '' : sel2;

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

  const update = useCallback((e, newValue) => {
    if (newValue == value) return;  // == in case numeric

    if (/dollar|number/.test(type)) {
      if (newValue === '') {
        newValue = undefined;
      } else {
        newValue = +newValue;
      }
    }

    let s = set;
    id.split('.').forEach(k => s = s[k]);

    if (isArray) {
      if (sel2[index] !== newValue) {
        dispatch(s({index, value: newValue}));
      }
    } else if (sel2 !== newValue) {
      dispatch(s(newValue));
    }

    if (onChange) {
      onChange(e, newValue);
    }
  }, [onChange, value, dispatch, id, index, isArray, sel2, type]); // update

  useEffect(() => {
    if (value) {
      update(
        {target: {value}},
        value
      );
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
              control={<Radio sx={{padding: '0.2rem 0.5rem'}} />}
              label={props.labels ? props.labels[i] : option}
              checked={option.toString() === value.toString()}
              onChange={(e) => {
                change(e.target.value);
                update(e, e.target.value);
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
        ref={focusRef}

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
          update(e, value);
        }}
      />
    )
  } else {
    return (
      type === 'radio' ?
        <Radio
          {...props}
          id={id}
          name={id}
          checked={val === value}
          value={value}
          style={{padding: 0}}
          onChange={(e) => {
            change(e.target.value);
            update(e, e.target.value);
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
            update(e, e.target.checked);
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
                update(e, e.target.value);
              }
            }}
            
            onChange={(e) => {
              change(e.target.value);
              if (immediate || (e.target.form && (e.target.form.getAttribute('options') || '').includes('immediate'))) {
                update(e, e.target.value);
              }
            }}

            onBlur={(e) => {
              if (!(immediate || (e.target.form && (e.target.form.getAttribute('options') || '').includes('immediate')))) {
                update(e, e.target.value);
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