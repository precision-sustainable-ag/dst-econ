import GoogleMaps from './GoogleMaps';
import GoogleMapReact from 'google-map-react';
import {Navigation} from './Navigation';
import {Input, Select, MenuItem} from '@material-ui/core';

const Map = ({sets, parms, ps, update}) => {
  const mapChange = (e) => {
    sets.lat(+e.lat.toFixed(4));
    sets.lng(+e.lng.toFixed(4));

    const latlng = {
      lat: e.lat,
      lng: e.lng,
    };

    Geocoder
      .geocode({ location: latlng })
      .then(response => {
        const results = response.results;
        const location = results[0].formatted_address;
        sets.location(location);

        let state = results ? results[0].address_components.filter(obj => obj.types[0] === 'administrative_area_level_1') : '';
        if (state) {
          state = state[0].long_name;
          sets.state(state);
        } else {
          sets.state('');
        }

        update(undefined, 'location', location);
      })
      .catch((e) => window.alert('Geocoder failed due to: ' + e));
  } // mapChange

  const Marker = () => (
    <img alt="marker" className="marker" src="marker.png" style={{height: '40px'}} />
  )

  const initGeocoder = ({ maps }) => {
    Geocoder = new maps.Geocoder();
  };

  return (
    <>
      <GoogleMaps sets={sets} ps={ps} parms={parms} />
      {
        parms.lat && parms.lng &&
        <div style={{ height: '400px', width: '100%' }} id="GoogleMap">
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyD8U1uYvUozOeQI0LCEB_emU9Fo3wsAylg' }}
            center={{lat: +parms.lat, lng: +parms.lng}}
            zoom={parms.mapZoom}

            onGoogleApiLoaded={initGeocoder}
            
            yesIWantToUseGoogleMapApiInternals
            onClick={mapChange}
            onZoomAnimationEnd={sets.mapZoom}
            onMapTypeIdChange={sets.mapType}

            onLoad={
              // prevent tabbing through map
              // got to be a better way than setting a timeout
              setTimeout(() => {
                document.querySelectorAll('#GoogleMap *').forEach(item => item.setAttribute('tabindex','-1'));
              }, 1000)
            }

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

const FieldAndFarm = ({ps, sets, parms, setScreen, update}) => (
  <div className="fieldAndFarm">
    <h1 id="H1">Economic Decision Aid for Cover Crops: Field and Farm</h1>
    
    <p>
      Our first step with the <strong><em>Cover Crop Economic DST (Decision Support Tool)</em></strong> is to provide basic information on the field you wish to examine.
    </p>
    <p>
      If you are a registered user, this information will be saved to your account but not utilized for any other purpose.
      If you are a guest user, the information will not be saved and cannot be accessed by you again if you close out of the DST.
    </p>

    <p>
      Please answer all of the following:
    </p>

    <table class="fullWidth">
      <tbody>
        <tr>
          <td>What is the name of your Farm?</td>
          <td><Input {...ps('farm')} autoFocus={true} /></td>
          <td rowSpan="6">
            Where is your Field located?
            <p>
              Enter your address or zip code to determine your field's location.<br/>
              You can then zoom in and click to pinpoint it on the map.
            </p>
            <Map sets={sets} parms={parms} ps={ps} update={update} />
    
            <div>
              Latitude:&nbsp;
              <Input {...ps('lat')} inputProps={{ tabIndex: "-1" }} />
              &nbsp;&nbsp;&nbsp;
              Longitude:&nbsp;
              <Input {...ps('lng')} inputProps={{ tabIndex: "-1" }} />
            </div>
          </td>

        </tr>

        <tr>
          <td>How many acres are in your Field?</td>
          <td><Input {...ps('acres')} /></td>
        </tr>

        <tr>
          <td>Which of the following options best describes your Field?</td>
          <td>
            <Select {...ps('description')} style={{width: '100%'}} >
              <MenuItem></MenuItem>
              <MenuItem value="hw">Hill ground; well-drained</MenuItem>
              <MenuItem value="hp">Hill ground; poorly-drained</MenuItem>
              <MenuItem value="bw">Bottom land; well-drained</MenuItem>
              <MenuItem value="bp">Bottom land; poorly-drained</MenuItem>
            </Select>
          </td>
        </tr>

        <tr>
          <td>What was the Prior Crop planted on this Field?</td>
          <td>
            <Select {...ps('priorCrop')} style={{width: '100%'}} >
              <MenuItem></MenuItem>
              <MenuItem value="corn">Corn</MenuItem>
              <MenuItem value="soybeans">Soybeans</MenuItem>
              <MenuItem value="wheat">Wheat</MenuItem>
              <MenuItem value="sorghum">Grain Sorghum (milo)</MenuItem>
              <MenuItem value="cotton">Cotton</MenuItem>
              <MenuItem value="rice">Rice</MenuItem>
              <MenuItem value="sunflowers">Sunflowers</MenuItem>
              <MenuItem value="canola">Canola</MenuItem>
              <MenuItem value="fallow">Fallow</MenuItem>
              <MenuItem value="prevent">Prevent Plant Acres</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
            <br/>
            {
              parms.priorCrop === 'other' && 
              <Input {...ps('otherPriorCrop')} placeholder="Enter crop here" />
            }
          </td>
        </tr>

        <tr>
          <td>What is your intended Cash Crop for this Field?</td>
          <td>
            <Select {...ps('cashCrop')} style={{width: '100%'}} >
              <MenuItem></MenuItem>
              <MenuItem value="corn">Corn</MenuItem>
              <MenuItem value="soybeans">Soybeans</MenuItem>
              <MenuItem value="wheat">Wheat</MenuItem>
              <MenuItem value="sorghum">Grain Sorghum (milo)</MenuItem>
              <MenuItem value="cotton">Cotton</MenuItem>
              <MenuItem value="rice">Rice</MenuItem>
              <MenuItem value="sunflowers">Sunflowers</MenuItem>
              <MenuItem value="canola">Canola</MenuItem>
              <MenuItem value="other">Other </MenuItem>
            </Select>
            <br/>
            {
              parms.cashCrop === 'other' && 
              <Input {...ps('otherCashCrop')} placeholder="Enter crop here" />
            }
          </td>
        </tr>
        
        <tr>
          <td>What is your Labor Value for Analysis? ($/hour)</td>
          <td><Input {...ps('labor')} autoComplete="off" /></td>
        </tr>
      </tbody>
    </table>

    <Navigation setScreen={setScreen} current={FieldAndFarm} />
  </div>
) // FieldAndFarm

FieldAndFarm.menu = 'Field and Farm';

let Geocoder;

export default FieldAndFarm;