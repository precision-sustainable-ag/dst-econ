/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-relative-packages */

import React from 'react';
// import { Map } from '@psa/dst.ui.map';
import mapboxgl from 'mapbox-gl';
import { NcalcMap as Map } from './map';
import { get, set } from '../../store/Store';
import './styles.scss';
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const MapComp = () => (
  <div className="map">
    <div className="mapHeaderText">
      <h1>Where is your Field located?</h1>
      <p>
        Enter your address or Zip code in the search bar below.
        You can then zoom in and move the marker to your precise location by dragging it or by double-clicking the map.
        If you already know your coordinates, you can enter them in the search bar separated by a comma (for example, 37.7, -80.2).
      </p>
    </div>
    <Map
      getters={get}
      setters={set}
      initWidth="100%"
      initHeight="400px"
      hasSearchBar
      hasMarker
      hasNavigation
      hasCoordBar
      hasDrawing
      hasGeolocate
      hasFullScreen
      hasMarkerPopup
      hasMarkerMovable
    />
  </div>
);

export default MapComp;
