import React, {useEffect, useState} from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import './App.css';

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

import Button from '@material-ui/core/Button';

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

const Screens = ({parms, setSpecies, setRate, setPrice, sets, db, ps}) => {
  let [screen, setScreen2] = React.useState('Home');
  // let [screen, setScreen2] = React.useState('Species');
  // let [screen, setScreen2] = React.useState('Seedbed');

  const setScreen = (scr) => {
    setScreen2(scr);
  } // setScreen

  const update = (e, id=e.target.id, val=e.target.value) => {
    try {
      if (/googlemap|mui/.test(id)) {
        return;
      }

      if (id === 'T1' && val === 'No') {
        sets.T4('');
      } if (/^include/.test(id)) {
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

      if (id === 'location') {
        setScreen('Planting');  setScreen('Home');  // hack to force rerender. There's got to be a better way.
      } else if (id === 'T1' && val === 'No') {
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
            /*
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
            */
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

const Navigation = ({setScreen, current}) => {
  let last = 'Home';
  let back;
  let backDesc;
  let next;
  let nextDesc;
  let found;

  const mods = {Home, ...screens.Modules, ...screens['Economic Impact'], Resources};

  for (let module in mods) {
    if (found) {
      next = module;
      nextDesc = mods[module].menu || module;
      break;
    } else if (mods[module] === current) {
      if (current !== Home) {
        back = last;
        backDesc = mods[last].menu || last;
      }
      found = true;
    } else {
      last = module;
    }
  };

  return (
    <div className="navigation">
      {
        back &&
        <Button variant="contained" color="primary" onClick={() => setScreen(back) }>BACK: {backDesc} </Button>
      }
      {
        next &&
        <Button variant="contained" color="primary" onClick={() => setScreen(next) }>NEXT: {nextDesc} </Button>
      }
    </div>
  )
} // Navigation

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

export {
  Navigation,
  Screens
}