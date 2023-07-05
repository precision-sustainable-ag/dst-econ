/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/no-access-key */
/* eslint-disable no-console */
import './App.scss';

import {
  Modal, Button, IconButton, Popover,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import React, { useEffect } from 'react';

import {
  Route, Routes, NavLink, useLocation, useNavigate,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { renderToString } from 'react-dom/server';

import {
  dev, get, set, db,
} from './store/Store';

import Home from './components/Home';
import About from './components/About';
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
import Feedback from './components/Feedback';
import AT from './components/AT';
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
  Home,
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
  Feedback,
};

if (dev) {
  paths.AT = AT;
}

const keys = Object.keys(paths);

const Navigation = ({ current }) => {
  const mobile = useSelector(get.mobile);
  const previousScreen = useSelector(get.previousScreen);

  const back = current === 'Resources' ? previousScreen : keys[keys.indexOf(current) - 1];
  const next = keys[keys.indexOf(current) + 1];

  return (
    <div id="Navigation" className="desktop">
      {back && (
        <NavLink to={`/${back.replace('Home', '')}`}>
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
  const mobile = useSelector(get.mobile);
  const navigate = useNavigate();

  const acres = useSelector(get.mapFeatures.area);
  const $labor = useSelector(get.$labor);
  const $diesel = useSelector(get.$diesel);
  const crop = useSelector(get.cashCrop);
  const map = useSelector(get.map);
  const disabled = !map.lat || !acres || !$labor || !$diesel || !crop;

  useEffect(() => {
    if (screen !== 'Loading') {
      dispatch(set.screen(location.pathname.slice(1) || 'Home'));
    }
  }, [dispatch, location.pathname, screen]);

  useEffect(() => {
    if (newScreen !== '') {
      navigate(newScreen);
      dispatch(set.newScreen(''));
    }
  }, [newScreen]);

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

    window.addEventListener('resize', () => {
      dispatch(set.mobile(!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 800));
      console.log(!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 800);
    });
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
        <div className="mobile">
          <h1>
            <img src="PSAlogo-only.png" alt="logo" />
            Cover Crop Economic DST
          </h1>
        </div>

        <div className="desktop">
          <h1>
            <img src="PSAlogo-only.png" alt="logo" />
            Cover Crop Economic Decision Support Tool
            <span className="mobile">Cover Crop Economic DST</span>
          </h1>
        </div>

        <div className="menu-items">
          {keys.filter((path) => !(/Practices|Revenue|Resources|AT|Feedback/.test(path))).map((path) => {
            let cname = path === screen ? 'selected' : '';
            const dis = disabled && !/Home|Field/.test(path);

            if (dis) {
              cname += ' disabled';
            }

            const accessKey = renderToString(paths[path].menu).match(/<u>.+/)[0][3];
            return (
              <NavLink
                key={path}
                to={dis || path === 'Home' ? '/' : path}
                accessKey={accessKey}
                tabIndex={-1}
                onFocus={(e) => e.target.blur()}
              >
                <MyButton
                  screen={path}
                  className={`${cname} ${path}`}
                  tabIndex={-1}
                >
                  {paths[path].menu}
                </MyButton>
              </NavLink>
            );
          })}
        </div>

        <hr />

        <div className="menu-items">
          {keys.filter((path) => (/Practices|Revenue|Resources|AT|Feedback/.test(path))).map((path) => {
            if (mobile && path === 'AT') return null;

            let cname = path === screen ? 'selected summary' : 'summary';
            const dis = disabled && !/Feedback|AT/.test(path);

            if (dis) {
              cname += ' disabled';
            }

            const accessKey = renderToString(paths[path].menu).match(/<u>.+/)[0][3];
            return (
              <NavLink
                key={path}
                to={dis ? '/' : path}
                accessKey={accessKey}
                tabIndex={-1}
                onFocus={(e) => e.target.blur()}
              >
                <MyButton
                  screen={path}
                  className={`${cname} ${path}`}
                  tabIndex={-1}
                >
                  {paths[path].menu}
                </MyButton>
              </NavLink>
            );
          })}
        </div>
      </nav>

      <Summary />

      <div id="Main">
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="About" element={<About />} />
          <Route path="Field" element={<Field />} />
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
          <Route path="Feedback" element={<Feedback />} />
          <Route path="AT" element={<AT />} />
          {Object.keys(airTables).map((key) => (
            <Route path={key} element={<Airtable name={key} url={airTables[key]} />} />
          ))}
        </Routes>
      </div>

      {
        disabled || /Home|About/.test(screen) ? null : <Navigation current={screen} />
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
