import React from 'react';

import {TextField, OutlinedInput, Icon} from '@mui/material';
import {Input, Autocomplete} from './NewInputs';
import throttle from 'lodash/throttle';
import GoogleMapReact from 'google-map-react';

import {useSelector, useDispatch} from 'react-redux';
import {get, set} from '../app/store';

const autocompleteService = { current: null };

const GoogleMaps = ({autoFocus=false, field=false}) => {
  const dispatch = useDispatch();

  const lat = useSelector(get.lat);
  const lon = useSelector(get.lon);
  const location = useSelector(get.location);

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
      setOptions([]);
      return;
    } else {
      fetch({input: inputValue}, (results) => {
        if (active) {
          setOptions(results || []);
        }
      });
    }

    return () => {
      active = false;
    };
  }, [location, inputValue, fetch]);

  return (
    <>
      <Autocomplete
        id="location"
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
        options={options}
        autoComplete
        includeInputInList
        filterSelectedOptions

        isOptionEqualToValue={(option, value) => {return false;}}  // TODO
        
        onChange={(_, newValue) => {
          setOptions(newValue ? [newValue, ...options] : options);
          if (newValue) {
            dispatch(set.location(newValue.description));
            const geocoder = new window.google.maps.Geocoder();

            geocoder.geocode({
              address: newValue.description,
              region: 'en-US',
            }, (results, status) => {
              let state = results ? results[0].address_components.filter(obj => obj.types[0] === 'administrative_area_level_1') : '';
              if (state) {
                state = state[0].long_name;
                dispatch(set.state(state));
              } else {
                dispatch(set.state(''));
              }
              
              if (results && results[0]) {
                dispatch(set.lat(results[0].geometry.location.lat().toFixed(4)));
                dispatch(set.lon(results[0].geometry.location.lng().toFixed(4)));
              }
            });
          }
        }}

        onInputChange={(_, newInputValue) => {
          setInputValue(newInputValue);
        }}

        renderInput={(params) => {
          return (
            <>
              <TextField
                {...params}
                autoFocus={autoFocus}
                label="Find your Location"
                style={{width: field ? '50%' : '100%', float: field ? 'left' : ''}}
              />
            </>
          )
        }}
      />
      
      {
        field &&
        <>
          <OutlinedInput
            className="field"
            label="Name your Field"
            id="field"
            autoComplete="off"
            style={{width: 'calc(50% - 2em)'}}
          />
          <Icon className="moveLeft">
            help
            <p>
              This input is optional.  If you enter a field name, you'll be able to rerun the model on this computer without re-entering your data.
            </p>
            <p>
              Notes:
            </p>
            <ul>
              <li>If you have multiple fields, you'll be able to select them from a drop-down menu in the upper-right.</li>
              <li>Your information is stored on your computer only.  It will not be uploaded to a server.</li>
              <li>If you clear your browser's cache, you'll need to re-enter your data the next time you run the program.</li>
            </ul>
          </Icon>
        </>
      }

      <p/>
      <div tabIndex="-1">
        If you know your exact coordinates, you can enter them here:
        <br/>
        <Input
          id="lat"
          value={lat}
          label="Latitude"
          type="number"
          sx={{margin: 1}}
        />
        <Input
          id="lon"
          value={lon}
          label="Longitude"
          type="number"
          sx={{margin: 1}}
        />
      </div>
    </>
  );
}

const Map = ({field=false, autoFocus}) => {
  const dispatch = useDispatch();
  const lat = useSelector(get.lat);
  const lon = useSelector(get.lon);
  const mapType = useSelector(get.mapType);
  const mapZoom = useSelector(get.mapZoom);

  const mapChange = (e) => {
    dispatch(set.lat(e.lat.toFixed(4)));
    dispatch(set.lon(e.lng.toFixed(4)));

    const latlng = {
      lat: e.lat,
      lng: e.lng,
    };

    Geocoder
      .geocode({ location: latlng })
      .then(response => {
        const results = response.results;
        const location = results[0].formatted_address;
        dispatch(set.location(location));

        let state = results ? results[0].address_components.filter(obj => obj.types[0] === 'administrative_area_level_1') : '';
        if (state) {
          state = state[0].long_name;
          dispatch(set.state(state));
        } else {
          dispatch(set.state(''));
        }
      })
      .catch((e) => window.alert('Geocoder failed due to: ' + e));
  } // mapChange

  const Marker = () => (
    <img alt="marker" className="marker" src="marker.png" style={{height: '40px'}} />
  )

  const initGeocoder = ({ maps }) => {
    Geocoder = new maps.Geocoder();
  };

  if (false) {
    return (
      <>
        <GoogleMaps field={field} autoFocus={autoFocus}/>
        work in progress
      </>
    )
  }

  return (
    <>
      <GoogleMaps field={field} autoFocus={autoFocus}/>
      {
        false && lat && lon &&
        <div style={{ height: '400px', width: '100%' }} id="GoogleMap">
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyD8U1uYvUozOeQI0LCEB_emU9Fo3wsAylg' }}
            center={{lat: +lat, lng: +lon}}
            zoom={mapZoom}

            onGoogleApiLoaded={initGeocoder}
            
            yesIWantToUseGoogleMapApiInternals
            onClick={mapChange}
            onZoomAnimationEnd={(zoom) => dispatch(set.mapZoom(zoom))}
            onMapTypeIdChange={(type)  => dispatch(set.mapType(type))}

            onLoad={
              // prevent tabbing through map
              // got to be a better way than setting a timeout
              setTimeout(() => {
                document.querySelectorAll('#GoogleMap *').forEach(item => item.setAttribute('tabindex', -1));
              }, 1000)
            }

            options={(map) => ({
              mapTypeId: mapType,
              fullscreenControl: false,
              scaleControl: true,
              mapTypeControl: true,
              mapTypeControlOptions: {
                style: map.MapTypeControlStyle.HORIZONTAL_BAR,
                mapTypeIds: [
                  'roadmap',
                  'satellite',
                  'hybrid',
                  'terrain'
                ]
              },
            })}
          >
            <Marker lat={+lat} lng={+lon} />
          </GoogleMapReact>
        </div>
      }
    </>
  );
} // Map

let Geocoder;

export default Map;