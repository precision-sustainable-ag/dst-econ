import {createAction} from '@reduxjs/toolkit';
import {configureStore, createReducer} from '@reduxjs/toolkit';

const shared = {
  q1: '',
  q2: '',
  q3: '',
  implement: '',
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
  screen: 'Loading',
  status: '',
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
  $fertN: undefined, // dbrates.Nitrogen.value
  $fertP: 0,
  $fertK: 0,
  $fertCost: 0,
  $fertCredit: 0,
  fertNAdded: 0,
  fertPAdded: 0,
  fertKAdded: 0,
  $fertApplication: undefined, // dbcostDefaults['Custom Fertilizer Appl'].cost
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
  state.$fertCost = -(state.fertNAdded * state.$fertN + state.fertPAdded * state.$fertP + state.fertKAdded * state.$fertK) - state.$fertApplication;
  state.fertility.total = state.$fertCredit + state.$fertCost;
} // fertTotal

const other = {
  species: (state, action) => {
    const {index, value} = action.payload;

    state.rates[index] = (state.dbseedList[value] || {}).seedingRate || '';
    state.prices[index] = (state.dbseedList[value] || {}).price || '';
    updateCoverCropTotal(state);
    state.focus = `rates${index}`;
    const fertN = (state.dbseedList[value] || {}).NCredit || '';
    if (fertN) {
      state.fertN = fertN;
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
  fertN            : fertTotal,
  fertNAdded       : fertTotal,
  fertP            : fertTotal,
  fertPAdded       : fertTotal,
  $fertP           : fertTotal,
  fertK            : fertTotal,
  fertKAdded       : fertTotal,
  $fertK           : fertTotal,
  $fertN           : fertTotal,
  $fertApplication : fertTotal,
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
        state.focus = 'seedbed.implement';
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
        state.focus = 'planting.implement';
        break;
      case 'Custom Operator':
        state.focus = 'planting.total';
        break;
      default:
    }
  },
  'seedbed.implement': (state, {payload}) => {
    if (payload) {
      // state.seedbed.power = implement('default power unit');  // TODO
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
} // match

const cost = (type, parm, round) => {
  const state = mystore.getState();
  const section = state[state.current];
  const o = type === 'implements' ? section.implement : section.power;
  const acresHour = implement('acres/hour', 1);
  let divisor = type === 'implements' ? section.annualUseAcres : section.annualUseHours * acresHour;
  const p = state['db' + type][o] || {};

  const RF1 = (state.dbcoefficients[p['default ASABE category']] || {}).RF1 || 0;
  const RF2 = (state.dbcoefficients[p['default ASABE category']] || {}).RF2 || 0;
  const RV1 = (state.dbcoefficients[p['default ASABE category']] || {}).RV1 || 0;
  const RV2 = (state.dbcoefficients[p['default ASABE category']] || {}).RV2 || 0;
  const RV3 = (state.dbcoefficients[p['default ASABE category']] || {}).RV3 || 0;
  const RV4 = (state.dbcoefficients[p['default ASABE category']] || {}).RV4 || 0;
  const RV5 = (state.dbcoefficients[p['default ASABE category']] || {}).RV5 || 0;
  // console.log({RF1,RF2,RV1,RV2,RV3,RV4,RV5});

  const tradein = (RV1 - RV2 * p['expected life (years)'] ** 0.5 - RV3 * p['expected use (hr/yr)'] ** 0.5 + RV4 * state.dbrates.projected.value) ** 2 + 0.25 * RV5;  
  const listprice = p['purchase price 2020'] / (1 - p['list discount']);
  const $tradein = tradein * listprice;
  const annualdepreciation = (p['purchase price 2020'] - $tradein) / p['expected life (years)'];
  const accumulatedrepairs = listprice * (RF1 * (p['expected life (years)'] * p['expected use (hr/yr)'] / 1000) ** RF2);
  const annualrepairs = accumulatedrepairs / p['expected life (years)'];  
  
  console.log({parm, tradein, listprice, $tradein, annualdepreciation, accumulatedrepairs, annualrepairs});

  let value;

  switch (parm) {
    case 'Fuel':
      value = +((p['HP'] * p['fuel use (gal/PTO hp/hr)']) * (1 + +state.dbrates.lubrication.value)) * state.dbrates.fuel.value / acresHour;
      break;
    case 'Depreciation':
      value = annualdepreciation / divisor;
      break;
    case 'Interest':
      value = (p['purchase price 2020'] + $tradein + annualdepreciation) / 2 * state.dbrates.interest.value / divisor;
      break;
    case 'Repairs':
      value = annualrepairs / divisor;
      break;
    case 'Taxes':
      value = (p['purchase price 2020'] + $tradein + annualdepreciation) / 2 * state.dbrates.property.value / divisor;
      break;
    case 'Insurance':
      value = (p['purchase price 2020'] + $tradein + annualdepreciation) / 2 * state.dbrates.insurance.value / divisor;
      break;
    case 'Storage':
      value = state.dbrates.storage.value * p['shed (ft^2)'] / divisor;
      break;
    case 'Labor':
      value = (p['tractor (hr/impl)'] * p['labor (hr/trac)']) / implement('acres/hour') * state.dbrates.skilled.value;
      break;
    default:
      value = p[parm] || '';
  }

  if (isFinite(round) && value) {
    return (+value).toFixed(round);
  } else {
    return value;
  }
} // cost

export const implementCost = (desc) => {
  if (!state(current()).implementCost) {
    return 0;
  } else {
    return cost('implements', desc);
  }
} // implementCost

export const powerCost = (desc) => {
  if (!state(current()).powerCost) {
    return 0;
  } else {
    return cost('power', desc);
  }
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

export const implement = (parm, round) => {
  const state = mystore.getState();
  const o = state[state.current].implement;
  const p = state.dbimplements[o] || {};
  let value = p[parm] || '';

  if (parm === 'acres/hour') {
    value = p.size1 * p['field speed (m/h)'] * p['field efficiency'] / state.dbrates.conversion.value;
  } else if (parm === 'acres/year') {
    value = implement('acres/hour') * p['expected use (hr/yr)'];
  }

  if (isFinite(round) && value) {
    return (+value).toFixed(round);
  } else {
    return value;
  }
} // implement

export const power = (parm, round) => {
  const state = mystore.getState();
  const o = state[state.current].power;
  const p = state.dbpower[o] || {};
  const value = p[parm] || '';
  if (isFinite(round) && value) {
    return (+value).toFixed(round);
  } else {
    return value;
  }
} // power


const loadData = async(tables) => {
  const alias = (col) => {
    // 'Typical Seeding Rate (lb/ac) [seedingRate]' becomes 'seedingRate'
    return col.includes('[') ? col.split(/[[\]]/)[1] : col;
  }

  const table = tables.shift();

  let response = await fetch(`https://api.airtable.com/v0/appRBt6oxz1E9v2F4/${table}?api_key=keySO0dHQzGVaSZp2`);
  console.log(response);
  let rec = await response.json();

  db[table] = {};

  status += table + ' ';

  const data = rec.records.map(r => r.fields);

  data.forEach(rec => {
    const cols = Object.keys(rec);
    const obj = db[table][rec.key] = {};
    cols.forEach(col => {
      obj[alias(col)] = rec[col];
    });
  });

  mystore.dispatch(set.status(status));

  if (tables.length) {
    loadData(tables);
  } else {
    initialState = structuredClone({
      ...initialState,
      screen: 'Home'
    });

    Object.keys(db).forEach(key1 => {
      Object.keys(db[key1]).forEach(key2 => {
        initialState['db' + key1][key2.replace(/\./g, '')] = db[key1][key2];
      });
    });

    mystore.replaceReducer(createReducer(initialState, builders));
  }
} // loadData

export const db = {};

export const queue = (f, time=1) => {
  setTimeout(f, queue.i++ * time);
  setTimeout(() => queue.i = 0, 1000);
}
queue.i = 0;

let status = '';
loadData(['coefficients', 'rates', 'costDefaults', 'herbicides', 'implements', 'power', 'seedList', 'stateRegions']);

export const dollars = (n) => {
  if (!isFinite(n)) {
    return '';
  } else if (+n < 0) {
    return <span style={{color: 'red'}}>(${(-n).toFixed(2)})</span>;
  } else {
    return '$' + (+n).toFixed(2);
  }
} // dollars
