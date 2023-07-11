// TODO:
/* eslint-disable react/no-unstable-nested-components */

/* eslint-disable no-console */
/* eslint-disable no-alert */

import React, {
  useEffect, useState, useRef, useCallback,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormLabel,
  Autocomplete as MUIAutocomplete,
} from '@mui/material';

import Help from '../Help';

import { get, set, mobile } from '../../store/Store';

import './styles.scss';

const keyPress = (event) => {
  if (event.key === 'Enter') {
    // all INPUTs are wrapped in a FORM, so we need to check if their FORM is within another FORM:
    const form = event.target?.closest('form')?.parentNode?.closest('form');
    if (form) {
      // focus next field, thanks Chat-GPT!!!
      const focusableElements = form.querySelectorAll('input:not([disabled])');
      const currentIndex = Array.prototype.indexOf.call(focusableElements, document.activeElement);
      const nextIndex = (currentIndex + 1) % focusableElements.length;
      const nextElement = focusableElements[nextIndex];
      nextElement.focus();
    }

    // all INPUTs are wrapped in a FORM, so we don't want to submit their form when Enter is pressed:
    event.preventDefault();
  }
}; // keyPress

const equals = (v1, v2) => {
  if (typeof v1 === 'undefined') {
    return true;
  }

  if (typeof v2 === 'undefined') {
    return false;
  }

  const stringsEqual = v1.toString() === v2.toString();

  const n1 = Number(v1);
  const n2 = Number(v2);
  const numericsEqual = !Number.isNaN(n1) && !Number.isNaN(n2) && n1 === n2;

  return stringsEqual || numericsEqual;
}; // equals

