import React from 'react';
import {MenuItem, Button} from '@mui/material';

// Screens
import Home         from './Home';
import FieldAndFarm from './FieldAndFarm';
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

import {Context} from './Store';
import {useContext} from 'react';

const Help = () => {
  const {state} = useContext(Context);

  const style = {
    left: state.helpX,
    top: state.helpY
  }

  return (
    state.help &&
    <div
      className="help"
      style={style}
      dangerouslySetInnerHTML={{ __html: state.help }}
    />
  )
} // Help

const Screens = ({props}) => {
  const {state, change} = useContext(Context);

  const changeScreen = (e) => {
    const menu = e.target;

    if (menu.tagName === 'LI') {
      const scr = menu.dataset.scr;
      if (scr !== 'Resources') {
        change('change', 'previousScreen', scr);
      }
      change('change', 'screen', scr);
    }
    change('change', 'changingScreen', true);
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
    const {state} = useContext(Context);
    return (
      Object.keys(s).map(scr => {
        if (typeof s[scr] === 'object') {
          return <strong key={scr}>{scr} {MyMenu(s[scr])}</strong>
        } else {
          return <MenuItem data-scr={scr} key={scr} className={scr === state.screen ? 'selected' : ''}>{s[scr].menu || scr}</MenuItem>
        }
      })
    )
  } // MyMenu

//  let [changed, setChanged] = React.useState(false);
//
//  useEffect(() => {
//    document.querySelectorAll('.size').forEach(el => {
//      let fs = parseInt(window.getComputedStyle(el, null).getPropertyValue('font-size')) - 1;
//
//      if (el.scrollHeight > el.clientHeight) {
//        el.style.fontSize = fs + 'px';
//        setChanged(!changed);
//      }
//    })
//  });
//
//  const [styleSheet, setStylesheet] = useState('');
//
//  useEffect(() => {
//    fetch(`${state.screen}.txt`)
//      .then(response => response.text())
//      .then(layout => {
//        if (/DOCTYPE/.test(layout)) return;
//
//        let css = '';
//        layout
//          .replace(/^[\n\r]/, '')
//          .split(/[\n\r]|[\r\n]|\r|\n/)
//          .forEach((s, row) => {
//            return
//            /*
//            const m = s.match(/[\w|:]+/g);
//            const top = Math.round(row * 1.4);
//    
//            if (m) {
//              m.forEach((id, i) => {
//                const left = s.indexOf(id) * 0.75 + 13;
//                let other = '';
//                let sp = id.split('|');
//
//                id = sp[0];
//    
//                sp.forEach(s => {
//                  if (/^\d+x\d+$/.test(s)) {
//                    const [width, height] = s.split('x');
//                    other += `
//                      width: ${width}vw;
//                      height: ${height}vh;
//                    `;
//                    return;  // affects elements on other screens even if they have different IDs!!!
//                    document.querySelector(`#${id}`).className = 'size';
//                  } else if (/^bg:/.test(s)) {
//                    other += `
//                      background: ${s.split(':')[1]};
//                    `;
//                  } else if (s === 'center') {
//                    other += `
//                      position: relative;
//                      left: 50%;
//                      transform: translateX(-50%);
//                      text-align: center;
//                    `;
//                  }
//                });
//
//                css += `#${id} {
//                  position: absolute;
//                  left: ${left}vw;
//                  top: ${top}vh;
//                  ${other}
//                }
//                `;
//              });
//            }
//            */
//          });
//    
//        setStylesheet(css);
//        console.log(css);
//      })
//  }, [state.screen]);

  return (
    <div
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          change('change', 'help', '');
        }
      }}

      onClick={(e) => {
        if (/^help/.test(e.target.innerHTML)) {
          change('change', 'help', e.target.innerHTML.slice(4));
          change('change', 'helpX', Math.min(e.pageX + 20, window.innerWidth - 400));
          change('change', 'helpY', e.pageY - 20);
        } else {
          change('change', 'help', '');
        }
      }}

      id="Main"
    >
      { /* <style>{styleSheet}</style> */ }

      <nav onClick={changeScreen}>
        {MyMenu(screens)}
      </nav>
      
      <Help/>

      <div style={{marginLeft: '15em', width: 'calc(100vw - 30em)'}}>
        {find(screens, state.screen)({
          props
        })}
      </div>
    </div>
  )
} // Screens

const Navigation = ({current}) => {
  const {state, change} = useContext(Context);  
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

  if (current === Resources) {
    back = state.previousScreen;
    backDesc = mods[back].menu || back;
  }

  return (
    <div className="navigation">
      {
        back &&
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            change('change', 'screen', back);
            change('change', 'previousScreen', back);
            change('change', 'changingScreen', true);
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
            change('change', 'screen', next);
            change('change', 'changingScreen', true);
            if (next !== 'Resources') {
              change('change', 'previousScreen', next);
            }
          }}
        >
          NEXT: {nextDesc}
        </Button>
      }

      {
        current !== Resources && next !== 'Resources' &&
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            change('change', 'screen', 'Resources');
          }}
        >
          Resources
        </Button>
      }
    </div>
  )
} // Navigation

const screens = {
  Home,
  Modules: {
    FieldAndFarm,
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