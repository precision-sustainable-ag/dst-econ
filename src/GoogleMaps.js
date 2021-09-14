import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import throttle from 'lodash/throttle';
import stateRegions from './stateRegions';

const autocompleteService = { current: null };

const GoogleMaps = ({parms, sets}) => {
  const [location, setValue] = React.useState(parms.location, null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);

  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 200),
    [],
  );

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }

    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === '') {
      setOptions(location ? [location] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (location) {
          newOptions = [location];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [location, inputValue, fetch]);

  return (
    <Autocomplete
      id="googlemap"
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={location}
      // getOptionSelected={(option, value) => option.id === value.id}  // avoids warning, per https://stackoverflow.com/a/65347275/3903374, but prevents re-entry of data
      
      onChange={(event, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
        if (newValue) {
          sets.location(newValue.description);
          setValue(newValue.description);
          const geocoder = new window.google.maps.Geocoder();

          geocoder.geocode({
            address: newValue.description,
            region: 'en-US',
          }, (results, status) => {
            let state = results ? results[0].address_components.filter(obj => obj.types[0] == 'administrative_area_level_1') : '';
            if (state) {
              state = state[0].long_name;
              sets.state(state);
            } else {
              sets.state('');
            }
            
            if (results && results[0]) {
              sets.lat(results[0].geometry.location.lat().toFixed(4));
              sets.lng(results[0].geometry.location.lng().toFixed(4));
            }
          });
        }
      }}

      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}

      renderInput={(params) => (
        <TextField
          {...params}
          label="Find your Location"
          variant="outlined" 
        />
      )}
    />
  );
}

export default GoogleMaps;