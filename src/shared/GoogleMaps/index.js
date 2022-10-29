import React, {useCallback, useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {TextField, Grid, Typography} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import throttle from 'lodash/throttle';
import parse from 'autosuggest-highlight/parse';
import GoogleMapReact from 'google-map-react';
import {Fullscreen, FullscreenExit} from '@mui/icons-material';

import {Input} from '../Inputs';
import {Help} from '../Help';
import {get, set} from '../../store/Store';

import './styles.scss';

const autocompleteService = {current: null};

const Map = ({field=false, autoFocus, inputs=true, id='GoogleMap', mapOptions={}}) => {
  const GoogleMaps = ({autoFocus=false, field=false, inputs=true}) => {
    const lat = +useSelector(get.lat);
    const lon = +useSelector(get.lon);
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
  
    const geocode = useCallback((newValue) => {
      setOptions(newValue ? [newValue, ...options] : options);
      if (newValue) {
        const geocoder = new window.google.maps.Geocoder();
  
        geocoder.geocode({
          address: newValue.description,
          region: 'en-US',
        }, (results) => {
          if (results && results[0]) {
            let state = results[0].address_components.filter(obj => obj.types[0] === 'administrative_area_level_1');
            let stateAbbreviation = '';
            
            if (state) {
              stateAbbreviation = state[0];
              state = state[0].long_name;
            }

            updateLocation({
              lat: results[0].geometry.location.lat(),
              lon: results[0].geometry.location.lng(),
              location: newValue.description,
              state,
              stateAbbreviation,
            });
          }
        });
      }
    }, [options]); // geocode
  
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
        {
          inputs && (
            <Input
              id="location"
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
              options={options}
              autoComplete
              includeInputInList
              filterSelectedOptions
      
              onChange={(_, newValue) => {geocode(newValue);}}

              onKeyDown={({key, target}) => {
                if (key === 'Tab') {
                  geocode({description: target.value});
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
  
              renderOption={(props, option) => {
                let matches = [];
                let parts = [];
                if (option.structured_formatting) {
                  matches = option.structured_formatting.main_text_matched_substrings;
        
                  parts = parse(
                    option.structured_formatting.main_text,
                    matches.map((match) => [match.offset, match.offset + match.length]),
                  );
                }
        
                return (
                  <Grid container spacing={1} alignItems="center" {...props}>
                    <Grid item>
                      <LocationOnIcon />
                    </Grid>
                    <Grid item xs>
                      {parts.map((part, index) => (
                        <span key={index} style={{fontWeight: part.highlight ? 700 : 400}}>
                          {part.text}
                        </span>
                      ))}
        
                      <Typography variant="body2" color="textSecondary">
                        {option.structured_formatting ? option.structured_formatting.secondary_text : ''}
                      </Typography>
                    </Grid>
                  </Grid>
                );
              }}
            />
          )
        }
        
        {
          field &&
          <>
            <Input
              label="Name your Field"
              id="field"
              autoComplete="off"
              style={{width: 'calc(50% - 2em)', height: '3rem'}}
            />
            <Help className="moveLeft">
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
            </Help>
          </>
        }

        {
          inputs && (
            <div id="coordinates">
              If you know your exact coordinates, you can enter them here:
              <div>
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
            </div>
          )
        }
      </>
    );
  } // GoogleMaps
  
  const dispatch = useDispatch();
  const lat = +useSelector(get.lat);
  const lon = +useSelector(get.lon);
  const location = useSelector(get.location);
  const state = useSelector(get.state);
  const stateAbbreviation = useSelector(get.stateAbbreviation);
  const mapPolygon = useSelector(get.mapPolygon);

  // const [mapType, setMapType] = useState('hybrid');
  // console.log(mapType);  // TODO
  const mapType = useSelector(get.mapType);
  const mapZoom = useSelector(get.mapZoom);

  const [, setLoaded] = React.useState(false);

  const updateLocation = ({lat, lon, ...parms}) => {
    lat = +(lat.toFixed(4));
    lon = +(lon.toFixed(4));

    const mz = new window.google.maps.MaxZoomService();
    mz.getMaxZoomAtLatLng({lat, lng: lon}, (result) => {
      dispatch({
        type: 'updateLocation',
        payload: {
          lat,
          lon,
          maxZoom: result.zoom,
          location: parms.location || location,
          state: parms.state || state,
          stateAbbreviation: parms.state || stateAbbreviation,
        }
      });
    });
  } // updateLocation

  const initGeocoder = ({map, maps, ref}) => {
    const geocode = ({latLng}) => {
      const lat = latLng.lat();
      const lon = latLng.lng();

      const latlng = {
        lat,
        lng: lon
      };
  
      Geocoder
        .geocode({location: latlng})
        .then(response => {
          const results = response.results;
          const location = results[0].formatted_address;
  
          let state = results ? results[0].address_components.filter(obj => obj.types[0] === 'administrative_area_level_1') : '';
          if (state) {
            state = state[0].long_name;
          }

          updateLocation({
            lat,
            lon,
            mapPolygon: [],
            state,
            location,
          });
        })
        .catch((e) => window.alert('Geocoder failed due to: ' + e));
    } // geocode

    const click = ({latLng}) => {
      const lat = latLng.lat();
      const lon = latLng.lng();

      marker.setPosition({lat, lng: lon});

      if (polygon) {
        polygon.setMap(null);
        points = [];
        dispatch(set.mapPolygon([]));
      }

      geocode({latLng});
    } // click
  
    const clearPolygon = () => {
      const options = {
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1,
        strokeWeight: 2,      
      };

      if (polygon) {
        polygon.setMap(null);
      }
      polygon = new maps.Polygon(options);
      polygon.setMap(map);

      if (polyline) {
        polyline.setMap(null);
      }
      polyline = new maps.Polyline(options);
      polyline.setMap(map);
    } // clearPolygon

    let drawing = false;
    let polygon;
    let polyline;
    let points = [];

    setTimeout(() => {
      ref
        .querySelectorAll('#GoogleMap *')
        .forEach(item => {
          item.setAttribute('tabIndex', -1);
        });
    }, 1000);

    const Geocoder = new maps.Geocoder();

    const marker = new maps.Marker({
      map,
      icon: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
      draggable: true,
      title: 'Click and hold to drag',
    });
    
    marker.setPosition({lat, lng: lon});

    marker.addListener('dragend', geocode);

    clearPolygon();

    mapPolygon.forEach(point => {
      polygon.getPath().insertAt(0, point);
    });

    const mousedown = (e) => {
      if (e.button === 2) {
        clearPolygon();
        points = [];

        map.setOptions({
          draggable: false,
        });
        
        drawing = true;
      }
    } // mousedown
    
    ref.addEventListener('mousedown', mousedown);
    map.addListener('click', click);

    const finished = () => {
      if (drawing) {
        drawing = false;

        clearPolygon();

        const bounds = new maps.LatLngBounds();

        points.forEach(point => {
          polygon.getPath().insertAt(0, point)
          bounds.extend(point);
        });

        if (points.length) {
          const lat = bounds.getCenter().lat();
          const lon = bounds.getCenter().lng();
          updateLocation({
            lat,
            lon,
            mapPolygon: points
          });

          marker.setPosition({lat, lng: lon});
          geocode({
            latLng: {
              lat: () => lat,
              lng: () => lon
            }
          })
        }

        map.setOptions({
          draggable: true,
        });
      }
    } // finished

    ref.addEventListener('mouseup', finished);

    maps.event.addListener(map, 'mousemove', (e) => {
      if (drawing) {
        points.push(e.latLng);
        polyline.getPath().insertAt(0, e.latLng);
      }
    });      
    
    setLoaded(true);
  } // initGeocoder

  const [fullsize, setFullsize] = useState(false);

  useEffect(() => {
    const kd = ({key}) => {
      if (key === 'Escape') {
        setFullsize(false);
      }
    };

    document.addEventListener('keydown', kd);
    
    return () => {
      document.removeEventListener('keydown', kd);  
    }
  }, []);

  const mapStyle = fullsize 
    ? {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 10000,
    }
    : {
      position: 'relative',
      height: '100%',
    }

  return (
    <div className="Map" id={id}>
      {
        inputs && (
          <>
            <h1>Where is your Field located?</h1>
            <p>
              Enter your address or zip code to determine your field's location.
              You can then zoom in and click to pinpoint it on the map.
            </p>
          </>
        )
      }

      <GoogleMaps field={field} autoFocus={autoFocus} inputs={inputs} />
      {
        lat && lon ? (
          <div style={mapStyle}>
            <span
              className="fullsize"

              onClick={() => {
                setFullsize(!fullsize);
              }}

              title="Toggle fullscreen view"
            >
              {
                fullsize ? <FullscreenExit /> : <Fullscreen />
              }
            </span>

            <GoogleMapReact
              bootstrapURLKeys={{key: 'AIzaSyD8U1uYvUozOeQI0LCEB_emU9Fo3wsAylg', libraries: ['places']}}
              center={{lat: +lat, lng: +lon}}
              zoom={mapOptions.zoom || mapZoom}

              yesIWantToUseGoogleMapApiInternals
              onGoogleApiLoaded={initGeocoder}

              onZoomAnimationEnd={(zoom) => dispatch(set.mapZoom(zoom))}
              // onMapTypeIdChange={(type)  => setMapType(type)}
              onMapTypeIdChange={(type) => dispatch(set.mapType(type))}

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
                ...mapOptions
              })}
            />
          </div>
        )
        : null
      }
    </div>
  );
} // Map

export default Map;