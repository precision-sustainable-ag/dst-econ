import './App.scss';

import React from 'react';
import {Button} from '@mui/material';

import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {get, set, db} from './store/Store';

import Home         from './components/Home';
import Field        from './components/Field';
import Species      from './components/Species';
import Seedbed      from './components/Seedbed';
import Planting     from './components/Planting';
import Termination  from './components/Termination';
import Tillage      from './components/Tillage';
import Fertility    from './components/Fertility';
import Herbicide    from './components/Herbicide';
import Erosion      from './components/Erosion';
import Additional   from './components/Additional';
import Yield        from './components/Yield';
import Practices    from './components/Practices';
import Revenue      from './components/Revenue';
import Resources    from './components/Resources';
import Airtable     from './components/Airtables';
import Activity, {Summary}    from './components/Activity';

import Map from "./shared/Map"

const holdError = console.error;
console.error = (msg, ...subst) => {
  // Draggable: can't get this to work https://stackoverflow.com/a/63603903/3903374

  if (!/Draggable/.test(msg + subst)) {
    holdError(msg, ...subst);
  }
}

const holdWarn = console.warn;
console.warn = (msg, ...subst) => {
  // Deprecation: moment
  // Autocomplete: useless warning, which has an overcomplicated isOptionEqualTo solution
  //               https://github.com/mui/material-ui/issues/29727

  if (!/Deprecation|Autocomplete/.test(msg + subst)) {
    holdWarn(msg, ...subst);
  }
}

const MyButton = (props) => {
  const cashCrop = useSelector(get.cashCrop);

  if (props['data-scr'] === 'Yield' && !db.commodities[cashCrop]?.['one year']) {
    return null;
  } else {
    return (
      <Button {...props}/>
    )
  }
} // MyButton

