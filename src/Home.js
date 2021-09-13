import GoogleMaps from './GoogleMaps';
import GoogleMapReact from 'google-map-react';

import {
  Input,
  OutlinedInput,
} from '@material-ui/core';

const Map = ({sets, parms, ps}) => {
  const mapChange = (e) => {
    sets.lat(+e.lat.toFixed(4));
    sets.lng(+e.lng.toFixed(4));
  } // mapChange

  const Marker = () => (
    <img alt="marker" className="marker" src="marker.png" style={{height: '40px'}} />
  )

  return (
    <>
      <GoogleMaps sets={sets} ps={ps} parms={parms} />
      {
        parms.lat && parms.lng &&
        <div style={{ height: '400px', width: '100%' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyD8U1uYvUozOeQI0LCEB_emU9Fo3wsAylg' }}
            center={{lat: +parms.lat, lng: +parms.lng}}
            zoom={parms.mapZoom}

            yesIWantToUseGoogleMapApiInternals
            onClick={mapChange}
            onZoomAnimationEnd={sets.mapZoom}
            onMapTypeIdChange={sets.mapType}

            options={(map) => ({
              mapTypeId: parms.mapType,
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
            <Marker lat={+parms.lat} lng={+parms.lng} />
          </GoogleMapReact>
        </div>
      }
    </>
  );
} // Map

const Home = ({ps, sets, parms, setScreen}) => (
  <div>
    <h1 id="H1">Economic Decision Aid for Cover Crops</h1>
    <h2>Where is your field located?</h2>
    <p>
      Enter your address or zip code to determine your field's location.<br/>
      You can then zoom in and click to pinpoint it on the map.
    </p>
    
    <Map sets={sets} parms={parms} ps={ps} />
    
    <div>
      Latitude:&nbsp;
      <Input {...ps('lat')} />
      &nbsp;&nbsp;&nbsp;
      Longitude:&nbsp;
      <Input {...ps('lng')} />
    </div>
    <p id="D2">
      <em>This worksheet is for educational purposes only. The user assumes all risks associated with its use.</em>
    </p>
  </div>
) // Home

export default Home;