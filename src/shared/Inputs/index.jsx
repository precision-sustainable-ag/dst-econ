import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dollars, get, goto, set } from '../../store/Store';
import Help from '../Help';

import './styles.scss';

const equals = (a, b) => {
  return a === b || String(a) === String(b) || (a != null && b != null && Number(a) === Number(b));
};

const sanitizeNumber = (s) =>
  s
    .replace(/[^0-9.-]/g, '') // digits, dot, minus only
    .replace(/(?!^)-/g, '') // minus only at the start
    .replace(/(\..*)\./g, '$1'); // one decimal point

const Input = ({
  id,
  index,
  type,
  label,
  labels,
  sx,
  options,
  placeholder,
  autoFocus,
  onChange,
  onInput,
  value: suppliedValue,
  warning,
  info,
  suffix,
  ...props
}) => {
  const dispatch = useDispatch();
  const selected = useSelector(goto(get, id));
  const focus = useSelector(get.focus);
  const defaultValue = useSelector((state) => get.calculated(state)[id]);
  const isCalculated = defaultValue !== undefined;

  const isArray = Array.isArray(selected);
  const inputId = isArray ? `${id}${index}` : id;
  const raw = suppliedValue ?? (isArray ? selected[index] : selected);
  const currency = type === 'dollar' || id.split('.').at(-1).startsWith('$');
  const numeric = currency || type === 'number' || typeof raw === 'number';
  const isOverridden = isCalculated && !equals(defaultValue, raw);

  const value =
    currency && raw != null && raw !== '' && Number.isFinite(Number(raw))
      ? Number(raw).toFixed(2)
      : String(raw ?? '');

  const update = (e, next) => {
    const v = numeric ? Number(next) : (next ?? '');

    if (!numeric || Number.isFinite(v)) {
      dispatch(goto(set, id)(isArray ? { index, value: v } : v));
      onChange?.(e, v);
    }
  };

  useEffect(() => {
    if (focus === inputId) {
      const input = document.getElementById(inputId);

      if (input) {
        input.focus();
        dispatch(set.focus(null));
      }
    }
  }, [focus, inputId, dispatch]);

  if (type === 'checkbox' || typeof raw === 'boolean') {
    const checkbox = (
      <Checkbox
        id={inputId}
        checked={raw === true}
        onChange={(e) => update(e, e.target.checked)}
        {...props}
        sx={{
          p: 0,
          pr: '3px',
          color: '#66b366',
          '&.Mui-checked': {
            color: '#66b366',
          },
          ...sx,
        }}
      />
    );

    return label ? <FormControlLabel label={label} control={checkbox} /> : checkbox;
  }

  if (type === 'radio') {
    return (
      <RadioGroup
        id={inputId}
        name={inputId}
        value={raw ?? ''}
        onChange={update}
        {...props}
        sx={sx}
      >
        {(options ?? ['Yes', 'No']).map((option, i) => (
          <FormControlLabel
            key={option}
            value={option}
            control={<Radio size="small" sx={{ p: '0.2rem 0.5rem' }} />}
            label={labels?.[i] ?? option}
          />
        ))}
      </RadioGroup>
    );
  }

  return (
    <div className={`input${isCalculated ? ' default' : ''}`}>
      <div className="input-container">
        <Autocomplete
          id={inputId}
          size="small"
          options={options ?? []}
          freeSolo={!options}
          autoSelect
          selectOnFocus
          disableClearable={numeric}
          value={value || null}
          onChange={update}
          renderInput={(params) => (
            <TextField
              {...params}
              data-id={isArray ? `${id}[${index}]` : id}
              autoFocus={autoFocus}
              placeholder={placeholder}
              slotProps={{
                ...params.slotProps,
                input: {
                  ...params.slotProps?.input,
                  startAdornment: currency ? (
                    <InputAdornment position="start">$</InputAdornment>
                  ) : (
                    params.slotProps?.input?.startAdornment
                  ),
                  endAdornment: (
                    <>
                      {suffix && <InputAdornment position="end">{suffix}</InputAdornment>}
                      {params.slotProps?.input?.endAdornment}
                    </>
                  ),
                },
                htmlInput: {
                  ...params.slotProps?.htmlInput,
                  inputMode: numeric ? 'decimal' : 'text',
                  style: { textAlign: numeric ? 'right' : 'left' },
                  onInput: (e) => {
                    if (numeric) {
                      e.target.value = sanitizeNumber(e.target.value);
                    }

                    onInput?.(e);
                  },
                },
              }}
            />
          )}
          {...props}
          sx={{
            width: numeric ? 100 : '100%',
            '&& .MuiAutocomplete-inputRoot': { p: '4px 8px !important' },
            '&& .MuiAutocomplete-inputRoot .MuiAutocomplete-input': { p: '2px 0' },
            ...sx,
          }}
        />

        {info && <Help>{info}</Help>}
        {isOverridden && (
          <button
            type="button"
            className="restore-default"
            onClick={(e) => {
              update(e, defaultValue);
              dispatch(set.focus(inputId));
            }}
          >
            default
            <br />
            {currency ? dollars(defaultValue) : defaultValue}
          </button>
        )}
      </div>

      {warning}
    </div>
  );
};

export default Input;
