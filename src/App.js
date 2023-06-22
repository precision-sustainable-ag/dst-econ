/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/no-access-key */
/* eslint-disable no-console */
import './App.scss';

import {
  Modal, Button, IconButton, Popover,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import React, { useEffect, useState } from 'react';

import {
  Route, Routes, NavLink, useLocation, useNavigate,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { renderToString } from 'react-dom/server';

import { get, set, db } from './store/Store';

import Field from './components/Field';
import Seeds from './components/Seeds';
import Seedbed from './components/Seedbed';
import Planting from './components/Planting';
import Termination from './components/Termination';
import Tillage from './components/Tillage';
import Fertility from './components/Fertility';
import Herbicide from './components/Herbicide';
import Erosion from './components/Erosion';
import Additional from './components/Additional';
import Yield from './components/Yield';
import Practices from './components/Practices';
import Revenue from './components/Revenue';
import Resources from './components/Resources';
import Grazing from './components/Grazing';
import Airtable from './components/Airtables';
import Data from './components/Data';
import { Summary } from './components/Activity';

const MyModal = () => {
  const modalData = useSelector(get.modalData);
  const anchor = useSelector(get.anchor);
  const dispatch = useDispatch();

  if (!modalData) {
    return null;
  }

  return (
    <Modal
      open
    >
      <Popover
        // id={id}
        open={modalData > ''}
        anchorEl={anchor}
        // onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            dispatch(set.modalData(''));
          }
        }}
      >
        <div
          style={{
            fontSize: 14,
            padding: 10,
            maxWidth: '30rem',
          }}
        >
          <IconButton
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              zIndex: 1,
            }}
            onClick={() => dispatch(set.modalData(''))}
          >
            <CloseIcon
              style={{ fontSize: '1.2rem' }}
            />
          </IconButton>

          {modalData}
        </div>
      </Popover>
    </Modal>
  );
};

const MyButton = ({ screen, ...otherProps }) => {
  const cashCrop = useSelector(get.cashCrop);

  if (screen === 'Yield' && !db.commodities[cashCrop]?.['one year']) {
    return null;
  }

  return <Button {...otherProps} />;
}; // MyButton

const paths = {
  Field,
  Seeds,
  Seedbed,
  Planting,
  Termination,
  Tillage,
  Fertility,
  Herbicide,
  Erosion,
  Grazing,
  Additional,
  Yield,
  Practices,
  Revenue,
  Resources,
};

const keys = Object.keys(paths);

