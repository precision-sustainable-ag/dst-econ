import React, {useEffect, useState} from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import './App.css';

// Tables
import counties           from './counties';
import regions            from './regions';
import seedList           from './seedlist';
import costDefaults       from './costDefaults';
import fertilizerProducts from './fertilizerProducts';
import herbicides         from './herbicides';
import expenseTypes       from './expenseTypes';
import rates              from './rates';
import coefficients       from './coefficients';
import power              from './power';
import stateRegions       from './stateRegions';
import { tillage, planting, cropMaint, harvest} from './implement';

// Screens
import Home         from './Home';
import Species      from './Species';
import Seedbed      from './Seedbed';
import Planting     from './Planting';
import Termination  from './Termination';
import Tillage      from './Tillage';
import Fertility    from './Fertility';
import Herbicide    from './Herbicide';
import Pests        from './Pests';
import Erosion      from './Erosion';
import Additional   from './Additional';
import Yield        from './Yield';
import Practices    from './Practices';
import Revenue      from './Revenue';
import Resources    from './Resources';

const Help = ({parms}) => {
  const style = {
    left: parms.helpX,
    top: parms.helpY
  }

  return (
    parms.help &&
    <div
      className="help"
      style={style}
      dangerouslySetInnerHTML={{ __html: parms.help }}
    />
  )
} // Help

