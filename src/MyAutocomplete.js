import Autocomplete from '@mui/material/Autocomplete';
import {TextField} from '@material-ui/core';

const MyAutocomplete = ({options, id, name, value, checked, onChange}) => (
  <Autocomplete
    options = {options}

    id={id}
    name={name}
    value={value}
    checked={checked}
    onChange={onChange}
    
    renderInput={(params) => (
      <TextField
        {...params}
        label=""
      />
    )}
  />
)

export {
  MyAutocomplete
}