const Input = ({
  type, id, options, isOptionEqualToValue, renderInput, index = '', value, onChange, onInput, immediate, suffix,
  ...props
}) => {
  const dispatch = useDispatch();
  const calculated = useSelector(get.calculated);

  let obj = id;
  if (Number.isFinite(index)) {
    obj += index;
  }

  const focus = useSelector(get.focus) === obj;
  const focusRef = useRef(null);

  if (calculated[id]) {
    focusRef?.current?.parentNode?.parentNode?.classList.add('default');
  } else {
    focusRef?.current?.parentNode?.parentNode?.classList.remove('default');
  }

  const sel = id.split('.').reduce((acc, k) => acc[k], get);

  if (!sel) {
    console.warn(`Unknown Input: ${id}`);
    alert(`Unknown Input: ${id}`);
  }

  let sel2 = useSelector(sel);

  if (sel2 && type === 'percent') {
    sel2 *= 100;
  }

  const [v2, setv2] = useState(value || sel2);

  const [changed, setChanged] = useState(false);

  const isArray = Array.isArray(sel2) && !props.multiple; // TODO

  if (!type) {
    if (id.includes('$')) {
      type = 'dollar';
    } else if (sel2 === undefined || typeof sel2 === 'number') {
      type = 'number';
    } else if (typeof sel2 === 'boolean') {
      type = 'checkbox';
    } else {
      type = 'text';
    }
  }

  let val = isArray ? sel2[index] || '' : sel2;

  if (type === 'dollar' && val) {
    val = (+val).toFixed(2);
  }

  const [v, setValue] = useState(val);

  useEffect(() => {
    if (v2 !== sel2 || v2 !== value) {
      setChanged(true);
    }
  }, [v2, value, sel2]);

  useEffect(() => {
    if (changed) {
      setv2(val);
      setValue(val);
      setChanged(false);
    }
    if (focus) {
      if (focusRef.current) {
        const input = focusRef.current.querySelector('input');
        input.focus();
        setTimeout(() => {
          dispatch(set.focus(null));
        }, 1000); // wait for all Inputs to load
      }
    }
  }, [changed, val, focus, dispatch, props]);

  const change = (value2) => {
    setValue(value2);
  }; // change

  const setter = id.split('.').reduce((acc, k) => acc[k], set);

  const update = useCallback((e, newValue) => {
    // eslint-disable-next-line
    if (newValue == value && sel2 !== undefined) return;  // == in case numeric

    setChanged(true);

    if (/dollar|number|percent/.test(type)) {
      if (newValue === '') {
        newValue = undefined;
      } else {
        newValue = +newValue;
      }
    }

    if (type === 'percent') {
      newValue /= 100;
    }

    if (isArray) {
      if (sel2[index] !== newValue) {
        dispatch(setter({ index, value: newValue }));
      }
    } else if (sel2 !== newValue) {
      dispatch(setter(newValue));
    }

    if (onChange) {
      onChange(e, newValue);
    }
  }, [onChange, value, dispatch, id, index, isArray, sel2, type]); // update

  value = value !== undefined ? value : val;

  if (/dollar|percent/.test(type)) {
    props.className = `${props.className || ''} ${type}`;
  }

  useEffect(() => {
    if (value) {
      update(
        { target: { value } },
        value,
      );
    }
  }, [update, value, type]);

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
          className="input"
          id={id}
        >
          {options.map((option, i) => (
            <FormControlLabel
              value={option}
              key={option}
              control={<Radio sx={{ padding: '0.2rem 0.5rem' }} />}
              label={props.labels ? props.labels[i] : option}
              checked={option.toString() === value?.toString()}
              onChange={(e) => {
                change(e.target.value);
                update(e, e.target.value);
              }}
            />
          ))}
        </RadioGroup>
      </>
    );
  } if (options) {
    // let max = Math.max.apply(Math, options.map(option => option.description ? option.description.length : option.length));

    const max = '100%';
    if (!isOptionEqualToValue) {
      isOptionEqualToValue = (option, value2) => option.value === value2?.value;
    }

    if (!renderInput) {
      renderInput = (params) => (
        <TextField
          autoFocus={!mobile && props.autoFocus}
          variant={props.variant || 'outlined'}
          sx={{ background: 'white', width: max, padding: 0 }}
          {...params}
        />
      );
    }

    return (
      <form className="input" id={id} autoComplete="off">
        <MUIAutocomplete
          {...props}
          id={id}
          onKeyPress={keyPress}
          onKeyDown={(event) => {
            if (event.key === 'Tab') {
              const focused = document.querySelector('li.Mui-focused');
              if (focused) {
                update(event, focused.textContent);
              }
            }
          }}
          ref={focusRef}
          sx={{ width: max }}
          // isOptionEqualToValue={isOptionEqualToValue}   // avoids warning, per https://stackoverflow.com/q/61947941/3903374
          groupBy={props.groupBy}
          getOptionLabel={
            props.getOptionLabel || (
              (o) => o?.toString().split('|')[0]
            )
          }
          onInputChange={props.onInputChange}
          includeInputInList={props.includeInputInList}
          filterSelectedOptions={props.filterSelectedOptions}
          renderInput={renderInput}
          options={options}
          value={v}
          onChange={(event, value2) => {
            update(event, value2);
          }}
        />
      </form>
    );
  }

  if (type === 'checkbox' && props.label) {
    return (
      <FormControlLabel
        label={props.label}
        control={(
          <Checkbox
            {...props}
            id={id}
            checked={v}
            style={{ padding: 0, paddingRight: 3 }}
            onChange={(e) => {
              change(e.target.checked);
              update(e, e.target.checked);
            }}
          />
        )}
      />
    );
  }

  if (type === 'checkbox') {
    return (
      <Checkbox
        {...props}
        id={id}
        checked={v}
        style={{ padding: 0, paddingRight: 3 }}
        onChange={(e) => {
          change(e.target.checked);
          update(e, e.target.checked);
        }}
      />
    );
  }

  return (
    <form className="input" id={id} autoComplete="off">
      <TextField
        {...props}
        id={id}
        data-suffix={suffix}
        value={v === undefined ? '' : v} // https://github.com/facebook/react/issues/6222
        onFocus={(e) => {
          setTimeout(() => {
            e.target.select();
          }, 10);
        }}
        size="small"
        type={/dollar|number|percent/.test(type) ? 'number' : type || 'text'}
        sx={{
          display: props.fullWidth ? 'block' : 'span',
          boxSizing: 'border-box',
        }}
        variant={props.variant || 'outlined'}
        inputProps={{
          role: 'presentation',
          style: {
            paddingLeft: 7,
            paddingTop: 5,
            paddingBottom: 5,
            maxWidth: /number|dollar|percent/.test(type) ? 70 : 1000,
            background: 'white',
            ...props.style,
          },
          inputMode: /dollar|number|percent/.test(type) ? 'numeric' : '',
        }}
        ref={focusRef}
        onKeyPress={keyPress}
        onWheel={(e) => e.target.blur()} // https://github.com/mui/material-ui/issues/7960#issuecomment-760367956
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.nativeEvent.preventDefault(); // for number type
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
      {
        !equals(calculated[id], v) && (
          <button
            type="button"
            tabIndex={-1}
            style={{ float: 'right', fontSize: '0.7rem', color: 'gray' }}
            onClick={() => {
              dispatch(setter(calculated[id]));
              dispatch(set.focus(id));
            }}
          >
            default
            <br />
            {calculated[id]}
          </button>
        )
      }

      {props.info && <Help>{props.info}</Help>}

      {props.warning}
    </form>
  );
}; // Input

export default Input;