function App() {
  const screens = {
    // Home,
    Modules: {
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
    },
    'Economic Impact': {
      Practices,
      Revenue
    },
    Resources,
    'Airtables': {
      coefficients: '',
      commodities: '',
      eqip: '',
      costDefaults: '',
      herbicides: '',
      implements: '',
      power: '',
      rates: '',
      seedList: '',
      stateRegions: '',
    },
  };

  const MyMenu = (s) => {
    return (
      Object.keys(s).map(scr => {
        if (scr === 'Airtables') {
          if (!dev) {
            return null;
          } else {
            return (
              <details key={scr}>
                <summary>{scr}</summary>
                {MyMenu(s[scr])}
              </details>
            );
          }
        } else if (typeof s[scr] === 'object') {
          return (
            <span key={scr}>
              <strong>{scr}</strong>
              {MyMenu(s[scr])}
            </span>
          )
        } else {
          return (
            <MyButton
              data-scr={scr}
              key={scr}
              className={scr === screen ? 'selected' : ''}
            >
              {s[scr].menu || scr}
            </MyButton>
          )
        }
      })
    );
  } // MyMenu

  const Screen = () => {
    switch (screen) {
      case 'Home'         : return <React.StrictMode><Home /></React.StrictMode>;
      case 'Field'        : return <Field />;
      case 'Species'      : return <React.StrictMode><Species /></React.StrictMode>;
      case 'Seedbed'      : return <React.StrictMode><Seedbed /></React.StrictMode>;
      case 'Planting'     : return <React.StrictMode><Planting /></React.StrictMode>;
      case 'Termination'  : return <React.StrictMode><Termination /></React.StrictMode>;
      case 'Tillage'      : return <React.StrictMode><Tillage /></React.StrictMode>;
      case 'Fertility'    : return <React.StrictMode><Fertility /></React.StrictMode>;
      case 'Herbicide'    : return <React.StrictMode><Herbicide /></React.StrictMode>;
      case 'Erosion'      : return <React.StrictMode><Erosion /></React.StrictMode>;
      case 'Additional'   : return <React.StrictMode><Additional /></React.StrictMode>;
      case 'Yield'        : return <React.StrictMode><Yield /></React.StrictMode>;
      case 'Practices'    : return <React.StrictMode><Practices /></React.StrictMode>;
      case 'Revenue'      : return <React.StrictMode><Revenue /></React.StrictMode>;
      case 'Resources'    : return <React.StrictMode><Resources/></React.StrictMode>;
      case 'coefficients' : return <React.StrictMode><Airtable name={screen} url="https://airtable.com/appRBt6oxz1E9v2F4/tblM7jiyovzfnB3SO/viw24NlxWP5vDLwQA" /></React.StrictMode>;
      case 'commodities'  : return <React.StrictMode><Airtable name={screen} url="https://airtable.com/appRBt6oxz1E9v2F4/tblV85ANET2vrlBQr/viwBYOo3wLQFA3eVx" /></React.StrictMode>;
      case 'costDefaults' : return <React.StrictMode><Airtable name={screen} url="https://airtable.com/appRBt6oxz1E9v2F4/tblqqN0XghRJZyshW/viwZ9dtPAntKn4Io8" /></React.StrictMode>;
      case 'eqip'         : return <React.StrictMode><Airtable name={screen} url="https://airtable.com/appRBt6oxz1E9v2F4/tbl4rC6AccSvzDOnt/viwlh49tBRTiD8MJT" /></React.StrictMode>;
      case 'herbicides'   : return <React.StrictMode><Airtable name={screen} url="https://airtable.com/appRBt6oxz1E9v2F4/tblsdz6CDpxg3tLpW/viw1tViqJ37IzpNi8" /></React.StrictMode>;
      case 'implements'   : return <React.StrictMode><Airtable name={screen} url="https://airtable.com/appRBt6oxz1E9v2F4/tblDGJgNgdgUWwt5r/viwap90pHwjxxj2Uf" /></React.StrictMode>;
      case 'power'        : return <React.StrictMode><Airtable name={screen} url="https://airtable.com/appRBt6oxz1E9v2F4/tblWjL0ezivMdxKas/viwvYL95f0FrpfVh2" /></React.StrictMode>;
      case 'rates'        : return <React.StrictMode><Airtable name={screen} url="https://airtable.com/appRBt6oxz1E9v2F4/tblUemlQkXAucNgCq/viwXhUamsZ8fN6Q7A" /></React.StrictMode>;
      case 'seedList'     : return <React.StrictMode><Airtable name={screen} url="https://airtable.com/appRBt6oxz1E9v2F4/tblUtl5VCxuxmTrfa/viwUptVsQiO85bCI4" /></React.StrictMode>;
      case 'stateRegions' : return <React.StrictMode><Airtable name={screen} url="https://airtable.com/appRBt6oxz1E9v2F4/tbl4udtSpP9rTwuiV/viwUHiJXgFrI2EfMX" /></React.StrictMode>;
      default: 
    }
  } // Screen

  const changeScreen = (e) => {
    const menu = e.target.closest('button');

    if (menu?.tagName === 'BUTTON') {
      const scr = menu.dataset.scr;

      if (scr !== 'Resources') {
        dispatch(set.previousScreen(scr));
      }

      dispatch(set.screen(scr));
    }
  } // changeScreen

  const getNodeText = node => {
    if (['string', 'number'].includes(typeof node)) return node
    if (node instanceof Array) return node.map(getNodeText).join('')
    if (typeof node === 'object' && node) return getNodeText(node.props.children)
  } // getNodeText

  const Navigation = ({current}) => {
    let back;
    let backDesc;
    let next;
    let nextDesc;
  
    const mods = {Home, ...screens.Modules, ...screens['Economic Impact'], Resources};

    const s = ['Field','Species','Seedbed','Planting','Termination','Tillage','Fertility','Herbicide','Erosion','Additional','Yield','Practices','Revenue','Resources'];
  
    if (current === 'Resources') {
      back = previousScreen;
    } else {
      back = s[s.indexOf(screen) - 1];
      next = s[s.indexOf(screen) + 1];
    }

    if (back) {
      backDesc = getNodeText(mods[back].menu) || back;
    }

    if (next) {
      nextDesc = getNodeText(mods[next].menu) || next;
    }

    return (
      <div id="Navigation">
        {
          back &&
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              dispatch(set.screen(back));
              dispatch(set.previousScreen(back));
            }}
            tabIndex={-1}
          >
            BACK: {backDesc}
          </Button>
        }
        {
          next &&
          <Button
            variant="contained"
            color="primary" 
            onClick={() => {
              dispatch(set.screen(next));
              if (next !== 'Resources') {
                dispatch(set.previousScreen(next));
              }
            }}
          >
            NEXT: {nextDesc}
          </Button>
        }
  
        {
          current !== 'Resources' && next !== 'Resources' &&
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              dispatch(set.screen('Resources'));
            }}
          >
            Resources
          </Button>
        }
      </div>
    )
  } // Navigation

  const dispatch = useDispatch();
  const screen = useSelector(get.screen);
  const status = useSelector(get.status);
  const previousScreen = useSelector(get.previousScreen);
  const dev = useSelector(get.dev);
  const screenWidth = useSelector(get.screenWidth);
  const screenHeight = useSelector(get.screenHeight);
  const showMap = useSelector(get.showMap);
  const maxZoom = useSelector(get.maxZoom);

  const [hotkeys, setHotKeys] = useState(false);
  // console.log('Render App');

  // Maybe not:
  useEffect(() => {
    if (!hotkeys) {
      const u = document.querySelectorAll('u');
      console.log(u);
      if (u.length) {
        setHotKeys(true);
        const hk = {
          y: 'Yield'
        };

        u.forEach(el => {
          if (el.closest('span').parentNode.dataset.scr) {
            hk[el.textContent.toLowerCase()] = el.closest('span').parentNode.dataset.scr;
          }
        });

        document.addEventListener('keydown', e => {
          if (e.altKey) {
            document.body.classList.add('hotkeys');
            const scr = hk[e.key.toLowerCase()];
            if (scr) {
              dispatch(set.screen(scr));
              e.preventDefault();
            }
            if (e.key === 'Alt') {
              e.preventDefault();
            }
          }
        });

        document.addEventListener('keyup', e => {
          if (!e.altKey) {
            document.body.classList.remove('hotkeys');
          }
        });
      }
    }
  }, [dispatch, hotkeys, screen]);

  useEffect(() => {
    window.addEventListener('resize', () => {
      dispatch({type: 'resize'});
    });

    document.addEventListener('focusin', ({target}) => {
      if (target.type !== 'checkbox') {
        dispatch(set.focused(target.id));  // TODO
      }
    });

    document.addEventListener('scroll', (e) => {
      dispatch(set.scrollTop(e.target.scrollTop));
    }, true);
  }, [dispatch]);

  const mapVisible = showMap && screenWidth >= 1200 && screenHeight > 650;

  if (screen === 'Loading') {
    return <div className="loading">Loading: {status}</div>;
  } else return (
    <>
      <div
        id="Container"
      >
        <nav onClick={changeScreen} className="{cl}">
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
          <div id="Menu">
            {MyMenu(screens)}
          </div>
          <img alt="logo" src="PSAlogo-text.png" id="PSALogo"/>
        </nav>

        <div id="Main">
          <Screen />
        </div>
          
        <Navigation current={screen} />
      </div>
      
      <Activity />
      <Summary />
    </>
  );
}

document.addEventListener('dblclick', () => {
  document.body.classList.toggle('debug');
});

export default App;
