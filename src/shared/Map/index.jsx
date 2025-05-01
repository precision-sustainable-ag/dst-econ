import React from 'react';
import { useSelector } from 'react-redux';
import { PSAReduxMap as Map } from 'shared-react-components/src';
import { get, set } from '../../store/Store';
import './styles.scss';

const OpeningMap = () => (
  <Map
    getter={get.map}
    setter={set.map}
    layer="mapbox://styles/mapbox/outdoors-v11"
    hasSearchBar
    hasGeolocate
    hasMarkerMovable
    hasMarker
    hasImport
  />
); // OpeningMap

const InteractiveMap = () => (
  <Map
    getter={get.map}
    setter={set.map}
    initWidth="100%"
    hasSearchBar
    hasGeolocate
    hasMarker
    hasNavigation
    hasCoordBar
    hasDrawing
    hasFullScreen
    hasMarkerPopup
    hasMarkerMovable
    hasHelp
    hasImport
    hasFreehand
  />
); // InteractiveMap

const MapComp = () => {
  const lat = useSelector(get.map.lat);

  return (
    <div className="map">
      <div className="mapHeaderText">
        <h1>Where is this field located?</h1>
        <p>
          Enter your address or Zip code in the search bar below.
          You can then zoom in and move the marker to your precise location by dragging it or by double-clicking the map.
          If you already know your coordinates, you can enter them in the search bar separated by a comma (for example, 37.7, -80.2).
        </p>
      </div>
      <div className="mapBody">
        {
        lat === 0 ? <OpeningMap /> : <InteractiveMap />
      }
      </div>
    </div>
  );
};

export default MapComp;