const Screens = ({parms, setSpecies, setRate, setPrice}) => {
  // let [screen, setScreen2] = React.useState('Home');
  // let [screen, setScreen2] = React.useState('Species');
  let [screen, setScreen2] = React.useState('Seedbed');

  const screens = {
    Home,
    Modules: {
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

  const setScreen = (scr) => {
    setScreen2(scr);
  } // setScreen

  const update = (e, id=e.target.id, val=e.target.value) => {
    try {
      if (/googlemap|mui/.test(id)) {
        return;
      }

      if (/^include/.test(id)) {
        sets[id](e.target.checked ? 'true' : 'false');
      } else if (/^species\d/.test(id)) {
        const n = id.match(/\d+/)[0];
        setSpecies(arr => {
          setRate(arr => {
            arr[n] = (db.seedList[val] || {}).seedingRate;
            return [...arr];
          });
          
          setPrice(arr => {
            arr[n] = (db.seedList[val] || {}).price;
            return [...arr];
          });
        
          arr[n] = val;
          return [...arr];
        });
      } else if (/^rates\d/.test(id)) {
        const n = id.match(/\d+/)[0];
        setRate(arr => {
          arr[n] = val.match(/[\d.]+/)[0];
          return [...arr];
        });
      } else if (/^prices\d/.test(id)) {
        const n = id.match(/\d+/)[0];
        setPrice(arr => {
          arr[n] = val.match(/[\d.]+/)[0];
          return [...arr];
        });
      } else {
        sets[id](val);
      }

      if (id === 'T1' && val === 'No') {
        setScreen('Planting');
        return;
      }
  
      console.log(id, val);
    } catch(ee) {
      console.log(e.target.id, ee.message);
    }
  } // update

  const changeScreen = (e) => {
    const menu = e.target;

    if (menu.tagName === 'LI') {
      setScreen(menu.dataset.scr);
    }
  } // changeScreen

  const loadField = (field) => {
    const inputs = JSON.parse(localStorage[field]);
    Object.keys(inputs).forEach(key => {
      try {
        if (/Date/.test(key)) {
          sets[key](new Date(inputs[key]));
        } else {
          sets[key](inputs[key]);
        }
      } catch(e) {
        console.log(key, e.message);
      }
    });
  } // loadField

  const changeField=(e) => {
    loadField(e.target.value);
  } // changeField

  const find = (screens, scr) => {
    let result = screens[scr];

    if (!result) {
      for (let s in screens) {
        if (typeof screens[s] === 'object') {
          result = find(screens[s], scr);
          if (result) {
            break;
          }
        }
      }
    }
    // console.log(result);
    return result;
  } // find

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

  let [changed, setChanged] = React.useState(false);

  useEffect(() => {
    document.querySelectorAll('.size').forEach(el => {
      let fs = parseInt(window.getComputedStyle(el, null).getPropertyValue('font-size')) - 1;

      if (el.scrollHeight > el.clientHeight) {
        el.style.fontSize = fs + 'px';
        setChanged(!changed);
      }
    })
  });

  const [styleSheet, setStylesheet] = useState('');

  useEffect(() => {
    fetch(`${screen}.txt`)
      .then(response => response.text())
      .then(layout => {
        if (/DOCTYPE/.test(layout)) return;

        let css = '';
        layout
          .replace(/^[\n\r]/, '')
          .split(/[\n\r]|[\r\n]|\r|\n/)
          .forEach((s, row) => {
            return
            const m = s.match(/[\w|:]+/g);
            const top = Math.round(row * 1.4);
    
            if (m) {
              m.forEach((id, i) => {
                const left = s.indexOf(id) * 0.75 + 13;
                let other = '';
                let sp = id.split('|');

                id = sp[0];
    
                sp.forEach(s => {
                  if (/^\d+x\d+$/.test(s)) {
                    const [width, height] = s.split('x');
                    other += `
                      width: ${width}vw;
                      height: ${height}vh;
                    `;
                    return;  // affects elements on other screens even if they have different IDs!!!
                    document.querySelector(`#${id}`).className = 'size';
                  } else if (/^bg:/.test(s)) {
                    other += `
                      background: ${s.split(':')[1]};
                    `;
                  } else if (s === 'center') {
                    other += `
                      position: relative;
                      left: 50%;
                      transform: translateX(-50%);
                      text-align: center;
                    `;
                  }
                });

                css += `#${id} {
                  position: absolute;
                  left: ${left}vw;
                  top: ${top}vh;
                  ${other}
                }
                `;
              });
            }
          });
    
        setStylesheet(css);
        console.log(css);
      })
  }, [screen]);

  return (
    <div
      tabIndex="0"

      onChange={update}
      
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          sets.help('');
        }
      }}

      onClick={(e) => {
        if (/^help/.test(e.target.innerHTML)) {
          sets.help(e.target.innerHTML.slice(4));
          sets.helpX(Math.min(e.pageX + 20, window.innerWidth - 400));
          sets.helpY(e.pageY - 20);
        } else {
          sets.help('');
        }
      }}

      id="Main"
    >
      <style>{styleSheet}</style>

      <nav onClick={changeScreen}>
        {MyMenu(screens)}
      </nav>
      
      <Help parms={parms} />

      <div style={{marginLeft: '15em'}}>
        {find(screens, screen)({
          ps: ps,
          sets: sets,
          parms: parms,
          setScreen: setScreen,
          db: db,
          update: update,
        })}
      </div>
    </div>
  )
} // Screens

const App = () => {
  // can't do useState in a loop unless it's in a component, even if that component is unused
  const State = (parm, value) => {
    [parms[parm], sets[parm]] = React.useState(value);
  }

  let setSpecies;
  [parms.species, setSpecies] = useState([]);

  let setRate;
  [parms.rates, setRate] = useState([]);

  let setPrice;
  [parms.prices, setPrice] = useState([]);

  for (const [parm, value] of Object.entries(parms)) {
    if (Array.isArray(value)) {

    } else {
      State(parm, value);
    }
  }

  return (
    <div>
      <Screens parms={parms} setSpecies={setSpecies} setRate={setRate} setPrice={setPrice} />
    </div>
  );
} // App

const countiesTable = (key, data) => {
  const obj = db[key];

  counties.trim().split(/[\n\r]+/).slice(1).forEach(data => {
    data = data.split('\t');
    obj[data[0] + ' ' + data[1]] = {
      county: data[0],
      state: data[1],
      code: data[2]
    }
  });
} // countiesTable

