/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/no-access-key */
import './App.scss';

import { React, useEffect, useRef } from 'react';

import {
  Route, Routes, NavLink, useLocation, useNavigate,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { renderToString } from 'react-dom/server';

import {
  Modal, Button, IconButton, Popover,
} from '@mui/material';

import { ChevronLeft, ChevronRight, Close as CloseIcon } from '@mui/icons-material';

import PrintIcon from '@mui/icons-material/Print';
import {
  dev, get, set,
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
import Snapshot from './components/Snapshot';

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
  Snapshot,
};

if (dev) {
  paths.AT = AT;
}

const keys = Object.keys(paths);

const Navigation = ({ current }) => {
  const mobile = useSelector(get.mobile);
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
          <NavLink to={`/${next}`}>
            <Button variant="contained" color="primary" className="mobileNext">
              <div>
                NEXT: &nbsp;
                {next.replace('Practices', 'Summary')}
              </div>
            </Button>
          </NavLink>
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

const selectors = {};

const isVisible = (element) => {
  const computedStyle = window.getComputedStyle(element);
  const isHidden = computedStyle.display === 'none' || computedStyle.visibility === 'hidden';

  if (isHidden) {
    return false;
  }

  if (element.parentNode instanceof Element) {
    return isVisible(element.parentNode);
  }

  return true;
};

const normalizeCSS = (tagName, property, value) => {
  const tempElement = document.createElement(tagName);

  tempElement.style[property] = value;
  document.body.appendChild(tempElement);

  const computedValue = getComputedStyle(tempElement)[property];

  document.body.removeChild(tempElement);

  return computedValue;
};

const unneededCSS = () => {
  console.clear();
  console.log('CAREFUL:  Some styles may not apply to elements on this page, but they may on other pages.');
  console.log('___________________________');
  [...document.styleSheets].forEach((styleSheet) => {
    if (styleSheet.cssRules) {
      [...styleSheet.cssRules].forEach((rule) => {
        if (!rule.style) return;

        const selector = rule.selectorText;
        if (/^(\.css)/.test(selector)) {
          return;
        }

        const { cssText } = rule.style;
        const declarationRegex = /([\w-]+)\s*:\s*([^;]+)/g;

        let match = declarationRegex.exec(cssText);

        while (match !== null) {
          const property = match[1].trim();
          const value = match[2].trim();
          document.querySelectorAll(`${selector}`).forEach((obj) => {
            if (/^(\*|html)$|mapbox/.test(selector) || !isVisible(obj)) return;
            const originalValue = normalizeCSS(obj.tagName, property, value);
            const important = rule.style.getPropertyPriority(property) === 'important';

            rule.style.removeProperty(property);
            const newValue = getComputedStyle(obj)[property];
            rule.style.setProperty(property, value.replace(' !important', ''), important ? 'important' : '');

            if (originalValue === newValue) {
              console.log(rule.selectorText, '-', property, '-', value, '-', originalValue, '-', newValue);
            }
          });

          match = declarationRegex.exec(cssText);
        }
      });
    }
  });
};

const unusedCSS = (log = false) => {
  const unused = [];

  if (log) {
    console.clear();
  }

  [...document.styleSheets].forEach((sheet) => {
    try {
      if (sheet.cssRules) {
        [...sheet.cssRules].forEach((rule) => {
          if (rule.constructor.name === 'CSSStyleRule') {
            const selector = rule.selectorText;

            if (/^\.(css|Mui)|mapbox|data-shrink|_infobar/.test(selector)) {
              return;
            }

            const re = /::[-\w]+/g;
            const els = document.querySelectorAll(selector.replace(re, '') || 'EMPTY');
            if (!selectors[selector] && !els.length) {
              unused.push(selector);
            } else {
              selectors[selector] = true;
            }
          }
        });
      }
    } catch (error) {
      console.error('Error accessing stylesheet:', error);
    }
  });

  if (log) {
    console.log('_'.repeat(20));
    unused
      .sort((a, b) => a.replace(/^#/, 'ZZZ').localeCompare(b.replace(/^#/, 'ZZZ')))
      .forEach((s) => console.log(s));
  }
};

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

  const topMenu = useRef(null);
  const moreLeft = useRef(null);
  const moreRight = useRef(null);

  if (dev) {
    unusedCSS();
  }

  const entireReduxState = useSelector((state) => state);

  useEffect(() => {
    let done = false;

    const errorHandler = (err) => {
      if (done) return;
      done = true;

      const requestPayload = {
        repository: 'dst-feedback',
        title: 'CRASH',
        name: 'error',
        email: 'error@error.com',
        comments: `${err?.message} ${JSON.stringify(entireReduxState)}`,
        labels: ['crash', 'dst-econ'],
      };

      fetch('https://feedback.covercrop-data.org/v1/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      })
        .then((response) => response.json())
        .then((body) => {
          console.log(body);
          if (body?.data?.status === 'success') {
            alert(`
              An error occurred.
              We have been notified and will investigate the problem.
            `);
          } else {
            alert('An error occurred');
          }
        })
        .catch((error) => {
          console.log(error);
          alert('Failed to send Feedback to Github.');
        });
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  const scroll = () => {
    if (!topMenu.current) return;

    const { left } = topMenu.current.firstChild.getBoundingClientRect();
    moreLeft.current.disabled = left >= 20;

    const { right } = topMenu.current.lastChild.getBoundingClientRect();
    moreRight.current.disabled = right <= topMenu.current.clientWidth + 35;

    moreLeft.current.classList.toggle('hidden', moreLeft.current.disabled && moreRight.current.disabled);
    moreRight.current.classList.toggle('hidden', moreLeft.current.disabled && moreRight.current.disabled);
  };

  let resizeTimer;
  const resize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 800;
      dispatch(set.mobile(isMobile));
      scroll();
    }, 100);
  };

  useEffect(() => {
    if (screen !== 'Loading') {
      dispatch(set.screen(location.pathname.slice(1) || 'Home'));
    }

    if (topMenu.current) {
      topMenu.current.addEventListener('scroll', scroll);
      scroll();

      return () => {
        topMenu?.current?.removeEventListener('scroll', scroll);
      };
    }
    return () => {};
  }, [dispatch, location.pathname, screen, crop]);

  useEffect(() => {
    if (newScreen !== '') {
      navigate(newScreen);
      dispatch(set.newScreen(''));
    }
  }, [newScreen]);

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
  }, [dispatch]);

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

        <IconButton
          className="moreLeft"
          ref={moreLeft}
          onClick={scrollLeft}
        >
          <ChevronLeft />
        </IconButton>

        <IconButton
          className="moreRight"
          ref={moreRight}
          onClick={scrollRight}
        >
          <ChevronRight />
        </IconButton>

        <div className="menu-items topmenu" ref={topMenu}>

          {keys.filter((path) => !(/Practices|Revenue|Resources|AT|Feedback|Snapshot/.test(path))).map((path) => {
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
                className={`${cname} ${path}`}
              >
                <Button
                  screen={path}
                  tabIndex={-1}
                >
                  {paths[path].menu}
                </Button>
              </NavLink>
            );
          })}
        </div>

        <hr className="horizontalline" />

        <div className="menu-items">
          {keys.filter((path) => (/Practices|Revenue|Resources|AT|Feedback|Snapshot/.test(path))).map((path) => {
            if (mobile && path === 'AT') return null;

            let cname = path === screen ? 'selected summary' : 'summary';
            const dis = path !== 'Resources' && disabled && !/Feedback|AT/.test(path);

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
                className={`${cname} ${path}${path === 'Snapshot' ? ' budgetTable' : ''}`}
              >
                <Button
                  screen={path}
                  tabIndex={-1}
                >
                  {paths[path].menu}
                </Button>
              </NavLink>
            );
          })}

          {/localhost/i.test(window.location) && (
            <>
              <div className="desktop">
                <button
                  type="button"
                  style={{ float: 'right' }}
                  onClick={() => unneededCSS(true)}
                  accessKey="8"
                >
                  Unneeded CSS
                </button>
              </div>

              <div className="desktop">
                <button
                  type="button"
                  style={{ float: 'right' }}
                  onClick={() => unusedCSS(true)}
                  accessKey="9"
                >
                  Unused CSS
                </button>
              </div>
            </>
          )}
        </div>
      </nav>

      <Summary />

      <div id="Main" className="mainComponent">
        <Routes>
          <Route key="home" path="" element={<Home />} />
          <Route key="About" path="About" element={<About />} />
          <Route key="Field" path="Field" element={<Field />} />
          <Route key="Seeds" path="Seeds" element={<Seeds />} />
          <Route key="Seedbed" path="Seedbed" element={<Seedbed />} />
          <Route key="Planting" path="Planting" element={<Planting />} />
          <Route key="Termination" path="Termination" element={<Termination />} />
          <Route key="Tillage" path="Tillage" element={<Tillage />} />
          <Route key="Fertility" path="Fertility" element={<Fertility />} />
          <Route key="Herbicide" path="Herbicide" element={<Herbicide />} />
          <Route key="Erosion" path="Erosion" element={<Erosion />} />
          <Route key="Grazing" path="Grazing" element={<Grazing />} />
          <Route key="Additional" path="Additional" element={<Additional />} />
          <Route key="Yield" path="Yield" element={<Yield />} />
          <Route key="Practices" path="Practices" element={<Practices />} />
          <Route key="Revenue" path="Revenue" element={<Revenue />} />
          <Route key="Resources" path="Resources" element={<Resources />} />
          <Route key="Feedback" path="Feedback" element={<Feedback />} />
          <Route key="AT" path="AT" element={<AT />} />
          <Route key="Snapshot" path="Snapshot" element={<Snapshot />} />
          {Object.keys(airTables).map((key) => (
            <Route key={key} path={key} element={<Airtable name={key} url={airTables[key]} />} />
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

export default App;
