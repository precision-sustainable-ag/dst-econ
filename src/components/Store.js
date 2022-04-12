import React, { createContext, useReducer } from "react";

const initialState = {
  screen        : 'Home',
  previousScreen: 'Home',  
  help          : '',
  helpX         : 0,
  helpY         : 0,
  mapZoom       : 13,
  mapType       : 'hybrid',
  lat           : 40.7849,
  lon           : -74.8073,
  location      : '',
  state         : '',
  priorCrop : {
    label: ''  // TODO
  },
};

const reducer = (state, action, value = action && action.data && action.data.value) => {
  // alert(action.type);
  switch (action.type) {
    case 'change': {
      if (state[action.e] === value) {
        return state;
      }
      return {
        ...state,
        [action.e]: value
      }
    }

    case 'delete': {
      alert('ok');
      console.log(state);
      console.log(action);
      console.log(value);
      const st = {...state};
      delete st[value];
      return st;
    }

    case 'addkey': {
      if (action.e in state) {
        return state;
      } else {
        return {
          ...state,
          [action.e]: value
        }
      }
    }

    default:
      return state;
  }
} // reducer

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const dollars = (n) => isFinite(n) ? '$' + (+n).toFixed(2) : '';

  const change = (type, e, value = e && e.target.value) => {
    if (value === undefined) {
      dispatch({
        type,
        e,
        data: e
      });
    } else if (typeof value === 'object') {
      dispatch({
        type,
        e,
        data: value
      });
    } else {
      dispatch({
        type,
        e,
        data: {
          value
        }
      });
      // alert(JSON.stringify({type,data: {value}}))
    }
  } // change

  const match = (key, value) => {
    return state['shown' + key] && state[key] === value;
  }

  const data = (parm, round) => {
    const d = db.implements[state[state.current + 4]] || {};

    if (isFinite(round) && d[parm]) {
      return (+d[parm]).toFixed(round);
    } else {
      return d[parm];
    }
  } // data

  const powerUnit = state[state.current + 'Power'] || data('default power unit');

  const power = (parm) => {
    const p = db.power[powerUnit] || {};

    return (p[parm] || '').toString();
  } // power

  return (
    <Context.Provider value={{state, dispatch, change, match, data, powerUnit, power, dollars}}>{children}</Context.Provider>
  );
};

const loadData = async(table) => {
  const alias = (col) => {
    // 'Typical Seeding Rate (lb/ac) [seedingRate]' becomes 'seedingRate'
    return col.includes('[') ? col.split(/[[\]]/)[1] : col;
  }

  db[table] = {};

  let response = await fetch(`https://api.airtable.com/v0/appRBt6oxz1E9v2F4/${table}?api_key=keySO0dHQzGVaSZp2`);
  let rec = await response.json();

  const data = rec.records.map(r => r.fields);

  data.forEach(rec => {
    const cols = Object.keys(rec);
    const obj = db[table][rec.key] = {};
    cols.forEach(col => {
      obj[alias(col)] = rec[col];
    });
  });

  if (/implements|power/.test(table)) {
    Object.keys(db[table]).forEach(key => {
      const c = db[table][key];

      if (!c) {
        alert(`${table} ${key}`);
      }

      try {
        c.RF1 = db.coefficients[c['default ASABE category']].RF1 || 0;
        c.RF2 = db.coefficients[c['default ASABE category']].RF2 || 0;
        c.RV1 = db.coefficients[c['default ASABE category']].RV1 || 0;
        c.RV2 = db.coefficients[c['default ASABE category']].RV2 || 0;
        c.RV3 = db.coefficients[c['default ASABE category']].RV3 || 0;
        c.RV4 = db.coefficients[c['default ASABE category']].RV4 || 0;
        c.RV5 = db.coefficients[c['default ASABE category']].RV5 || 0;
      } catch(ee) {
        // alert(c['default ASABE category']);
      }

      c['tradein%'] = (c.RV1 - c.RV2 * c['expected life (years)'] ** 0.5 - c.RV3 * c['expected use (hr/yr)'] ** 0.5 + c.RV4 * db.rates.projected.value) ** 2 + 0.25 * c.RV5;
      c['listprice'] = c['purchase price 2020'] / (1 - c['list discount']);
      c['tradein$'] = c['tradein%'] * c['listprice'];
      c['annualdepreciation'] = (c['purchase price 2020'] - c['tradein$']) / c['expected life (years)'];
      c['accumulatedrepairs'] = c['listprice'] * (c.RF1 * (c['expected life (years)'] * c['expected use (hr/yr)'] / 1000) ** c.RF2);
      c['annualrepairs'] = c['accumulatedrepairs'] / c['expected life (years)'];

      if (table === 'implements') {
        c['acres/hour'] = c.size1 * c['field speed (m/h)'] * c['field efficiency'] / db.rates.conversion.value;
        c['acres/year'] = c['acres/hour'] * c['expected use (hr/yr)'];
      }
      
      const divisor = table === 'implements' ? c['acres/year'] : c['expected use (hr/yr)'];
      c['Depreciation'] = c['annualdepreciation'] / divisor;
      c['Interest'] = (c['purchase price 2020'] + c['tradein$'] + c['annualdepreciation']) / 2 * db.rates.interest.value / divisor;
      c['Repairs'] = c['annualrepairs'] / divisor;
      c['Taxes'] = (c['purchase price 2020'] + c['tradein$'] + c['annualdepreciation']) / 2 * db.rates.property.value / divisor;
      c['Insurance'] = (c['purchase price 2020'] + c['tradein$'] + c['annualdepreciation']) / 2 * db.rates.insurance.value / divisor;

      if (table === 'implements') {
        c['Labor'] = (c['tractor (hr/impl)'] * c['labor (hr/trac)']) / c['acres/hour'];
      }

      if (table === 'power') {
        c['Fuel'] = +(c['HP'] * c['fuel use (gal/PTO hp/hr)']).toFixed(2);
      }

      c['Storage'] = db.rates.storage.value * c['shed (ft^2)'] / divisor;
      // console.log(key);
      // console.log(c);
    });

    // console.log(db.implements);
    // console.log(db.implements['Boom Sprayer, Self-Propelled; 90 Ft']);

    if (db.power && db.power['130 Self Propelled']) {
      const d = db.power['130 Self Propelled'];
      Object.keys(d).forEach(key => {
        if (Number.isNaN(d[key])) {
          d[key] = 0;
        }
      });
      // console.log(db.power['130 Self Propelled']);
    }
  }
} // loadData

export const Context = createContext(initialState);
export const db = {
  rate : (species) => (db.seedList[species] || {}).seedingRate || '',
  price: (species) => (db.seedList[species] || {}).price || ''
};
export default Store;

loadData('coefficients');
loadData('seedList');
loadData('costDefaults');
loadData('rates');
loadData('stateRegions');
loadData('herbicides');
loadData('power');
loadData('implements');
