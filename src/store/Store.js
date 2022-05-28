import {createAction} from '@reduxjs/toolkit';
import {configureStore, createReducer} from '@reduxjs/toolkit';

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
  annualUseAcres: undefined,
  annualUseHours: undefined,
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

let initialState = {
  focus: null,
  dev: new URLSearchParams(window.location.search).get('dev'),
  test: '',
  test2: {a: {b: {c: 3}}},
  testing: false,
  array1: ['This ', 'is ', 'a ', 'test'],
  array2: {
    a: [4, 3, 2, 1],
  },
  dbcostDefaults: {},
  dbcoefficients: {},
  dbherbicides: {},
  dbimplements  : {},
  dbpower: {},
  dbrates: {},
  dbseedList: {},
  dbstateRegions: {},
  screen: 'Home',
  previousScreen: 'Home',
  lat: 40.7849,
  lon: -74.8073,
  mapType: 'hybrid',
  mapZoom: 13,
  location: '',
  state: 'New Jersey',
  farm: '',
  acres: undefined,
  $labor: undefined,
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
  current: 'seedbed',
  useFertilizer: '',
  fertN: 0,
  fertP: 0,
  fertK: 0,
  $fertN: undefined, // db.rates.Nitrogen.value
  $fertP: 0,
  $fertK: 0,
  $fertCost: 0,
  $fertCredit: 0,
  fertNAdded: 0,
  fertPAdded: 0,
  fertKAdded: 0,
  $fertApplication: undefined, // db.costDefaults['Custom Fertilizer Appl'].cost
  seedbed: {...shared},
  planting: {...shared},
  termination: {...shared},
  fertility: {...shared},
  shown: {
    seedbed: {...shared},
    planting: {...shared},
    termination: {...shared},
    fertility: {...shared},
  },
};

const updateCoverCropTotal = (state) => {
  let total = 0;

  state.species
    .forEach((s, n) => {
      if (s) {
        total += (state.rates[n] || 0) * (state.prices[n] || 0);
      }
    });
  
  state.coverCropTotal = total;
} // updateCoverCropTotal

const fertTotal = (state) => {
  state.$fertCredit = state.fertN * state.$fertN + state.fertP * state.$fertP + state.fertK * state.$fertK;
  console.log(state.fertNAdded);
  console.log(state.$fertN);
  console.log(state.fertPAdded);
  console.log(state.$fertP);
  console.log(state.fertKAdded);
  console.log(state.$fertK);
  console.log(state.$fertApplication);
  state.$fertCost = -(state.fertNAdded * state.$fertN + state.fertPAdded * state.$fertP + state.fertKAdded * state.$fertK) - state.$fertApplication;
  state.fertility.total = state.$fertCredit + state.$fertCost;
} // fertTotal

const other = {
  species: (state, action) => {
    const {index, value} = action.payload;

    state.rates[index] = db.rate(value);
    state.prices[index] = db.price(value);
    updateCoverCropTotal(state);
    state.focus = `rates${index}`;
    if (db.NCredit(value)) {
      state.fertN = db.NCredit(value);
    }
  },
  rates: updateCoverCropTotal,
  prices: updateCoverCropTotal,
  priorCrop: (state, {payload}) => {
    if (payload === 'Other') {
      state.focus = 'otherPriorCrop';
    }
  },
  cashCrop: (state, {payload}) => {
    if (payload === 'Other') {
      state.focus = 'otherCashCrop';
    }
  },
  useFertilizer: (state, {payload}) => {
    if (payload === 'Yes') {
      state.focus = 'fertNAdded';
    } else {
      state.fertNAdded = 0;
      state.fertPAdded = 0;
      state.fertKAdded = 0;
      state.focus = '$fertApplication';
      fertTotal(state);
    }
  },
  fertN: fertTotal,
  fertNAdded: fertTotal,
  fertP: fertTotal,
  fertPAdded: fertTotal,
  $fertP: fertTotal,
  fertK: fertTotal,
  fertKAdded: fertTotal,
  $fertK: fertTotal,
  $fertN: (state, {payload}) => {
    if (payload === undefined) {
      state.$fertN = db.rates.Nitrogen.value;
    }
    fertTotal(state);
  },
  $fertApplication: (state, {payload}) => {
    if (payload === undefined) {
      state.$fertApplication = db.costDefaults['Custom Fertilizer Appl'].cost;
    }
    fertTotal(state);
  },
  'seedbed.q1': (state, {payload}) => {
    if (payload === 'No') {
      state.screen = 'Planting';
    }
  },
  'seedbed.q2': (state, {payload}) => {
    if (payload === 'Yes') {
      state.screen = 'Planting';
    }
  },
  'seedbed.q3': (state, {payload}) => {
    switch (payload) {
      case 'Self':
        state.focus = 'seedbed.q4';
        break;
      case 'Custom Operator':
        state.focus = 'seedbed.total';
        break;
      default:
    }
  },
  'planting.q3': (state, {payload}) => {
    switch (payload) {
      case 'Self':
        state.focus = 'planting.q4';
        break;
      case 'Custom Operator':
        state.focus = 'planting.total';
        break;
      default:
    }
  },
  'seedbed.q4': (state, {payload}) => {
    if (payload) {
      // state.seedbed.power = data('default power unit');  // TODO
      // state.seedbed.total = totalRelevantCost();
      state.seedbed.edited = false;
      state.focus = 'seedbed.power';
    }
  }
};

