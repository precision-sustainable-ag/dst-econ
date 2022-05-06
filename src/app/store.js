import {configureStore, createSlice} from '@reduxjs/toolkit';

const shared = {
  q1: '',
  q2: '',
  q3: '',
  q4: '',
  power: '',
  method: '',
  product: '',
  customCost: 0,
  unitCost: 0,
  rate: 0,
  productCost: 0,
  chemical: '',
  chemicalCost: 0,
  roller: '',
  rollerCost: 0,
  total: 0,
  edited: false,
  implementCost: true,
  powerCost: true,
  Labor: true,
  Fuel: true,
  Depreciation: true,
  Interest: true,
  Repairs: true,
  Taxes: true,
  Insurance: true,
  Storage: true,
};

const initialState = {
  focus: '',
  changed: {},
  screen: 'Home',
  previousScreen: 'Home',
  lat: 40.7849,
  lon: -74.8073,
  mapType: 'hybrid',
  mapZoom: 13,
  location: '2',
  state: '',
  farm: '',
  labor: '342',
  acres: '423',
  priorCrop: '',
  otherPriorCrop: '',
  otherCashCrop: '',
  cashCrop: '',
  description: null,
  species: ['Crimson Clover', 'Berseem Clover'],
  rates: [3, 5],
  prices: [4, 6],
  coverCropTotal: 0,
  plantingTotal: 0,
  species3: '',
  species4: '',
  current: '',
  seedbed: {...shared},
  planting: {...shared},
  termination: {...shared},
  shown: {},
};

if (true) {
  initialState.current = 'seedbed';
  initialState.seedbed.q1 = 'Yes';
  initialState.seedbed.q2 = 'No';
  initialState.seedbed.q3 = 'Self';
  initialState.seedbed.q4 = 'Chisel Plow; 15 Ft';
  initialState.seedbed.power = '350 HP Tracked Tractor';
}

for (const key in initialState.seedbed) {
  initialState.shown['seedbed' + key] = initialState.seedbed[key];
}

// alert(JSON.stringify(initialState.shown))

const sets = {};
const gets = {};

Object.keys(initialState).forEach(key => {
  const isArray = Array.isArray(initialState[key]);
  const isObject = !isArray && initialState[key] !== null && typeof initialState[key] === 'object';

  sets[key] = (state, action) => {
    const value = action.payload.value;
    if (isArray) {
      const index = action.payload.index;
      if (state[key][index] === value) {
        return state;
      } else {
        const a = [...state[key]];
        a[index] = value;
        return {
          ...state,
          [key]: a,
          changed: {...state.changed, [key]: true}
        }
      }
    } else if (isObject) {
      if (state[key][action.payload.key] === value) {
        return state;
      } else {
        const o = {...state[key]};
        o[action.payload.key] = value;

        return {
          ...state,
          [key]: o,
          changed: {...state.changed, [key]: true}
        }
      }
    } else {
      if (state[key] === action.payload) {
        return state;
      } else {
        return {
          ...state,
          [key]: action.payload,
          changed: {...state.changed, [key]: true}
        }
      }
    }
  }

  if (isArray) {
    sets['remove' + key] = (state, action) => {
      console.log(key);
      console.log(action);
      const a = [...state[key]];
      a.splice(action.payload, 1);
      return {
        ...state,
        [key]: a
      }
    }
  }

  gets[key] = (state) => {
    if (state.reducer[key] === undefined) {
      console.log('Unknown key: ' + key);
      console.log(JSON.stringify(state.reducer, null, 2));
      alert('Unknown key: ' + key);
    } else {
      return state.reducer[key];
    }
  }
});

export const addkey = (key, value) => {
  return (state) => {
    console.log(state);
    console.log(state.new);
    state[key] = value;
    gets[key] = (state) => state.reducer[key];
  }
}

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    ...sets,
  },
});

const mystore = configureStore({
  reducer: {
    reducer: slice.reducer
  },
});

export const store = mystore;

const state = (parm) => mystore.getState().reducer[parm];

const current = () => mystore.getState().reducer.current;

export const match = (key, value, context) => {
  // console.log(key, value, context, mystore.getState().reducer[context][key] === value);
  if (context) {
    return !!(mystore.getState().reducer.shown[context + key] && mystore.getState().reducer[context][key] === value);
  } else {
    return !!(mystore.getState().reducer.shown[key] && mystore.getState().reducer[key] === value);
  }
}

export const implementCost = (desc) => {
  if (!state(current()).implementCost) {
    return 0;
  }

  let result;

  if (data(desc)) {
    result = +data(desc);
  } else {
    result = 0;
  }

  if (desc === 'Labor') {
    result *= db.rates.skilled.value;
  }

  return result;
} // implementCost

export const powerCost = (desc) => {
  if (desc === 'Labor' || !state(current()).powerCost) {
    return 0;
  }

  const acresHour = data('acres/hour', 1); 
  let result = desc === 'Fuel'  ? (power('Fuel') * (1 + +db.rates.lubrication.value)) * db.rates.fuel.value / acresHour :
                                  power(desc) / acresHour;

  return result;
} // powerCost

export const totalCost = (desc) => {
  return (implementCost(desc) || 0) + (powerCost(desc) || 0);
} // totalCost

const relevantCost = (desc) => {
  if (!current()) {
    return 0;
  }

  return state(current())[desc] ? totalCost(desc) : 0;
} // relevantCost

export const totalRelevantCost = () => {
  const result = 
    relevantCost('Labor') +
    relevantCost('Fuel') +
    relevantCost('Depreciation') +
    relevantCost('Interest') + 
    relevantCost('Repairs') + 
    relevantCost('Taxes') + 
    relevantCost('Insurance') + 
    relevantCost('Storage');
  
  return result;
} // totalRelevantCost

export const data = (parm, round) => {
  if (!current()) {
    return '';
  }

  const c4 = mystore.getState().reducer[current()].q4;

  const d = db.implements[c4] || {};

  // console.log(parm, c4, d, d[parm]);

  if (isFinite(round) && d[parm]) {
    return (+d[parm]).toFixed(round);
  } else {
    return d[parm];
  }
} // data

export const powerUnit = () => {
  if (!current()) {
    return '';
  }

  return mystore.getState().reducer[current()].power;
};

export const power = (parm) => {
  const p = db.power[powerUnit()] || {};

  return (p[parm] || '').toString();
} // power

export const set = slice.actions;
export const get = gets;

const loadData = async(table) => {
  const alias = (col) => {
    // 'Typical Seeding Rate (lb/ac) [seedingRate]' becomes 'seedingRate'
    return col.includes('[') ? col.split(/[[\]]/)[1] : col;
  }

  let response = await fetch(`https://api.airtable.com/v0/appRBt6oxz1E9v2F4/${table}?api_key=keySO0dHQzGVaSZp2`);
  let rec = await response.json();

  db[table] = {};

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

    if (Object.keys(db).length === 10) {
      document.querySelector('html').style.display = 'block';
      document.querySelector('body').style.display = 'block';
      console.log('here');
    }
  }
} // loadData

export const db = {
  rate : (species) => (db.seedList[species] || {}).seedingRate || '',
  price: (species) => (db.seedList[species] || {}).price || ''
};

loadData('coefficients');
loadData('seedList');
loadData('costDefaults');
loadData('rates');
loadData('stateRegions');
loadData('herbicides');
loadData('power');
loadData('implements');

export const dollars = (n) => isFinite(n) ? '$' + (+n).toFixed(2) : '';