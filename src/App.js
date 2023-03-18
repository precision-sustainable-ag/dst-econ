/* eslint-disable jsx-a11y/no-access-key */
/* eslint-disable no-console */
import './App.scss';

import { Button } from '@mui/material';

import React, { useEffect } from 'react';
import {
  Route, Routes, NavLink, useLocation,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { renderToString } from 'react-dom/server';

import { get, set, db } from './store/Store';

import Home from './components/Home';
import Field from './components/Field';
import Species from './components/Species';
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
// import Airtable from './components/Airtables';
import Activity, { Summary } from './components/Activity';

const MyButton = ({ screen, ...otherProps }) => {
  const cashCrop = useSelector(get.cashCrop);

  if (screen === 'Yield' && !db.commodities[cashCrop]?.['one year']) {
    return null;
  }

  return <Button {...otherProps} />;
}; // MyButton

const paths = {
  Field,
  Species,
  Seedbed,
  Planting,
  Termination,
  Tillage,
  Fertility,
  Herbicide,
  Erosion,
  Additional,
  Yield,
  Practices,
  Revenue,
  Resources,
};

const keys = Object.keys(paths);

const Navigation = ({ current }) => {
  const previousScreen = useSelector(get.previousScreen);

  const back = current === 'Resources' ? previousScreen : keys[keys.indexOf(current) - 1];
  const next = keys[keys.indexOf(current) + 1];

  return (
    <div id="Navigation">
      {back && (
        <NavLink
          to={`/${back.replace('Field', '')}`}
        >
          <Button
            variant="contained"
            color="primary"
            tabIndex={-1}
          >
            BACK:
            &nbsp;
            {paths[back].menu}
          </Button>
        </NavLink>
      )}
      {next && (
        <NavLink
          to={`/${next}`}
        >
          <Button
            variant="contained"
            color="primary"
          >
            NEXT:
            &nbsp;
            {paths[next].menu}
          </Button>
        </NavLink>
      )}

      {current !== 'Resources' && next !== 'Resources' && (
        <NavLink
          to="/Resources"
        >
          <Button
            variant="contained"
            color="primary"
          >
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
  const status = useSelector(get.status);
  // const [windowSize, setWindowSize] = useState();

  //  useEffect(() => {
  //    function handleResize() {
  //      setWindowSize({
  //        width: window.innerWidth,
  //        height: window.innerHeight,
  //      });
  //    }
  //
  //    window.addEventListener('resize', handleResize);
  //    handleResize();
  //    return () => window.removeEventListener('resize', handleResize);
  //  }, []);

  useEffect(() => {
    if (screen !== 'Loading') {
      dispatch(set.screen(location.pathname.slice(1) || 'Field'));
    }
  }, [dispatch, location.pathname, screen]);

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

  // const airTables = {
  //   coefficients: 'https://airtable.com/appRBt6oxz1E9v2F4/tblM7jiyovzfnB3SO/viw24NlxWP5vDLwQA',
  //   commodities: 'https://airtable.com/appRBt6oxz1E9v2F4/tblV85ANET2vrlBQr/viwBYOo3wLQFA3eVx',
  //   costDefaults: 'https://airtable.com/appRBt6oxz1E9v2F4/tblqqN0XghRJZyshW/viwZ9dtPAntKn4Io8',
  //   eqip: 'https://airtable.com/appRBt6oxz1E9v2F4/tbl4rC6AccSvzDOnt/viwlh49tBRTiD8MJT',
  //   herbicides: 'https://airtable.com/appRBt6oxz1E9v2F4/tblsdz6CDpxg3tLpW/viw1tViqJ37IzpNi8',
  //   implements: 'https://airtable.com/appRBt6oxz1E9v2F4/tblDGJgNgdgUWwt5r/viwap90pHwjxxj2Uf',
  //   power: 'https://airtable.com/appRBt6oxz1E9v2F4/tblWjL0ezivMdxKas/viwvYL95f0FrpfVh2',
  //   rates: 'https://airtable.com/appRBt6oxz1E9v2F4/tblUemlQkXAucNgCq/viwXhUamsZ8fN6Q7A',
  //   seedList: 'https://airtable.com/appRBt6oxz1E9v2F4/tblUtl5VCxuxmTrfa/viwUptVsQiO85bCI4',
  //   stateRegions: 'https://airtable.com/appRBt6oxz1E9v2F4/tbl4udtSpP9rTwuiV/viwUHiJXgFrI2EfMX',
  // };

  if (screen === 'Loading') {
    return (
      <div className="loading">
        Loading:
        &nbsp;
        {status}
      </div>
    );
  }

  return (
    <div id="Container">
      <nav>
        <div
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '120%',
            marginBottom: '0.25rem',
          }}
        >
          Cover Crop Decision Support Tool
        </div>
        <img alt="logo" src="PSAlogo-text.png" id="PSALogo" />
        <div style={{ marginLeft: 130 }}>
          {
            keys.map((path) => {
              let cname = path === screen ? 'selected' : '';
              if (/Practices|Revenue|Resources/.test(path)) {
                cname += ' summary';
              }
              const accessKey = renderToString(paths[path].menu).match(/<u>.+/)[0][3];
              return (
                <>
                  {path === 'Practices' && <hr />}
                  <NavLink
                    key={path}
                    to={path === 'Field' ? '/' : path}
                    accessKey={accessKey}
                  >
                    <MyButton
                      screen={path}
                      className={cname}
                    >
                      {paths[path].menu}
                    </MyButton>
                  </NavLink>
                </>
              );
            })
          }
        </div>
      </nav>

      <Activity />
      <Summary />

      <div id="Main">
        <Routes>
          <Route path="" element={<Field />} />
          <Route path="Home" element={<Home />} />
          <Route path="Species" element={<Species />} />
          <Route path="Seedbed" element={<Seedbed />} />
          <Route path="Planting" element={<Planting />} />
          <Route path="Termination" element={<Termination />} />
          <Route path="Tillage" element={<Tillage />} />
          <Route path="Fertility" element={<Fertility />} />
          <Route path="Herbicide" element={<Herbicide />} />
          <Route path="Erosion" element={<Erosion />} />
          <Route path="Additional" element={<Additional />} />
          <Route path="Yield" element={<Yield />} />
          <Route path="Practices" element={<Practices />} />
          <Route path="Revenue" element={<Revenue />} />
          <Route path="Resources" element={<Resources />} />
        </Routes>
      </div>

      <Navigation current={screen} />
    </div>
  );
}; // App

document.addEventListener('dblclick', (e) => {
  if (e.ctrlKey) {
    document.body.classList.toggle('debug');
  }
});

export default App;
