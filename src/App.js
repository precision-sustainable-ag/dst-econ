import './App.css';

import React from 'react';
import {MenuItem, Button} from '@mui/material';

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
import Pests        from './components/Pests';
import Erosion      from './components/Erosion';
import Additional   from './components/Additional';
import Yield        from './components/Yield';
import Practices    from './components/Practices';
import Revenue      from './components/Revenue';
import Resources    from './components/Resources';

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
      Pests,
      Erosion,
      Additional,
      Yield,
    },
    'Economic Impact': {
      Practices,
      Revenue
    },
    Resources
  };

  const MyMenu = (s) => {
    return (
      Object.keys(s).map(scr => {
        if (typeof s[scr] === 'object') {
          return <strong key={scr}>{scr} {MyMenu(s[scr])}</strong>
        } else {
          return <MenuItem data-scr={scr} key={scr} className={scr === screen ? 'selected' : ''}>{s[scr].menu || scr}</MenuItem>
        }
      })
    )
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
      case 'Pests'        : return <Pests />;
      case 'Erosion'      : return <Erosion />;
      case 'Additional'   : return <Additional />;
      case 'Yield'        : return <Yield />;
      case 'Practices'    : return <Practices />;
      case 'Revenue'      : return <Revenue />;
      case 'Resources'    : return <Resources/>;
      default: 
    }
  } // Screen

  const changeScreen = (e) => {
    const menu = e.target;

    if (menu.tagName === 'LI') {
      const scr = menu.dataset.scr;

      if (scr !== 'Resources') {
        dispatch(set.previousScreen(scr));
      }
     
      dispatch(set.screen(scr));
    }
  } // changeScreen

  const Navigation = ({current}) => {
    let back;
    let backDesc;
    let next;
    let nextDesc;
  
    const mods = {Home, ...screens.Modules, ...screens['Economic Impact'], Resources};
    
    const s = ['Home','Field','Species','Seedbed','Planting','Termination','Tillage','Fertility','Herbicide','Pests','Erosion','Additional','Yield','Practices','Revenue','Resources'];
  
    if (current === 'Resources') {
      back = previousScreen;
    } else {
      back = s[s.indexOf(screen) - 1];
      next = s[s.indexOf(screen) + 1];
    }

    if (back) {
      backDesc = mods[back].menu || back;
    }

    if (next) {
      nextDesc = mods[next].menu || next;
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
  const previousScreen = useSelector(get.previousScreen);

  console.log('App');

  return (
    <div className="App">
      <nav onClick={changeScreen}>
        {MyMenu(screens)}
      </nav>

      <div id="Main" style={{marginLeft: '15em', width: 'calc(100vw - 30em)'}}>
        <Screen/>
        <Navigation current={screen} />
      </div>
    </div>
  );
}

const originalWarn = console.warn;

console.zwarn = (s) => {
  if (!/The value provided to Autocomplete is invalid./.test(s)) { // annoying
    originalWarn(s);
  }
}

export default App;
