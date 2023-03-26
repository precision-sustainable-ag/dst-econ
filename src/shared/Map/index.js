/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-relative-packages */

import React from 'react';
import { useSelector } from 'react-redux';

import mapboxgl from 'mapbox-gl';
// import { NcalcMap as Map } from '@psa/dst.ui.ncalc-map';
import { NcalcMap as Map } from './map';
import { get, set } from '../../store/Store';
import './styles.scss';
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const OpeningMap = () => (
  <Map
    getters={get}
    setters={set}
    bounds={[
      [-124.731422, 24.743319], // Southwest coordinates
      [-66.969849, 49.345786], // Northeast coordinates
    ]}
    layer="mapbox://styles/mapbox/outdoors-v11"
    initWidth="100%"
    initHeight="400px"
    hasSearchBar
    hasGeolocate
  />
); // OpeningMap

const InteractiveMap = () => (
  <Map
    getters={get}
    setters={set}
    initWidth="100%"
    initHeight="400px"
    initStartZoom={13}
    hasSearchBar
    hasGeolocate
    hasMarker
    hasNavigation
    hasCoordBar
    hasDrawing
    hasFullScreen
    hasMarkerPopup
    hasMarkerMovable
  />
); // InteractiveMap

const MapComp = () => {
  const lat = useSelector(get.lat);

  return (
    <div className="map">
      <div className="mapHeaderText">
        <h1>Where is your Field located?</h1>
        <p>
          Enter your address or Zip code in the search bar below.
          You can then zoom in and move the marker to your precise location by dragging it or by double-clicking the map.
          If you already know your coordinates, you can enter them in the search bar separated by a comma (for example, 37.7, -80.2).
        </p>
      </div>
      {
        lat === 0 ? <OpeningMap /> : <InteractiveMap />
      }
    </div>
  );
};

export default MapComp;
