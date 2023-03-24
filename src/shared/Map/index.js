/* eslint-disable import/no-extraneous-dependencies */

import React, { useState, useEffect } from 'react';
import { Map } from '@psa/dst.ui.map';
import { useDispatch, useSelector } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import { get, set } from '../../store/Store';
import './styles.scss';
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

let removedShapes = new Set();

const MapComp = ({ initWidth, initHeight, zScore }) => {
  const [address, setAddress] = useState({});
  const [geometry, setGeometry] = useState([]);
  const dispatch = useDispatch();
  const mapAddress = useSelector(get.mapAddress);
  const lat = useSelector(get.lat);
  const lon = useSelector(get.lon);
  const mapPolygon = useSelector(get.mapPolygon);
  const [features, setFeatures] = useState(mapPolygon);
  const [drawEvent, setDrawEvent] = useState({});

  const initStartZoom = 10;

  useEffect(() => {
    dispatch(set.mapPolygon(geometry));
    dispatch(set.mapZoom(initStartZoom));
    dispatch(set.mapType('satellite'));
    if (address.latitude) dispatch(set.lat(address.latitude));
    if (address.longitude) dispatch(set.lon(address.longitude));
  }, [address, geometry]);

  useEffect(() => {
    if (drawEvent.mode === 'delete') {
      removedShapes = removedShapes.add(drawEvent.e.features[0].id);
    }
    const ids = new Set(mapPolygon.map((d) => d.id));
    const merged = [
      ...mapPolygon.filter((d) => !removedShapes.has(d.id)),
      ...features.filter((d) => !ids.has(d.id) && !removedShapes.has(d.id)),
    ];
    dispatch(set.mapPolygon(merged));
  }, [drawEvent]);

  return (
    <div className="map" style={{ zScore }}>
      <div className="mapHeaderText">
        <h1>Where is your Field located?</h1>
        <p>
          Enter your address or Zip code in the search bar below.
          You can then zoom in and move the marker to your precise location by dragging it or by double-clicking the map.
          If you already know your coordinates, you can enter them in the search bar separated by a comma (for example, 37.7, -80.2).
        </p>
      </div>
      <Map
        setAddress={setAddress}
        setFeatures={setFeatures}
        setGeometry={setGeometry}
        onDraw={setDrawEvent}
        initFeatures={mapPolygon}
        initWidth={initWidth}
        initHeight={initHeight}
        initAddress={mapAddress?.address}
        initLon={lon}
        initLat={lat}
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
