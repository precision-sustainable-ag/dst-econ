/* eslint-disable import/no-extraneous-dependencies */

import React, { useState, useEffect } from 'react';
import { Map } from '@psa/dst.ui.map';
import { useDispatch } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import { set } from '../../store/Store';
import './styles.scss';
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const MapComp = ({ initWidth, initHeight, zScore }) => {
  const [address, setAddress] = useState({});
  const [geometry, setGeometry] = useState([]);
  const dispatch = useDispatch();
  const initStartZoom = 10;
  useEffect(() => {
    dispatch(set.mapPolygon(geometry));
    dispatch(set.mapZoom(initStartZoom));
    dispatch(set.mapType('satellite'));
    if (address.latitude) dispatch(set.lat(address.latitude));
    if (address.longitude) dispatch(set.lon(address.longitude));
  }, [address, geometry]);

  return (
    <div className="map" style={{ zScore }}>
      <div className="mapHeaderText">
        <h1>Where is your Field located?</h1>
        <p>
          Enter your address or zip code to determine your field&apos;s location.
          You can then zoom in and click to pinpoint it on the map. If you
          know your exact coordinates, you can enter them in search bar separated by comma
          (ex. 37.7, -80.2 ).
        </p>
      </div>
      <Map
        setAddress={setAddress}
        setGeometry={setGeometry}
        initWidth={initWidth}
        initHeight={initHeight}
        initLon={-80.16}
        initLat={37.75}
        initStartZoom={initStartZoom}
        initMinZoom={5}
        initMaxZoom={16}
        hasSearchBar
        hasMarker
        hasNavigation
        hasCoordBar
        hasDrawing
        hasGeolocate
        hasFullScreen
        hasMarkerPopup
        hasMarkerMovable
        style={{ zScore }}
      />
    </div>
  );
};

export default MapComp;
