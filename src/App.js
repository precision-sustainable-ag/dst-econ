// npm i --no-optional

// https://itnext.io/fixing-security-vulnerabilities-in-npm-dependencies-in-less-than-3-mins-a53af735261d
// npm i minimist --save-dev
// "resolutions": {
//   "minimist": "^1.2.5"
// }
// "scripts": {
//   "preinstall": "npx npm-force-resolutions"
// }
// npm i

// TODO: autofocus map
// TODO: Inputs.js for everything
// TODO: Google Maps already loaded outside @googlemaps/js-api-loader.
// TODO: Editable crops/prices
// TODO: https://wlazarus.cfans.umn.edu/william-f-lazarus-farm-machinery-management
// TODO: MACHDATA
// TODO: Plant Data Service:  Disregard, build own

// WAIT: Soil Erosion Control
// WAIT: Additional Considerations

// DONE: material-ui -> mui
// DONE: Don't autofill
// DONE: npm install warnings
// DONE: npm audit warnings
// DONE: Autocomplete height
// DONE: Next to Resources, Back should be Revenue Impact
// DONE: Warning: Cannot update a component (`App`) while rendering a different component (`Screens`).

import React, {useState} from 'react';
import './App.css';
import {MenuItem, Button} from '@mui/material';

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

const App = () => {
/*
  const updateSpeciesTotal = () => {
    let total = 0;
    parms.species.forEach((s, n) => {
      if (s) {
        total += (+parms.rates[n] || 0) * (+parms.prices[n] || 0)
      }
    });
    set.coverCropTotal(total);
  } // updateSpeciesTotal
*/

/*
  const updateCosts = (otype) => {
    const ds = /Chemical/.test(otype) ? otype.match(/[A-Z][a-z]+/)[0] : 4;
    const data = db.implements[parms[type + ds]];

    const costdb = {
      seedbed: 'Seedbed preparation',
      planting: 'Planting'
    }[type];

    const total = parms[type + 3] === 'Self' ? totalRelevantCost(type).toFixed(2) : db.costDefaults[costdb].cost;

    console.log(implementCost('Depreciation'), powerCost('Depreciation'), parms[type + 'Power'], type + 'Power');

    set[type + 'Estimated'](total);
    set[type + 'Total'](total);

    if (type === 'termination') {
      const terminationUnitCost = dbvalue('herbicides', parms.terminationProduct, 'Cost ($)'); // done
      const terminationRate     = dbvalue('herbicides', parms.terminationProduct, 'Rate');     // done

      switch (otype) {
        case 'terminationProduct' :
          set.terminationUnitCost(terminationUnitCost);
          set.terminationUnit    (dbvalue('herbicides', parms.terminationProduct, 'Unit (cost)'));
          set.terminationRate    (terminationRate);
          set.terminationRateUnit(dbvalue('herbicides', parms.terminationProduct, 'Unit (rate)'));
          break;
        case 'terminationUnitCost' :
        case 'terminationRate' :
          set.terminationProductCost((terminationUnitCost * terminationRate).toFixed(2));
          break;
        case 'terminationRoller' :
          set.terminationRollerCost(total);
          break;
        default: ;
      }
    }
  } // updateCosts
*/

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
              setScreen(back);
              setPreviousScreen(back);
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
              setScreen(next);
              if (next !== 'Resources') {
                setPreviousScreen(next);
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
              setScreen('Resources');
            }}
          >
            Resources
          </Button>
        }
      </div>
    )
  } // Navigation
    
  const changeScreen = (e) => {
    const menu = e.target;

    if (menu.tagName === 'LI') {
      const scr = menu.dataset.scr;

      if (scr !== 'Resources') {
        setPreviousScreen(scr);
      }
     
      setScreen(scr);
    }
  } // changeScreen

  const [screen, setScreen] = useState('Home');
  const [previousScreen, setPreviousScreen] = useState('Home');

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

  return (
    <>
      <nav onClick={changeScreen}>
        {MyMenu(screens)}
      </nav>

      <div id="Main" style={{marginLeft: '15em', width: 'calc(100vw - 30em)'}}>
        <Screen/>
        <Navigation current={screen} />
      </div>
    </>
  );
} // App

const originalWarn = console.warn;

console.warn = (s) => {  
  if (!/Google Maps already loaded/.test(s)) { // annoying
    originalWarn(s);
  }
}

document.title = 'Econ DST';

export default App;
