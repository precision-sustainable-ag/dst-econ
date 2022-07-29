import './App.css';

import React from 'react';
import {MenuItem, Button} from '@mui/material';
import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {get, set} from './store/store';

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
import {Summary}    from './components/Activity';

function App() {
  const screens = {
    Home,
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
      costDefaults: '',
      herbicides: '',
      implements: '',
      power: '',
      rates: '',
      seedList: '',
      stateRegions: '',
    },
  };

  const Help = () => {
    const help  = useSelector(get.help);
    const helpX = useSelector(get.helpX);
    const helpY = useSelector(get.helpY);
    const style = {
      left: helpX,
      top: helpY,
      maxWidth:  `calc(100vw - ${helpX}px - 20px)`,
      maxHeight: `calc(100vh - ${helpY}px - 20px)`,
      overflow: 'auto'
    }
  
    return (
      help &&
      <div
        className="help"
        style={style}
        dangerouslySetInnerHTML={{ __html: help }}
      />
    )
  } // Help
  
  const MyMenu = (s) => {
    return (
      Object.keys(s).map(scr => {
        if (typeof s[scr] === 'object') {
          return <strong key={scr}>{scr} {MyMenu(s[scr])}</strong>
        } else {
          return <MenuItem data-scr={scr} key={scr} className={scr === screen ? 'selected' : ''}>{s[scr].menu || scr}</MenuItem>
        }
      })
    );
  } // MyMenu

  const Screen = () => {
    switch (screen) {
      case 'Home'         : return <Home />;
      case 'Field'        : return <Field />;
      case 'Species'      : return <Species />;
      case 'Seedbed'      : return <Seedbed />;
      case 'Planting'     : return <Planting />;
      case 'Termination'  : return <Termination />;
      case 'Tillage'      : return <Tillage />;
      case 'Fertility'    : return <Fertility />;
      case 'Herbicide'    : return <Herbicide />;
      case 'Erosion'      : return <Erosion />;
      case 'Additional'   : return <Additional />;
      case 'Yield'        : return <Yield />;
      case 'Practices'    : return <Practices />;
      case 'Revenue'      : return <Revenue />;
      case 'Resources'    : return <Resources/>;
      case 'coefficients' : return <Airtable name={screen} url="https://airtable.com/appRBt6oxz1E9v2F4/tblM7jiyovzfnB3SO/viw24NlxWP5vDLwQA" />;
      case 'costDefaults' : return <Airtable name={screen} url="https://airtable.com/appRBt6oxz1E9v2F4/tblqqN0XghRJZyshW/viwZ9dtPAntKn4Io8" />;
      case 'herbicides'   : return <Airtable name={screen} url="https://airtable.com/appRBt6oxz1E9v2F4/tblsdz6CDpxg3tLpW/viw1tViqJ37IzpNi8" />;
      case 'implements'   : return <Airtable name={screen} url="https://airtable.com/appRBt6oxz1E9v2F4/tblDGJgNgdgUWwt5r/viwap90pHwjxxj2Uf" />;
      case 'power'        : return <Airtable name={screen} url="https://airtable.com/appRBt6oxz1E9v2F4/tblWjL0ezivMdxKas/viwvYL95f0FrpfVh2" />;
      case 'rates'        : return <Airtable name={screen} url="https://airtable.com/appRBt6oxz1E9v2F4/tblUemlQkXAucNgCq/viwXhUamsZ8fN6Q7A" />;
      case 'seedList'     : return <Airtable name={screen} url="https://airtable.com/appRBt6oxz1E9v2F4/tblUtl5VCxuxmTrfa/viwUptVsQiO85bCI4" />;
      case 'stateRegions' : return <Airtable name={screen} url="https://airtable.com/appRBt6oxz1E9v2F4/tbl4udtSpP9rTwuiV/viwUHiJXgFrI2EfMX" />;
      default: 
    }
  } // Screen

  const changeScreen = (e) => {
    const menu = e.target.closest('LI');

    if (menu.tagName === 'LI') {
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

    const s = ['Home','Field','Species','Seedbed','Planting','Termination','Tillage','Fertility','Herbicide','Erosion','Additional','Yield','Practices','Revenue','Resources'];
  
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
      <div className="navigation">
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

  const [hotkeys, setHotKeys] = useState(false);
  // console.log('Render App');

  // Maybe not:
  useEffect(() => {
    if (!hotkeys) {
      const u = document.querySelectorAll('u');
      console.log(u);
      if (u.length) {
        setHotKeys(true);
        const hk = {};
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
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dispatch(set.help(''));
      }
    });
  }, [dispatch]);

  console.log(screen);
  if (screen === 'Loading') {
    return <div className="loading">Loading: {status}</div>;
  } else return (
    <div
      className="App"
      
      onClick={(e) => {
        if (/^help/.test(e.target.innerHTML)) {
          dispatch(set.help(e.target.innerHTML.slice(4)));
          dispatch(set.helpX(Math.min(e.pageX + 20, window.innerWidth - 400)));
          dispatch(set.helpY(e.pageY - 20));
        } else {
          dispatch(set.help(''));
        }
      }}
    >
      <Summary/>
      <nav onClick={changeScreen}>
        {MyMenu(screens)}
      </nav>

      <div id="Main">
        <Help />
        <Screen />
        <Navigation current={screen} />
      </div>
    </div>
  );
}

export default App;