const Navigation = ({ current, mobile }) => {
  const previousScreen = useSelector(get.previousScreen);

  const back = current === 'Resources' ? previousScreen : keys[keys.indexOf(current) - 1];
  const next = keys[keys.indexOf(current) + 1];

  return (
    <div id="Navigation">
      {back && (
        <NavLink to={`/${back.replace('Field', '')}`}>
          <Button variant="contained" color="primary" tabIndex={-1}>
            {!mobile ? (
              <div>
                BACK: &nbsp;
                {paths[back].menu}
              </div>
            ) : (
              <div>BACK</div>
            )}
          </Button>
        </NavLink>
      )}
      {next && (
        <NavLink to={`/${next}`}>
          <Button variant="contained" color="primary">
            {!mobile ? (
              <div>
                NEXT: &nbsp;
                {paths[next].menu}
              </div>
            ) : (
              <div>NEXT</div>
            )}
          </Button>
        </NavLink>
      )}

      {current !== 'Resources' && next !== 'Resources' && (
        <NavLink to="/Resources">
          <Button variant="contained" color="primary">
            Resources
          </Button>
        </NavLink>
      )}
    </div>
  );
}; // Navigation

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const screen = useSelector(get.screen);
  const newScreen = useSelector(get.newScreen);
  const status = useSelector(get.status);
  const navigate = useNavigate();
  const [screenIndex, setScreenIndex] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const screenNums = {
    1: 'Field',
    2: 'Seeds',
    3: 'Seedbed',
    4: 'Planting',
    5: 'Termination',
    6: 'Tillage',
    7: 'Fertility',
    8: 'Herbicide',
    9: 'Erosion',
    10: 'Grazing',
    11: 'Additional',
    12: 'Yield',
    13: 'Practices',
    14: 'Revenue',
    15: 'Resources',
  };

  const acres = useSelector(get.mapFeatures.area);
  const $labor = useSelector(get.$labor);
  const $diesel = useSelector(get.$diesel);
  const crop = useSelector(get.cashCrop);
  const map = useSelector(get.map);
  const disabled = !map.lat || !acres || !$labor || !$diesel || !crop;

  useEffect(() => {
    const num = Object.keys(screenNums).find((key) => screenNums[key] === screen);

    setScreenIndex(num - 1);
  }, [screen]);

  useEffect(() => {
    if (screen !== 'Loading') {
      dispatch(set.screen(location.pathname.slice(1) || 'Field'));
    }
  }, [dispatch, location.pathname, screen]);

  useEffect(() => {
    if (newScreen !== '') {
      navigate(newScreen);
      dispatch(set.newScreen(''));
    }
  }, [newScreen]);

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      if (e.altKey) {
        document.body.classList.add('hotkeys');
      }
    });

    document.addEventListener('keyup', (e) => {
      if (!e.altKey) {
        document.body.classList.remove('hotkeys');
      }
    });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', () => {
      dispatch({ type: 'resize' });
    });

    document.addEventListener('focusin', ({ target }) => {
      if (target.type !== 'checkbox') {
        dispatch(set.focused(target.id)); // TODO
      }
    });

    document.addEventListener(
      'scroll',
      (e) => {
        dispatch(set.scrollTop(e.target.scrollTop));
      },
      true,
    );
  }, [dispatch]);

  const airTables = {
    coefficients: 'https://airtable.com/appRBt6oxz1E9v2F4/tblM7jiyovzfnB3SO/viw24NlxWP5vDLwQA',
    commodities: 'https://airtable.com/appRBt6oxz1E9v2F4/tblV85ANET2vrlBQr/viwBYOo3wLQFA3eVx',
    costDefaults: 'https://airtable.com/appRBt6oxz1E9v2F4/tblqqN0XghRJZyshW/viwZ9dtPAntKn4Io8',
    eqip: 'https://airtable.com/appRBt6oxz1E9v2F4/tbl4rC6AccSvzDOnt/viwlh49tBRTiD8MJT',
    erosionControl: 'https://airtable.com/appRBt6oxz1E9v2F4/tblGfscMlYBSRVhxO/viwfYSFEF4dTfrxE0',
    herbicides: 'https://airtable.com/appRBt6oxz1E9v2F4/tblsdz6CDpxg3tLpW/viw1tViqJ37IzpNi8',
    implements: 'https://airtable.com/appRBt6oxz1E9v2F4/tblDGJgNgdgUWwt5r/viwap90pHwjxxj2Uf',
    power: 'https://airtable.com/appRBt6oxz1E9v2F4/tblWjL0ezivMdxKas/viwvYL95f0FrpfVh2',
    rates: 'https://airtable.com/appRBt6oxz1E9v2F4/tblUemlQkXAucNgCq/viwXhUamsZ8fN6Q7A',
    seedList: 'https://airtable.com/appRBt6oxz1E9v2F4/tblUtl5VCxuxmTrfa/viwUptVsQiO85bCI4',
    stateRegions: 'https://airtable.com/appRBt6oxz1E9v2F4/tbl4udtSpP9rTwuiV/viwUHiJXgFrI2EfMX',
  };

  if (screen === 'Loading') {
    return (
      <div className="loading">
        Loading: &nbsp;
        {status}
      </div>
    );
  }

  return (
    <div id="Container">
      <MyModal />

      <nav>
        <div className="mobile-menu">
          <img src="PSAlogo-only.png" className="mobile-logo" alt="mobile-logo" />
          <div>Cover Crop Decision Support Tool</div>
        </div>
        <div
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '120%',
            marginBottom: '0.25rem',
          }}
          className="desktop-title"
        >
          Cover Crop Decision Support Tool
        </div>
        <img alt="logo" src="PSAlogo-text.png" id="PSALogo" />
        <div style={{ marginLeft: 130 }} className="menu-items">
          {keys.map((path) => {
            let cname = path === screen ? 'selected' : '';
            if (/Practices|Revenue|Resources/.test(path)) {
              cname += ' summary';
            }
            if (disabled) {
              cname += ' disabled';
            }

            const accessKey = renderToString(paths[path].menu).match(/<u>.+/)[0][3];
            return (
              <>
                {path === 'Practices' && <hr />}
                <NavLink
                  key={path}
                  to={disabled || path === 'Field' ? '/' : path}
                  accessKey={accessKey}
                  tabIndex={-1}
                  onFocus={(e) => e.target.blur()}
                >
                  <MyButton
                    screen={path}
                    className={cname}
                    tabIndex={-1}
                  >
                    {paths[path].menu}
                  </MyButton>
                </NavLink>
              </>
            );
          })}
        </div>

        <div className="timeline-div">
          <div className="timeline">
            {Object.keys(screenNums).map((num) => (
              <div
                className="timeline-dot"
                style={{
                  backgroundColor: num - 1 <= screenIndex ? 'green' : 'grey',
                }}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      </nav>

      <Summary />

      <div id="Main">
        <Routes>
          <Route path="" element={<Field />} />
          <Route path="Seeds" element={<Seeds />} />
          <Route path="Seedbed" element={<Seedbed />} />
          <Route path="Planting" element={<Planting />} />
          <Route path="Termination" element={<Termination />} />
          <Route path="Tillage" element={<Tillage />} />
          <Route path="Fertility" element={<Fertility />} />
          <Route path="Herbicide" element={<Herbicide />} />
          <Route path="Erosion" element={<Erosion />} />
          <Route path="Grazing" element={<Grazing />} />
          <Route path="Additional" element={<Additional />} />
          <Route path="Yield" element={<Yield />} />
          <Route path="Practices" element={<Practices />} />
          <Route path="Revenue" element={<Revenue />} />
          <Route path="Resources" element={<Resources />} />
          <Route path="Data" element={<Data />} />
          {Object.keys(airTables).map((key) => (
            <Route path={key} element={<Airtable name={key} url={airTables[key]} />} />
          ))}
        </Routes>
      </div>

      {
        disabled ? null : <Navigation current={screen} mobile={windowSize.width <= 1045} />
      }

      <div id="AirTables">
        <select onChange={(e) => navigate(e.target.value)}>
          <option>&nbsp;</option>
          {Object.keys(airTables).map((key) => (
            <option>{key}</option>
          ))}
        </select>
      </div>
    </div>
  );
}; // App

document.addEventListener('dblclick', (e) => {
  if (e.ctrlKey) {
    document.body.classList.toggle('debug');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.altKey && e.key === 'e') {
    // Seeds accesskey
    e.preventDefault();
  }
});

export default App;
