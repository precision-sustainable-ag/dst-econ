/* eslint-disable no-underscore-dangle */
import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import area from '@turf/area';
import centroid from '@turf/centroid';
import * as shapefile from 'shapefile';
import { geocodeReverse, coordinatesGeocoder } from './helpers';
// import { MapboxApiKey } from '../../../store/keys';

import fullscreenIcon from './fullscreen.png';
import polygonIcon from './polygon.png';
import freehandIcon from './freehand.png';
import trashcanIcon from './trashcan.png';

import styles from './map.module.scss';

import './mapbox-gl.css';
import './mapbox-gl-draw.css';
import './mapbox-gl-geocoder.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWlrYWhwaW5lZ2FyIiwiYSI6ImNseHZ2NndjZDJrejMycXB4dWtlamo2eWYifQ.29yeP8CgZpO98jyzxYxU4Q';
mapboxgl.accessToken = MAPBOX_TOKEN;

const acreDiv = 4046.856422;

const elevations = {};
let elevationTimer;

let fpolygon = [[]];

const Help = () => (
  <dialog id="MapHelp">
    <button
      type="button"
      onClick={(event) => {
        event.target.closest('dialog').close();
      }}
    >
      X
    </button>
    <p><strong>Controls</strong></p>
    <p>
      For a larger map after the location is selected, click the full screen icon:
      <img className="icon" alt="fullscreen" src={fullscreenIcon} style={{ height: '2rem' }} />
    </p>

    <p>
      You can use the polygon tool on the right side of the map to outline the site area and estimate its acreage:
      <img className="icon" alt="polygon" src={polygonIcon} style={{ height: '2rem' }} />
      <br />
      To create the boundary, click on each point that defines your field on the map.
      <br />
      Double-click the final point to close the polygon.
    </p>

    <p>
      You can also use the freehand tool to outline the site area and estimate its acreage:
      <img className="icon" alt="freehand" src={freehandIcon} style={{ height: '1.5rem' }} />
      <br />
      To create the boundary, click on the edge of your field and drag the mouse around the perimeter.
      <br />
      Release the mouse button to close the polygon.
    </p>

    <p>
      If you already have a shape file with your field boundaries, you can import it by clicking the&nbsp;
      <strong>SHP</strong>
      &nbsp;button.
    </p>

    <p>
      To delete and re-draw polygons, select the polygon, then click the trash can icon under the polygon tool:
      <img className="icon" alt="trashcan" src={trashcanIcon} style={{ height: '2rem' }} />
    </p>

    <p>
      To restart all location services, use the &quot;Clear inputs&quot; button in the upper right of the screen.
    </p>
  </dialog>
);

