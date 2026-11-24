import './App.scss';

import { ChevronLeft, ChevronRight, Close as CloseIcon } from '@mui/icons-material';
import PrintIcon from '@mui/icons-material/Print';
import { Button, IconButton, Modal, Popover } from '@mui/material';
import { useCallback, useEffect, useRef } from 'react';
import { renderToString } from 'react-dom/server';
import { useDispatch, useSelector } from 'react-redux';
import About from './components/About';
import { Summary } from './components/Activity';
import Additional from './components/Additional';

import Airtable from './components/Airtables';
// {
//   Object.keys(airTables).map((key) => (
//     <Route key={key} path={key} element={<Airtable name={key} url={airTables[key]} />} />
//   ));
// }

import AT from './components/AT';
import Erosion from './components/Erosion';
import Feedback from './components/Feedback';
import Fertility from './components/Fertility';
import Field from './components/Field';
import Grazing from './components/Grazing';
import Herbicide from './components/Herbicide';
import Home from './components/Home';
import Planting from './components/Planting';
import Practices from './components/Practices';
import Resources from './components/Resources';
import Revenue from './components/Revenue';
import Seedbed from './components/Seedbed';
import Seeds from './components/Seeds';
import Snapshot from './components/Snapshot';
import Termination from './components/Termination';
import Tillage from './components/Tillage';
import Training from './components/Training';
import Yield from './components/Yield';
import pirschAnalytics from './shared/analytics';
import { dev, errorHandler, get, set } from './store/Store';

let firstTime = true;

const holdWarn = console.warn;
console.warn = (msg, ...subst) => {
  // Deprecation: moment
  // Autocomplete: useless warning, which has an overcomplicated isOptionEqualTo solution (https://github.com/mui/material-ui/issues/29727)

  if (!/Deprecation|Autocomplete|findDOMNode/.test([msg, ...subst])) {
    holdWarn(msg, ...subst);
  }
};

const holdError = console.error;
console.error = (msg, ...subst) => {
  // findDOMNode: MUI

  if (!/findDOMNode/.test([msg, ...subst])) {
    holdError(msg, ...subst);
  }
};

const MyModal = () => {
  const modalData = useSelector(get.modalData);
  const anchor = useSelector(get.anchor);
  const dispatch = useDispatch();

  if (!modalData) {
    return null;
  }

  return (
    <Modal open>
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
            <CloseIcon style={{ fontSize: '1.2rem' }} />
          </IconButton>

          {modalData}
        </div>
      </Popover>
    </Modal>
  );
};

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
  Training,
  Resources,
  Feedback,
  Snapshot,
  About,
  ...(dev ? { AT } : {}),
};

if (dev) {
  paths.AT = AT;
}

const keys = Object.keys(paths);

const Navigation = ({ current }) => {
  const mobile = useSelector(get.mobile);
  const dispatch = useDispatch();
  const previousScreen = useSelector(get.previousScreen);

  const back = current === 'Resources' ? previousScreen : keys[keys.indexOf(current) - 1];
  let next = keys[keys.indexOf(current) + 1];
  if (next === 'AT') {
    next = undefined;
  }

  return (
    <>
      {next && (
        <div id="Navigation" className="mobile">
          <Button variant="contained" color="primary" onClick={() => dispatch(set.screen(next))}>
            NEXT: &nbsp;
            {next?.replace('Practices', 'Summary')}
          </Button>
        </div>
      )}

      <div
        className="navButtons"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#ccc',
        }}
      >
        <div id="Navigation" className="desktop" style={{ marginLeft: 'auto' }}>
          {back && (
            <Button variant="contained" color="primary" onClick={() => dispatch(set.screen(back))}>
              BACK{!mobile && <>: &nbsp;{paths[back].menu}</>}
            </Button>
          )}
          {next && (
            <Button variant="contained" color="primary" onClick={() => dispatch(set.screen(next))}>
              NEXT{!mobile && <>: &nbsp;{paths[next].menu}</>}
            </Button>
          )}

          {current !== 'Resources' && next !== 'Resources' && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => dispatch(set.screen('Resources'))}
            >
              Resources
            </Button>
          )}
        </div>
        <Button
          variant="contained"
          color="success"
          className="printButton"
          onClick={() => {
            window.print();
          }}
          style={{
            width: 'auto',
            marginLeft: 'auto',
            marginRight: '2%',
          }}
          startIcon={<PrintIcon />}
        >
          Print
        </Button>
      </div>
    </>
  );
}; // Navigation