const toTable = (key, data, n = 0) => {
  db[key] = {};
  const obj = db[key];

  data = data.trim().split(/[\n\r]+/).map(d => d.trim().split('\t'));
  const cols = data[0].map(col => alias[key][col] || col);

  data.slice(1).forEach(data => {
    obj[data[n]] = {};

    cols.slice(1).forEach((col, i) => {
      obj[data[n]][col] = data[i + 1];
    })
  });
} // toTable

const alias = {
  'regions': {
    'Cover Crop Region': 'coverCrop',
    'USDA Crop Production Region': 'usda'
  },
  'seedList': {
    'Typical Seeding Rate (lb/ac)': 'seedingRate',
    'Estimated Price ($/lb)': 'price',
    'Legume?': 'legume',
    'N credit': 'NCredit',
    'Erosion benefit': 'erosion'
  },
  'costDefaults': {
    'Defaults': 'defaults',
    '$/acre': 'cost'
  },
  'fertilizerProducts': {
    '$/unit nutrient': 'cost',
  },
  'herbicides': {
    'Rate': 'rate',
    'Unit (rate)': 'unitRate',
    'Cost/unit': 	'cost',
    'Unit (cost)': 'unitCost'
  },
  'expenseTypes': {
    'Cash': 'cash',
    'non-cash': 'nonCash'
  },
  'rates': {
    'Value': 'value'
  },
  'coefficients': {

  },
  'power': {

  },
  'stateRegions': {

  },
  'tillage': {
    ImplName: 'name',
    ImplDescription: 'description'
  },
  'planting': {
    ImplName: 'name',
    ImplDescription: 'description'
  },
  'cropMaint': {
    ImplName: 'name',
    ImplDescription: 'description'
  },
  'harvest': {
    ImplName: 'name',
    ImplDescription: 'description'
  },
}

const db = {
  // counties,
  regions,
  seedList,
  costDefaults,
  fertilizerProducts,
  herbicides,
  expenseTypes,
  rates,
  coefficients,
  power,
  tillage,
  planting,
  cropMaint,
  harvest,
  stateRegions,
}

Object.keys(db).forEach(key => {
  if (/tillage|planting|cropMaint|harvest/.test(key)) {
    toTable(key, db[key], 5);
  } else if (/power/.test(key)) {
    toTable(key, db[key], 2);
    console.log(db.power);
  } else {
    toTable(key, db[key]);
  }
});

// toTable('regions', regions);
// toTable('seedList', seedList);
// toTable('costDefaults', costDefaults);
// toTable('fertilizerProducts', fertilizerProducts);
// toTable('herbicides', herbicides);
// toTable('expenseTypes', expenseTypes);
// toTable('rates', rates);
// toTable('tillage', tillage);


let parms = {
  help                : '',
  helpX               : 0,
  helpY               : 0,
  species             : [],
  rates               : [],
  prices              : [],
  T1                  : 'Yes',  // ''
  T2                  : 'No',
  T3                  : 'Self',
  T4                  : 'Chisel Plow; 15 Ft',     // ''
  T5                  : '',
  T6                  : '',
  T7                  : '',
  P3                  : 'Self',
  P4                  : '',
  P5                  : '',
  P6                  : '',
  P7                  : '',
  lat                 : 40.7849,
  lng                 : -74.8073,
  mapZoom             : 13,
  mapType             : 'hybrid',
  location            : '',
  state               : '',
  USDARegion          : '',
  includeLabor        : 'true',
  includeFuel         : 'true',
  includeDepreciation : 'true',
  includeInterest     : 'true',
  includeRepairs      : 'true',
  includeTaxes        : 'true',
  includeInsurance    : 'true',
  includeStorage      : 'true',
}

const ps = (s) => ({
  id: s,
  value: parms[s],
  checked: parms[s] === 'true'
});

const sets = {};

document.title = 'Econ DST';

const holdError = console.error;
console.error = (msg, ...subst) => {
  if (!/You provided a/.test(msg)) {
    holdError(msg, ...subst)
  }
}
export default App;