const ReduxMap = ({
  getters = {},
  setters = {},
  setMap = () => {},
  initWidth,
  initHeight,
  initFeatures = getters.map?.features ? useSelector(getters.map.features) : [],
  mapLocation = getters.map ? useSelector(getters.map) : { lat: 40, lon: -75, address: { fullAddress: '' } },
  initAddress = mapLocation.address?.fullAddress || '',
  initLon = +mapLocation.lon || -75,
  initLat = +mapLocation.lat || -40,
  initStartZoom = getters.map ? useSelector(getters.map.zoom) : 12,
  hasSearchBar = false,
  hasMarker = false,
  hasNavigation = false,
  hasCoordBar = false,
  hasFreehand = false,
  hasDrawing = false,
  hasGeolocate = false,
  hasFullScreen = false,
  hasMarkerMovable = false,
  hasImport = false,
  hasElevation = false,
  hasHelp = false,
  scrollZoom = true,
  dragRotate = true,
  dragPan = true,
  keyboard = true,
  doubleClickZoom = false,
  touchZoomRotate = true,
  markerOptions = {},
  autoFocus = false,
  layer = 'mapbox://styles/mapbox/satellite-streets-v12',
  bounds = getters?.map?.bounds ? useSelector(getters.map.bounds) : false,
  mapArea = getters?.map?.area ? useSelector(getters.map.area) : 0,
  fitMapToPolygons = false,
  fitBounds = false,
}) => {
  const dispatch = useDispatch();
  let newPolygon;

  const boundsPadding = hasSearchBar ? 50 : 20;

  const [cursorLoc, setCursorLoc] = useState({
    longitude: undefined,
    latitude: undefined,
  });
  const [polygonArea, setPolygonArea] = useState(0);
  const [isDrawActive, setIsDrawActive] = useState(false);
  const [geocodeResult, setGeocodeResult] = useState(undefined);
  const [searchBox, setSearchBox] = useState();
  const [marker, setMarker] = useState({
    longitude: initLon,
    latitude: initLat,
  });

  const map = useRef();
  const mapContainer = useRef();
  const drawerRef = useRef();
  const markerRef = useRef();
  const popupRef = useRef();
  const geocoderRef = useRef();
  const elevationRef = useRef();

  const inFreehand = () => mapContainer.current?.querySelector('#freehand')?.classList?.contains('active');

  const updateFeatures = () => {
    const newFeatures = [];
    const { sources } = map.current.getStyle();
    let totalArea = 0;

    try {
      drawerRef.current.deleteAll();
    } catch (ee) { /* */ }

    Object.keys(sources).forEach((sourceName) => {
      const source = map.current.getSource(sourceName);
      if (source.type === 'geojson') {
        const { features } = source._data;
        if (features?.length) {
          newFeatures.push(...features);
          features.forEach((feature) => {
            totalArea += area(feature) / acreDiv;
          });
        } else {
          totalArea += area(source._data) / acreDiv;
          newFeatures.push(source._data);
        }
      }
    });

    setPolygonArea(totalArea);

    if (setters.map) {
      dispatch(setters.map((cmap) => (
        {
          ...cmap,
          features: newFeatures.filter((f) => f.geometry?.type === 'Polygon'),
          area: totalArea.toFixed(2),
        }
      )));
    }
  }; // updateFeatures

  const updateLocation = async (addr, newMarker) => {
    let elevation;

    if (hasElevation) {
      // eslint-disable-next-line no-use-before-define
      elevation = await getElevation(newMarker.latitude, newMarker.longitude);
    }

    if (setters.map) {
      dispatch(setters.map((cmap) => (
        {
          ...cmap,
          address: addr(),
          lat: newMarker.latitude,
          lon: newMarker.longitude,
          elevation,
        }
      )));
    }
  }; // updateLocation

  if (searchBox && autoFocus) {
    searchBox.focus();
  }

  useEffect(() => {
    const handleClick = (event) => {
      const target = event.currentTarget;
      const rect = target.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      if (rect.width - clickX <= 20) {
        dispatch(setters.map((cmap) => (
          {
            ...cmap,
            lat: 0,
            lon: 0,
            area: 0,
            address: {
              fullAddress: '',
              city: '',
              county: '',
              state: '',
              stateCode: '',
              zipCode: '',
            },
            features: [],
          }
        )));
      }
    };

    const handleMousemove = (event) => {
      const target = event.currentTarget;
      const rect = target.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      target.classList.toggle('clearHovered', rect.width - clickX <= 20);
    };

    const geocoderContainer = document.querySelector('.mapboxgl-ctrl-geocoder');
    geocoderContainer?.addEventListener('click', handleClick);
    geocoderContainer?.addEventListener('mousemove', handleMousemove);

    return () => {
      geocoderContainer?.removeEventListener('click', handleClick);
      geocoderContainer?.removeEventListener('mousemove', handleMousemove);
    };
  }, [map.current]);

  useEffect(() => {
    setMarker({
      longitude: initLon,
      latitude: initLat,
    });
  }, [initLon, initLat]);

  const loadShape = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async () => {
      const arrayBuffer = reader.result;
      const layers = [];
      shapefile.open(arrayBuffer)
        .then((source) => {
          source.read()
            .then(function log(result) {
              if (result.done) return;
              layers.push(result.value);

              // eslint-disable-next-line consistent-return
              return source.read().then(log);
            })
            .catch((error) => console.error(error))
            .finally(() => {
              console.log('Finished processing the shapefile.');
              console.log(layers);
              if (layers[0].geometry.type === 'Point') {
                const sumLon = layers.reduce((acc, curr) => acc + curr.geometry.coordinates[0], 0);
                const avgLon = sumLon / layers.length;

                const sumLat = layers.reduce((acc, curr) => acc + curr.geometry.coordinates[1], 0);
                const avgLat = sumLat / layers.length;

                if (setters.map) {
                  dispatch(setters.map((cmap) => (
                    {
                      ...cmap,
                      lat: avgLat,
                      lon: avgLon,
                      features: layers,
                    }
                  )));
                }

                return;
              }

              let minLon = Infinity;
              let maxLon = -Infinity;
              let minLat = Infinity;
              let maxLat = -Infinity;

              layers.forEach((l) => {
                minLon = Math.min(minLon, ...l.geometry.coordinates[0].map((c) => c[0]));
                maxLon = Math.max(maxLon, ...l.geometry.coordinates[0].map((c) => c[0]));
                minLat = Math.min(minLat, ...l.geometry.coordinates[0].map((c) => c[1]));
                maxLat = Math.max(maxLat, ...l.geometry.coordinates[0].map((c) => c[1]));
              });

              // console.log({
              //   sumLon,
              //   sumLat,
              //   total,
              //   minLon,
              //   maxLon,
              //   minLat,
              //   maxLat,
              // });

              const bounds2 = [
                [minLon, minLat],
                [maxLon, maxLat],
              ];

              map.current.fitBounds(bounds2, {
                duration: 0,
                padding: boundsPadding,
              });

              const avgLat = (minLat + maxLat) / 2;
              const avgLon = (minLon + maxLon) / 2;

              geocodeReverse({
                apiKey: MAPBOX_TOKEN,
                setterFunc: (address) => {
                  document.querySelector('.mapboxgl-ctrl-geocoder--input').placeholder = address().fullAddress;

                  updateLocation(address, {
                    longitude: avgLon,
                    latitude: avgLat,
                  });

                  mapContainer.current.scrollIntoView();

                  let totalArea = 0;
                  layers.forEach((feature) => {
                    totalArea += area(feature) / acreDiv;
                  });

                  if (setters.map) {
                    dispatch(setters.map((cmap) => (
                      {
                        ...cmap,
                        lat: avgLat,
                        lon: avgLon,
                        features: layers,
                        bounds: bounds2,
                        address: address(),
                        area: totalArea.toFixed(2),
                      }
                    )));
                  }
                },
                longitude: avgLon,
                latitude: avgLat,
              });
            });
        })
        .catch((error) => {
          alert(`Could not process file:\n${error}`);
          console.log(error);
        });
    };

    reader.readAsArrayBuffer(file);
  };

  /// / GEOCODER CONTROL
  const Geocoder = new MapboxGeocoder({
    placeholder: (initAddress || 'Search for your address ...'),
    localGeocoder: coordinatesGeocoder,
    marker: false,
    accessToken: MAPBOX_TOKEN,
    container: map.current,
    proximity: 'ip',
    trackProximity: true,
    countries: 'us',
  });
  geocoderRef.current = Geocoder;

  // handle empty initFeature
  // useEffect(() => { // !!!
  //   if (hasDrawing && drawerRef.current && initFeatures.length) {
  //     if (Array.isArray(initFeatures[0])) {
  //       initFeatures.forEach((features) => {
  //         drawerRef.current.add({
  //           type: 'FeatureCollection',
  //           features,
  //         });
  //       });
  //     } else {
  //       drawerRef.current.add({
  //         type: 'FeatureCollection',
  //         features: initFeatures,
  //       });
  //     }
  //   }
  // }, [initFeatures]);

  // delete all shapes after geocode search
  useEffect(() => {
    if (geocodeResult && hasDrawing && drawerRef.current) {
      drawerRef.current.deleteAll();
      setPolygonArea(0);
      if (setters.map) {
        dispatch(setters.map((cmap) => (
          {
            ...cmap,
            features: [],
            area: 0,
          }
        )));
      }
    }
  }, [geocodeResult]);

  // upon marker move, find the address of this new location and set the state
  useEffect(() => {
    geocodeReverse({
      apiKey: MAPBOX_TOKEN,
      setterFunc: (address) => {
        const sb = map.current?.getContainer().querySelector('.mapboxgl-ctrl-geocoder--input');
        if (sb) {
          sb.placeholder = address().fullAddress;
        }

        updateLocation(address, marker);
      },
      longitude: marker.longitude,
      latitude: marker.latitude,
    });

    if (markerRef.current) {
      const lngLat = [marker.longitude, marker.latitude];
      markerRef.current.setLngLat(lngLat).setPopup(popupRef.current);
      map.current.setCenter(lngLat);
    }
  }, [marker.longitude, marker.latitude]);

  useEffect(() => {
    if (
      drawerRef.current
      && initFeatures?.length
    ) {
      try {
        drawerRef.current.deleteAll();
      } catch (ee) { /* empty */ }

      if (Array.isArray(initFeatures[0])) {
        initFeatures.forEach((features) => {
          drawerRef.current.add({
            type: 'FeatureCollection',
            features,
          });
        });
      } else {
        drawerRef.current.add({
          type: 'FeatureCollection',
          features: initFeatures,
        });
      }
    }
  }, [initFeatures, drawerRef.current]);

  useEffect(() => {
    if (bounds && map.current) {
      map.current.fitBounds(bounds, {
        duration: 0,
        padding: boundsPadding,
      });
    }
  }, [bounds]);

  useEffect(() => {
    /// / MAP CREATE
    if (map.current) return; // initialize map only once
    const Map = new mapboxgl.Map({
      container: mapContainer.current,
      style: layer,
      center: [initLon, initLat],
      zoom: initStartZoom || 12,
    });
    map.current = Map;

    const Popup = new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(`
      <div style="background: #eee; text-align: center">Click to drag</div>
      ${marker.longitude.toFixed(4)}  ${marker.latitude.toFixed(4)}
    `);
    popupRef.current = Popup;

    /// / MARKER CONTROL
    const Marker = new mapboxgl.Marker({
      draggable: hasMarkerMovable,
      color: '#e63946',
      scale: 1,
      ...markerOptions,
    })
      .setLngLat([marker.longitude, marker.latitude]);

    markerRef.current = Marker;

    Marker.className = styles.marker;

    let isDragging = false;

    if (hasMarkerMovable) {
      Marker.setPopup(Popup);

      // show Popup on hover
      Marker.getElement().addEventListener('mouseenter', () => {
        if (!isDragging) {
          Marker.togglePopup();
        }
      });

      // hide Popup when not hovering over marker
      Marker.getElement().addEventListener('mouseleave', () => {
        if (!isDragging) {
          Marker.togglePopup();
        }
      });

      // update Popup content while marker is being dragged
      Marker.on('drag', () => {
        Marker.getPopup().setHTML(`
          <div style="background: #eee; text-align: center">Click to drag</div>
          ${Marker.getLngLat().lng.toFixed(4)}  ${Marker.getLngLat().lat.toFixed(4)}
        `);
      });

      Marker.on('dragstart', () => { isDragging = true; });
      Marker.on('dragend', () => { isDragging = false; });
    }

    const simpleSelect = MapboxDraw.modes.simple_select;
    const directSelect = MapboxDraw.modes.direct_select;

    simpleSelect.dragMove = () => {};
    directSelect.dragFeature = () => {};

    // DRAWER CONTROL
    const Draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: { polygon: true, trash: true },
      modes: {
        ...MapboxDraw.modes,
        simple_select: simpleSelect,
        direct_select: directSelect,
      },
    });
    drawerRef.current = Draw;

    /// / GEOLOCATE CONTROL
    const Geolocate = new mapboxgl.GeolocateControl({ container: map.current });

    /// / NAVIGATION CONTROL
    const Navigation = new mapboxgl.NavigationControl({
      container: map.current,
    });

    /// / FULLSCREEN CONTROL
    const Fullscreen = new mapboxgl.FullscreenControl();

    /// / ADD CONTROLS
    if (hasFullScreen) map.current.addControl(Fullscreen, 'top-right');
    if (hasNavigation) map.current.addControl(Navigation, 'top-right'); // causes warning
    if (hasGeolocate) map.current.addControl(Geolocate, 'top-right');
    if (hasDrawing) map.current.addControl(Draw, 'top-right');
    if (hasSearchBar) map.current.addControl(Geocoder, 'top-left');
    if (hasMarker && !isDrawActive) Marker.addTo(map.current);

    /// / FUNCTIONS
    function onDragEnd(e) {
      const lngLat = e.target.getLngLat();
      // map.current.flyTo({
      //   center: lngLat,
      // });
      setMarker((prev) => ({
        ...prev,
        longitude: lngLat.lng,
        latitude: lngLat.lat,
      }));
    }

    const handleGeolocate = (e) => {
      const lngLat = e.target._userLocationDotMarker._lngLat;

      setMarker((prev) => ({
        ...prev,
        longitude: lngLat.lng,
        latitude: lngLat.lat,
      }));

      // clear all shapes after geolocating to user's location
      if (hasDrawing && drawerRef.current) {
        drawerRef.current.deleteAll();
        setPolygonArea(0);
        if (setters.map) {
          dispatch(setters.map((cmap) => (
            {
              ...cmap,
              features: [],
              area: 0,
            }
          )));
        }
      }
    };

    const handleDrawCreate = (geom) => {
      if (geom.features.length > 0) {
        const coords = centroid(geom.features[0]).geometry.coordinates;

        setMarker((prev) => ({
          ...prev,
          longitude: coords[0],
          latitude: coords[1],
        }));
      }

      updateFeatures();

      newPolygon = true;
      setTimeout(() => {
        newPolygon = false;
      }, 100);
    };

    const handleDrawDelete = () => {
      setIsDrawActive(false);
      updateFeatures();

      document.querySelector('.mapbox-gl-draw_trash').style.display = 'none';
    };

    const showHideTrashcan = (e) => {
      const selectedFeatures = e.features;
      const trashButton = document.querySelector('.mapbox-gl-draw_trash');
      if (selectedFeatures.length > 0) {
        trashButton.style.display = 'block';
      } else {
        trashButton.style.display = 'none';
      }
    };

    const handleDrawSelection = (e) => {
      showHideTrashcan(e);
    };

    /// / EVENTS
    Geolocate.on('geolocate', handleGeolocate);

    Geolocate.on('error', (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        alert('Geolocation access denied. Please enable location services.');
      }
    });

    Geocoder.on('result', (e) => {
      if (e && e.result) {
        setGeocodeResult(e.result);
        const fullAddress = e.result.place_name;
        if (fullAddress.includes('Lat') && fullAddress.includes('Lng')) {
          const longitude = e.result.geometry.coordinates[0];
          const latitude = e.result.geometry.coordinates[1];
          geocodeReverse({
            apiKey: MAPBOX_TOKEN,
            setterFunc: (address) => {
              document.querySelector('.mapboxgl-ctrl-geocoder--input').placeholder = address().fullAddress;
              updateLocation(address, { longitude, latitude });
            },
            longitude,
            latitude,
          });
        }

        if (fullAddress) {
          setMarker((prev) => ({
            ...prev,
            longitude: e.result.center[0],
            latitude: e.result.center[1],
          }));
        }
      }
    });

    if (hasMarkerMovable) {
      map.current.on('dblclick', (e) => {
        if (newPolygon) return;
        setMarker((prev) => ({
          ...prev,
          longitude: e.lngLat.lng,
          latitude: e.lngLat.lat,
        }));
        e.preventDefault(); // doubleClickZoom.disable() doesn't seem to work
      });
    }

    map.current.on('mousemove', (e) => {
      const lnglat = e.lngLat.wrap();
      setCursorLoc({
        longitude: lnglat.lng.toFixed(4),
        latitude: lnglat.lat.toFixed(4),
      });
    });

    map.current.on('load', () => {
      const mc = mapContainer.current;
      if (!mc) return;
      setSearchBox(mc.querySelector('.mapboxgl-ctrl-geocoder--input'));

      if (bounds && map.current) {
        map.current.fitBounds(bounds, {
          duration: 0,
          padding: boundsPadding,
        });
      }

      if (hasFreehand) {
        mc.querySelector('.mapboxgl-ctrl-group:last-of-type button:first-of-type')
          ?.insertAdjacentHTML(
            'afterend',
            `
              <button
                id="freehand"
                style="margin-top: 1px solid #ddd;"
                title="Freehand tool"
              >
                <svg id="polygon-tool" class="mapboxgl-ctrl-icon custom-icon" viewBox="0 0 24 24">
                  <path d="M3 10 L8 3 L15 5 L19 12 L12 20 L5 15 Z" stroke="#000" stroke-width="2" fill="none"></path>
                </svg>
              </button>
            `,
          );

        const freehand = mc.querySelector('#freehand');
        freehand?.addEventListener('click', () => {
          freehand.classList.toggle('active');
          if (freehand.classList.contains('active')) {
            if (hasDrawing) {
              document.querySelector('.mapbox-gl-draw_polygon').style.display = 'none';
              Draw.changeMode('draw_polygon');
            }
            map.current.dragPan.disable();
          } else {
            if (hasDrawing) {
              document.querySelector('.mapbox-gl-draw_polygon').style.display = 'block';
              Draw.changeMode('simple_select');
            }
            map.current.dragPan.enable();
          }
        });
      }

      if (hasImport) {
        mc.querySelector('.mapboxgl-ctrl-group:last-of-type button:last-of-type')
          .insertAdjacentHTML(
            'afterend',
            `
              <button
                id="import"
                style="font: bold 8pt arial"
                title="Import a shape file"
              >
                SHP
              </button>
              <input
                id="FileUpload"
                type="file"
                accept=".shp"
                style="display: none"
              />
            `,
          );

        const markerEl = mc.querySelector('#import');
        markerEl.addEventListener('click', () => {
          mc.querySelector('#FileUpload').click();
        });

        const upload = mc.querySelector('#FileUpload');
        upload.addEventListener('change', loadShape);
      }

      if (hasHelp) {
        mc.querySelector('.mapboxgl-ctrl-group:last-of-type button:last-of-type')
          .insertAdjacentHTML(
            'afterend',
            `
              <button
                title="Help"
                onclick="document.querySelector('#MapHelp').showModal();"
              >
                ?
              </button>
            `,
          );
      }

      if (!scrollZoom) map.current.scrollZoom.disable();
      if (!dragRotate) map.current.dragRotate.disable();
      if (!dragPan) map.current.dragPan.disable();
      if (!keyboard) map.current.keyboard.disable();
      if (!doubleClickZoom) map.current.doubleClickZoom.disable();
      if (!touchZoomRotate) map.current.touchZoomRotate.disable();

      const lineData = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [],
            },
            properties: {},
          },
        ],
      };

      if (hasFreehand) {
        map.current.addSource('line', {
          type: 'geojson',
          data: lineData,
        });

        map.current.addLayer({
          id: 'line-layer',
          type: 'line',
          source: 'line',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#fff',
            'line-width': 3,
          },
        });

        map.current.on('mousedown', (e) => {
          const lnglat = e.lngLat.wrap();
          if (inFreehand()) {
            lineData.features[0].geometry.coordinates.push([lnglat.lng, lnglat.lat]);

            fpolygon = [[lnglat.lng, lnglat.lat]];
          }
        });

        map.current.on('mousemove', (e) => {
          const lnglat = e.lngLat.wrap();
          if (inFreehand() && fpolygon[0].length) {
            lineData.features[0].geometry.coordinates.push([lnglat.lng, lnglat.lat]);
            map.current.getSource('line').setData(lineData);
            fpolygon.push([lnglat.lng, lnglat.lat]);
          }
        });

        map.current.on('mouseup', () => {
          const id = `freehand${+(new Date())}`;
          if (inFreehand()) {
            map.current.addPolygon(
              id,
              [fpolygon],
              {
                'fill-color': '#f00',
                'fill-opacity': 0.1,
                'line-width': 1,
                'line-color': '#ddd',
              },
            );

            mc.querySelector('#freehand').classList.toggle('active');

            fpolygon = [[]];
            if (lineData?.features[0]?.geometry?.coordinates?.length > 1) {
              handleDrawCreate(lineData);
            }

            const { layers } = map.current.getStyle();
            layers.forEach((lay) => {
              if (lay.source === id) {
                map.current.removeLayer(lay.id);
              }
            });

            map.current.removeSource(id);

            lineData.features[0].geometry.coordinates = [];
            map.current.getSource('line').setData(lineData);

            if (hasDrawing) {
              document.querySelector('.mapbox-gl-draw_polygon').style.display = 'block';
              Draw.changeMode('simple_select');
            }
          }
        });
      }

      map.current.addPolygon = (id, polygon, options = {}) => {
        if (typeof polygon === 'string') {
          fetch(polygon)
            .then((response) => response.json())
            .then((data) => {
              if (data.length) {
                map.current.addPolygon(id, data[0].polygonarray[0], options);
              } else if (data.polygonarray) { // doesn't work for all hardiness zones !!!
                map.current.addPolygon(id, data.polygonarray[0], options);
              }
            });
          return;
        }

        const lineId = `${id}-line`;

        const polygonStyle = {
          'fill-color': options['fill-color'] ?? '#000',
          'fill-opacity': options['fill-opacity'] ?? 1,
        };

        const lineStyle = {
          'line-color': options['line-color'] ?? '#000',
          'line-opacity': options['line-opacity'] ?? 1,
          'line-width': options['line-width'] ?? 1,
        };

        if (map.current.getLayer(id)) {
          map.current.removeLayer(id);
        }
        if (map.current.getLayer(lineId)) {
          map.current.removeLayer(lineId);
        }

        if (map.current.getSource(id)) {
          map.current.removeSource(id);
        }

        map.current.addSource(id, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: polygon,
            },
          },
        });

        map.current.addLayer({
          id,
          type: 'fill',
          source: id,
          paint: polygonStyle,
        });

        map.current.addLayer({
          id: lineId,
          type: 'line',
          source: id,
          paint: lineStyle,
        });

        map.current.on('mouseenter', id, () => {
          map.current.setPaintProperty(lineId, 'line-width', 2);
          map.current.setPaintProperty(lineId, 'line-color', '#aaa');

          ['fill-color', 'fill-opacity'].forEach((prop) => {
            if (options.hover?.[prop]) {
              map.current.setPaintProperty(id, prop, options.hover[prop]);
            }
          });

          ['line-width', 'line-color', 'line-opacity'].forEach((prop) => {
            if (options.hover?.[prop]) {
              map.current.setPaintProperty(lineId, prop, options.hover[prop]);
            }
          });
        });

        map.current.on('mouseleave', id, () => {
          Object.entries(polygonStyle).forEach(([property, value]) => {
            map.current.setPaintProperty(id, property, value);
          });

          Object.entries(lineStyle).forEach(([property, value]) => {
            map.current.setPaintProperty(lineId, property, value);
          });
        });

        if (options.fitBounds) {
          let overallBounds = null;
          polygon.forEach((p) => {
            const newBounds = p.reduce((bounds1, coord) => (
              bounds1.extend(coord)
            ), new mapboxgl.LngLatBounds(p[0], p[0]));

            if (overallBounds) {
              overallBounds = overallBounds.extend(newBounds);
            } else {
              overallBounds = newBounds;
            }
          });

          map.current.fitBounds(overallBounds, {
            padding: boundsPadding,
            duration: 0,
          });

          map.current.on('resize', () => {
            map.current.fitBounds(overallBounds, {
              padding: boundsPadding,
              duration: 0,
            });
          });
        }
      };

      setMap(map.current);
    });

    map.current.on('draw.create', handleDrawCreate);
    map.current.on('draw.delete', handleDrawDelete);
    map.current.on('draw.selectionchange', handleDrawSelection);

    map.current.on('zoom', (event) => {
      if (!event.originalEvent) return;
      const currentZoom = map.current.getZoom();
      if (setters.map) {
        dispatch(setters.map((cmap) => (
          {
            ...cmap,
            zoom: currentZoom,
          }
        )));
      }
    });

    Marker.on('dragend', onDragEnd);

    if (initFeatures?.[0] && (fitMapToPolygons || fitBounds)) {
      const nbounds = new mapboxgl.LngLatBounds();

      let minLat = Infinity;
      let minLon = Infinity;
      let maxLat = -Infinity;
      let maxLon = -Infinity;

      const arr = initFeatures.forEach ? initFeatures : initFeatures[0];
      arr.forEach(({ geometry }) => {
        const updateMinMax = (lon, lat) => {
          minLon = Math.min(minLon, lon);
          maxLon = Math.max(maxLon, lon);
          minLat = Math.min(minLat, lat);
          maxLat = Math.max(maxLat, lat);
        };

        if (typeof geometry.coordinates[0] === 'number') {
          nbounds.extend(geometry.coordinates[0]);
          const [lon, lat] = geometry.coordinates;
          updateMinMax(lon, lat);
        } else {
          geometry.coordinates.forEach((coordinate) => {
            coordinate.forEach(([lon, lat]) => {
              nbounds.extend([lon, lat]);
              updateMinMax(lon, lat);
            });
          });
        }
      });

      if (fitMapToPolygons) {
        const ratio = ((maxLon - minLon) / (maxLat - minLat));
        const aspectRatio = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);
        if (initHeight || !initWidth) {
          const height = map.current.getContainer().clientHeight;
          const width = height * ratio * aspectRatio;
          map.current.getContainer().style.width = `${width}px`;
          map.current.getContainer().parentNode.style.width = `${width}px`;
        } else {
          const width = map.current.getContainer().clientWidth;
          const height = width / (ratio * aspectRatio);
          map.current.getContainer().style.height = `${height}px`;
          map.current.getContainer().parentNodestyle.height = `${height}px`;
        }
        map.current.resize();
      }

      requestAnimationFrame(() => {
        map.current.fitBounds(nbounds, { padding: boundsPadding, duration: 0 });
      });
    }
  }, [map]);

  const getElevation = async (lat = cursorLoc.latitude, lon = cursorLoc.longitude) => {
    const latLon = `${lat} ${lon}`;
    if (!elevations[latLon] && elevations[latLon] !== '&hellip;') {
      elevations[latLon] = '&hellip;';
      elevations[latLon] = (await (
        await fetch(`https://weather.covercrop-data.org/elevation?lat=${lat}&lon=${lon}`)
      )?.json())?.elevation;
      elevations[latLon] = (elevations[latLon] * 3.281).toFixed(0) || '&hellip;';
    }
    if (elevationRef.current) {
      elevationRef.current.innerHTML = `Elevation: ${elevations[latLon]} feet`;
    }
    return elevations[latLon];
  };

  if (hasElevation) {
    clearTimeout(elevationTimer);
    elevationTimer = setTimeout(getElevation, 100);
    if (elevationRef.current) {
      elevationRef.current.innerHTML = 'Elevation: &hellip;';
    }
  }

  return (
    <div
      className={`mapbox ${styles.wrapper}`}
      style={{ width: initWidth || '100%', height: initHeight || '100%' }}
    >
      { hasHelp ? <Help /> : null }
      <div
        id="map"
        ref={mapContainer}
        className={styles.map}
        style={{ width: initWidth || '100%', height: initHeight || '100%' }}
      />
      {hasCoordBar && cursorLoc.longitude && (
        <div className={styles.infobar}>
          <div>{`Longitude: ${cursorLoc.longitude}`}</div>
          <div>{`Latitude: ${cursorLoc.latitude}`}</div>
          <div ref={elevationRef} />
          {
            +mapArea || +polygonArea
              ? <div>{`Area: ${(+mapArea || +polygonArea).toFixed(2)} acres`}</div>
              : null
          }
        </div>
      )}
    </div>
  );
};

export default ReduxMap;