const App = () => {
  const dispatch = useDispatch();
  const screen = useSelector(get.screen);
  const Screen = paths[screen] || Home;

  const newScreen = useSelector(get.newScreen);
  const status = useSelector(get.status);
  const mobile = useSelector(get.mobile);

  const acres = useSelector(get.acres);
  const $labor = useSelector(get.$labor);
  const $diesel = useSelector(get.$diesel);
  const crop = useSelector(get.cashCrop);
  const map = useSelector(get.map);
  const disabled = !map.lat || !acres || !$labor || !$diesel || !crop;

  const topMenu = useRef(null);
  const moreLeft = useRef(null);
  const moreRight = useRef(null);

  const scroll = useCallback(() => {
    if (!topMenu.current) return;

    const { left } = topMenu.current.firstChild.getBoundingClientRect();
    moreLeft.current.disabled = left >= 20;

    const { right } = topMenu.current.lastChild.getBoundingClientRect();
    moreRight.current.disabled = right <= topMenu.current.clientWidth + 35;

    moreLeft.current.classList.toggle(
      'hidden',
      moreLeft.current.disabled && moreRight.current.disabled,
    );
    moreRight.current.classList.toggle(
      'hidden',
      moreLeft.current.disabled && moreRight.current.disabled,
    );
  }, []);

  const resizeTimer = useRef(null);
  const resize = useCallback(() => {
    clearTimeout(resizeTimer.current);
    resizeTimer.current = setTimeout(() => {
      const isMobile =
        /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 800;
      dispatch(set.mobile(isMobile));
      scroll();
    }, 100);
  }, [dispatch, scroll]);

  useEffect(() => {
    const menu = topMenu.current;
    if (!menu) return;

    menu.addEventListener('scroll', scroll);
    scroll();

    return () => {
      menu.removeEventListener('scroll', scroll);
    };
  }, [scroll]);

  useEffect(() => {
    if (screen === 'Loading') return;
    pirschAnalytics('Visited Page', {
      meta: { visited: screen },
    });
  }, [screen]);

  useEffect(() => {
    if (newScreen) {
      dispatch(set.screen(newScreen));
      dispatch(set.newScreen(''));
    }
  }, [newScreen, dispatch]);

  useEffect(() => {
    if (!firstTime) return;

    resize();
    firstTime = false;

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

    window.addEventListener('resize', resize);
  }, [dispatch, resize]);

  const scrollLeft = () => {
    const buttonToScroll = [...topMenu.current.childNodes].reverse().find((button) => {
      const { left } = button.getBoundingClientRect();
      return left < 0;
    });

    if (buttonToScroll) {
      buttonToScroll.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const width = topMenu.current.clientWidth;

    const buttonToScroll = [...topMenu.current.childNodes].find((button) => {
      const { right } = button.getBoundingClientRect();
      return right > width + 40;
    });

    if (buttonToScroll) {
      buttonToScroll.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

      <nav className="topnav">
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
          </h1>
        </div>

        <IconButton className="moreLeft" ref={moreLeft} onClick={scrollLeft}>
          <ChevronLeft />
        </IconButton>

        <IconButton className="moreRight" ref={moreRight} onClick={scrollRight}>
          <ChevronRight />
        </IconButton>

        <div className="menu-items topmenu" ref={topMenu}>
          {keys
            .filter(
              (path) => !/Practices|Revenue|Resources|Training|AT|Feedback|Snapshot/.test(path),
            )
            .map((path) => {
              let cname = path === screen ? 'selected' : '';
              const dis = disabled && !/Home|Field/.test(path);

              if (dis) {
                cname += ' disabled';
              }

              const accessKey = renderToString(paths[path].menu).match(/<u>.+/)[0][3];

              return (
                <Button
                  key={path}
                  accessKey={accessKey}
                  className={`${cname} ${path}`}
                  disabled={dis}
                  onClick={() => dispatch(set.screen(path))}
                >
                  {paths[path].menu}
                </Button>
              );
            })}
        </div>

        <hr className="horizontalline" />

        <div className="menu-items">
          {keys
            .filter((path) =>
              /Practices|Revenue|Resources|Training|AT|Feedback|Snapshot/.test(path),
            )
            .map((path) => {
              if (mobile && path === 'AT') return null;

              let cname = path === screen ? 'selected summary' : 'summary';
              const dis = disabled && !/Resources|Training|Feedback|AT/.test(path);

              if (dis) {
                cname += ' disabled';
              }

              const accessKey = renderToString(paths[path].menu).match(/<u>.+/)[0][3];
              return (
                <Button
                  key={path}
                  accessKey={accessKey}
                  disabled={dis}
                  className={`${cname} ${path}${path === 'Snapshot' ? ' budgetTable' : ''}`}
                  onClick={() => dispatch(set.screen(path))}
                >
                  {paths[path].menu}
                </Button>
              );
            })}
        </div>
      </nav>

      <Summary />

      <div id="Main" className="mainComponent">
        <Screen />
      </div>

      {disabled || /Home|About/.test(screen) ? null : <Navigation current={screen} />}

      <div id="AirTables">
        <select onChange={(e) => dispatch(set.screen(e.target.value))}>
          <option>&nbsp;</option>
          {Object.keys(airTables).map((key) => (
            <option key={key}>{key}</option>
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

window.addEventListener('error', errorHandler);

export default App;
