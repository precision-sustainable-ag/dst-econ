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
  screen: 'Home',
  previousScreen: 'Home',
  lat: 40.7849,
  lon: -74.8073,
  mapType: 'hybrid',
  mapZoom: 13,
  location: '',
  state: 'New Jersey',
  farm: '',
  labor: '',
  acres: '',
  priorCrop: '',
  otherPriorCrop: '',
  otherCashCrop: '',
  cashCrop: '',
  description: null,
  species: [],
  rates: [],
  prices: [],
  coverCropTotal: 0,
  plantingTotal: 0,
  species3: '',
  species4: '',
  current: '',
  useFertilizer: '',
  fertN: 0,
  fertP: 0,
  fertK: 0,
  $fertN: 0,
  $fertP: 0,
  $fertK: 0,
  fertNAdded: 0,
  fertPAdded: 0,
  fertKAdded: 0,
  $fertApplication: '',
  seedbed: {...shared},
  planting: {...shared},
  termination: {...shared},
  fertility: {...shared},
  shown: {},
};

if (false) {
  initialState.current = 'seedbed';
  initialState.seedbed.q1 = 'Yes';
  initialState.seedbed.q2 = 'No';
  initialState.seedbed.q3 = 'Self';
  initialState.seedbed.q4 = 'Chisel Plow; 15 Ft';
  initialState.seedbed.power = '350 HP Tracked Tractor';
  initialState.species = ['Clover, Crimson', 'Clover, Berseem'];
  initialState.rates = [17, 5];
  initialState.prices = [14, 3.13];
}

for (const key in initialState.seedbed) {
  initialState.shown['seedbed' + key] = initialState.seedbed[key];
}

const sets = {};
const gets = {};

const cf = (obj, parent='') => {
  Object.keys(obj).forEach((key) => {
    const isArray = Array.isArray(obj[key]);
    const isObject = !isArray && obj[key] !== null && typeof obj[key] === 'object';
  
    if (isObject) {
      console.log(obj[key]);
      cf(obj[key], key);
    } else {
      initialState['_changed' + parent + key] = false;
      initialState['_focus'   + parent + key] = false;
    }
  });
} // cf

cf(initialState);
console.log(initialState);

Object.keys(initialState).forEach(key => {
  const isArray = Array.isArray(initialState[key]);
  const isObject = !isArray && initialState[key] !== null && typeof initialState[key] === 'object';

  sets[key] = (state, action) => {
    if (isArray) {
      const value = action.payload.value;
      const index = action.payload.index;

      if (state[key][index] === value ||
          (state[key][index] === undefined && value === '')
         ) {
        return state;
      } else {
        const a = [...state[key]];
        a[index] = value;
        return {
          ...state,
          [key]: a,
          ['_changed' + key]: true
        }
      }
    } else if (isObject) {
      const value = action.payload.value;
      const property = action.payload.property;
      if (state[key][action.payload.key] === value) {
        return state;
      } else {
        const o = {...state[key]};
        o[property] = value;

        return {
          ...state,
          [key]: o,
          ['_changed' + key + property]: true
        }
      }
    } else {
      if (state[key] === action.payload) {
        return state;
      } else {
        return {
          ...state,
          [key]: action.payload,
          ['_changed' + key]: true
        }
      }
    }
  }

  sets.focus = (state, action) => {
    return {
      ...state,
      ['_focus' + action.payload]: true
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
    if (!(key in state.reducer)) {
      console.log('Unknown key: ' + key);
      console.log(JSON.stringify(state.reducer, null, 2));
      alert('Unknown key: ' + key);
    } else {
      return state.reducer[key];
    }
  }
});

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
export const set = slice.actions;
export const get = gets;

const state = (parm) => mystore.getState().reducer[parm];

const current = () => mystore.getState().reducer.current;

export const match = (key, value, context) => {
  if (key === 'q2') {
    // console.log('_'.repeat(40));
    // console.log(mystore.getState().reducer.shown[context + key]);
    // console.log(key, value, context, mystore.getState().reducer[context][key] === value);
    // console.log(!!(mystore.getState().reducer.shown[context + key] && mystore.getState().reducer[context][key] === value));
    // console.log('_'.repeat(40));
  }

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
  price: (species) => (db.seedList[species] || {}).price || '',
  NCredit: (species) => (db.seedList[species] || {}).NCredit || ''
};

export const queue = (f, time=1) => {
  setTimeout(f, queue.i++ * time);
  setTimeout(() => queue.i = 0, 1000);
}
queue.i = 0;

loadData('coefficients');
loadData('seedList');
loadData('costDefaults');
loadData('rates');
loadData('stateRegions');
loadData('herbicides');
loadData('power');
loadData('implements');

setTimeout(() => {
  console.log(db.costDefaults['Custom Fertilizer Appl'].cost);
}, 1000);

export const dollars = (n) => {
  if (!isFinite(n)) {
    return '';
  } else if (+n < 0) {
    return <span style={{color: 'red'}}>(${(-n).toFixed(2)})</span>;
  } else {
    return '$' + (+n).toFixed(2);
  }
}