const sets = {};
const gets = {};

const builders = (builder) => {
  const recurse = (obj, set, get, s = '') => {
    Object.keys(obj).forEach((key) => {
      const isArray = Array.isArray(obj[key]);
      const isObject = !isArray && obj[key] !== null && typeof obj[key] === 'object';
  
      const fullkey = s ? s + '.' + key : key;

      if (key !== 'name') { // TODO: implements
        get[key] = (state) => {
          const sp = s.split('.');
          let st = state;
          while (s && sp[0]) {
            st = st[sp.shift()];
          }

          if (!st) {
            alert('Unknown: ' + fullkey);
          }
          return st[key];
        }
      }

      if (key !== 'name') { // TODO: implements
        set[key] = createAction(fullkey);
        builder
          .addCase(set[key], (state, action) => {
            const sp = s.split('.');
            let st = state;
            while (s && sp.length) {
              st = st[sp.shift()];
            }

            if (isArray && Number.isFinite(action.payload.index)) {
              const {index, value} = action.payload;
              if (st[key][index] !== value) { // TODO: is this check needed?
                st[key][index] = value;
              }
            } else {
              if (st[key] !== action.payload) { // TODO: is this check needed?
                st[key] = action.payload;
                if (fullkey === 'seedbed.annualUseAcres') { // TODO: what causes this?
                  // alert(typeof action.payload);
                }
              }
            }
            if (other[fullkey]) {
              other[fullkey](state, action);
            }
          }
        );
      }

      if (isObject) {
        recurse(obj[key], set[key], get[key], fullkey);
      }
    });
  } // recurse

  recurse(initialState, sets, gets);
} // builders

const mystore = configureStore({
  reducer: createReducer(initialState, builders)
});

export const store = mystore;

export const set = sets;
export const get = gets;

console.log(set);

const state = (parm) => mystore.getState()[parm];

const current = () => mystore.getState().current;

export const match = (key, value, context) => {
  if (context) {
    return !!(mystore.getState().shown[context][key] && mystore.getState()[context][key] === value);
  } else {
    return !!(mystore.getState().shown[key] && mystore.getState()[key] === value);
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

  const c4 = mystore.getState()[current()].q4;

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

  return mystore.getState()[current()].power;
};

export const power = (parm) => {
  const p = db.power[powerUnit()] || {};
  const divisor = state(current()).annualUseHours;
  let value = p[parm];

  switch (parm) {
    case 'Fuel':
      return +(p['HP'] * p['fuel use (gal/PTO hp/hr)']).toFixed(2);  
    case 'Depreciation':
      return p['annualdepreciation'] / divisor;
    case 'Interest':
      return (p['purchase price 2020'] + p['tradein$'] + p['annualdepreciation']) / 2 * db.rates.interest.value / divisor;
    case 'Repairs':
      return p['annualrepairs'] / divisor;
    case 'Taxes':
      return (p['purchase price 2020'] + p['tradein$'] + p['annualdepreciation']) / 2 * db.rates.property.value / divisor;
    case 'Insurance':
      return (p['purchase price 2020'] + p['tradein$'] + p['annualdepreciation']) / 2 * db.rates.insurance.value / divisor;
    case 'Storage':
      return db.rates.storage.value * p['shed (ft^2)'] / divisor;
    default:
      return (value || '').toString();
  }
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

    if (Object.keys(db).length === 11) {
      document.querySelector('html').style.display = 'block';
      document.querySelector('body').style.display = 'block';

      initialState = structuredClone(initialState);

      Object.keys(db).forEach(key1 => {
        Object.keys(db[key1]).forEach(key2 => {
          initialState['db' + key1][key2.replace(/\./g, '')] = db[key1][key2];
        });
      });
      console.log(initialState.dbimplements);

      mystore.replaceReducer(createReducer(initialState, builders));
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

export const dollars = (n) => {
  if (!isFinite(n)) {
    return '';
  } else if (+n < 0) {
    return <span style={{color: 'red'}}>(${(-n).toFixed(2)})</span>;
  } else {
    return '$' + (+n).toFixed(2);
  }
}
