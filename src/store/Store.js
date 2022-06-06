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
  firstName: '',
  lastName: '',
  fullName: (state) => state.firstName + ' ' + state.lastName,
  fullName2: (state) => state.fullName,
  t: {
    value: 123,
    ac: (state) => {
      state.screen = 'Fertility';
    }
  },
  dev: new URLSearchParams(window.location.search).get('dev'),
  test: '',
  test2: {a: {b: {c: 3}}},
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
  priorCrop: {
    value: '',
    ac: (state, {payload}) => {
      if (payload === 'Other') {
        state.focus = 'otherPriorCrop';
      } else {
        state.otherPriorCrop = '';
      }
    }
  },
  otherPriorCrop: '',
  cashCrop: {
    value: '',
    ac: (state, {payload}) => {
      if (payload === 'Other') {
        state.focus = 'otherCashCrop';
      } else {
        state.otherCashCrop = '';
      }
    }
  },
  otherCashCrop: '',
  description: null,
  species: [],
  rates: [],
  prices: [],
  coverCropTotal: (state) => {
    let total = 0;

    state.species
      .forEach((s, n) => {
        if (s) {
          total += (state.rates[n] || 0) * (state.prices[n] || 0);
        }
      });
    
    return total;
  },
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
  $fertCredit: (state) => state.fertN * state.$fertN + state.fertP * state.$fertP + state.fertK * state.$fertK,
  $fertCost: (state) => -(state.fertNAdded * state.$fertN + state.fertPAdded * state.$fertP + state.fertKAdded * state.$fertK) - state.$fertApplication,
  fertNAdded: 0,
  fertPAdded: 0,
  fertKAdded: 0,
  $fertApplication: undefined, // dbcostDefaults['Custom Fertilizer Appl'].cost
  seedbed: {...shared},
  planting: {...shared},
  termination: {...shared},
  fertility: {
    ...shared,
    total: (state) => state.$fertCredit + state.$fertCost
  },
  shown: {
    seedbed: {...shared},
    planting: {...shared},
    termination: {...shared},
    fertility: {...shared},
  },
};

const other = {
  species: (state, action) => {
    const {index, value} = action.payload;

    state.rates[index] = (state.dbseedList[value] || {}).seedingRate || '';
    state.prices[index] = (state.dbseedList[value] || {}).price || '';
    state.focus = `rates${index}`;
    const fertN = (state.dbseedList[value] || {}).NCredit || '';
    if (fertN) {
      state.fertN = fertN;
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
    }
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

const recurse = (obj, parents = []) => {
  for (const key in obj) {
    const fullkey = parents.length ? parents.join('.') + '.' + key : key;

    const o = obj[key];
    const isArray = Array.isArray(o);
    const isObject = !isArray && o instanceof Object;

    if (o?.ac) {
      if (typeof o.ac === 'string') {
        console.log(obj[o.ac]);
        other[fullkey] = other[o.ac];
      } else {
        other[fullkey] = o.ac;
      }    
      obj[key] = o.value;
    } else if (isObject) {
      recurse(obj[key], [...parents, key]);
    }
  }
} // recurse

recurse(initialState);

const sets = {};
const gets = {};

const funcs = {};
const links = {};

let updating = false;

const builders = (builder) => {
  const recurse = (obj, set, get, parents = []) => {
    Object.keys(obj).forEach((key) => {
      const isArray = Array.isArray(obj[key]);
      const isObject = !isArray && obj[key] instanceof Object;

      const fullkey = parents.length ? parents.join('.') + '.' + key : key;

      if (typeof obj[key] === 'function') {
        if (true) {
          funcs[fullkey] = obj[key];
          let m = obj[key].toString().match(/state.[$_\w.(]+/g);
          if (fullkey === 'fertility.total') {
            console.log(obj[key]);
          }
          
          if (m) {
            m = m.map(s => s.split('state.')[1].split(/\.\w+\(/)[0]);  // remove .forEach(, etc.
            m.forEach(m => {
              links[m] = links[m] || {};
              links[m][fullkey] = funcs[fullkey];
            });
          }

          obj[key] = undefined;
          get[key] = (state) => {
            let st = state;
            for (const k of parents) st = st[k];

            if (!st) {
              alert('Unknown: ' + fullkey);
            }
            return st[key];
          }
          return;
        } else {
          const f = obj[key];
          get[key] = (state) => {
            const result = f(state);
            
            // prevent infinite loop:
            if (!updating) { 
              updating = true;
              let s = sets;
              for (const p of parents) s = s[p];
  
              // queue(() => {
                // console.log(fullkey);
                mystore.dispatch(s[key](result)); // TODO: Cannot update a component (`App`) while rendering a different component (`Home`)
                updating = false;
              // });
            }
            
            return result;
          }
          obj[key] = undefined;
          return;
        }
      }
      
      if (!get[key] && key !== 'name') { // TODO: implements
        get[key] = (state) => {
          let st = state;
          for (const k of parents) st = st[k];

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
            const processLinks = (key => {
              if (links[key]) {
                for (let k in links[key]) {
                  let st = state;
                  for (const key of k.split('.').slice(0, -1)) st = st[key];
                  const l = k.includes('.') ? k.split('.').slice(-1) : k;
                  st[l] = links[key][k](state);
                  processLinks(k);
                }
              }
            });

            let st = state;
            for (const k of parents) st = st[k];

            if (isArray && Number.isFinite(action.payload.index)) {
              const {index, value} = action.payload;
              if (st[key][index] !== value) { // TODO: is this check needed?
                st[key][index] = value;
              }
            } else {
              if (st[key] !== action.payload) { // TODO: is this check needed?
                st[key] = action.payload;
              }
            }
            
            if (other[fullkey]) {
              other[fullkey](state, action);
            }

            processLinks(key);
            // if (/firstName|lastName/.test(key)) {
            //   state.fullName = funcs.fullName(state);
            // }
          }
        );
      }

      if (isObject) {
        recurse(obj[key], set[key], get[key], [...parents, key]);
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
console.log(funcs);
console.log(links);

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

  const ASABE = state.dbcoefficients[p['default ASABE category']] || {};

  const RF1 = ASABE.RF1 || 0;
  const RF2 = ASABE.RF2 || 0;
  const RV1 = ASABE.RV1 || 0;
  const RV2 = ASABE.RV2 || 0;
  const RV3 = ASABE.RV3 || 0;
  const RV4 = ASABE.RV4 || 0;
  const RV5 = ASABE.RV5 || 0;
  // console.log({RF1,RF2,RV1,RV2,RV3,RV4,RV5});

  console.log(p['default ASABE category']);
  const tradein = (RV1 - RV2 * p['expected life (years)'] ** 0.5 - RV3 * p['expected use (hr/yr)'] ** 0.5 + RV4 * state.dbrates.projected.value) ** 2 + 0.25 * RV5;  
  const listprice = p['purchase price 2020'] / (1 - p['list discount']);
  const $tradein = tradein * listprice;
  const annualdepreciation = (p['purchase price 2020'] - $tradein) / p['expected life (years)'];
  const accumulatedrepairs = listprice * (RF1 * (p['expected life (years)'] * p['expected use (hr/yr)'] / 1000) ** RF2);
  const annualrepairs = accumulatedrepairs / p['expected life (years)'];  
  
  if (false) {
    console.log({parm, tradein, listprice, $tradein, annualdepreciation, accumulatedrepairs, annualrepairs, divisor});
  }

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

  // fill in missing values:
  for (const key in db) {
    const d = db[key];
    const set = new Set();
    for (const key2 in d) {
      Object.keys(d[key2]).forEach(set.add, set); // https://stackoverflow.com/a/50882116/3903374
    }
    set.forEach(value => {
      for (const key2 in d) {
        if (!(value in d[key2])) {
          d[key2][value] = '';
        }
      }
    });
  }

  if (tables.length) {
    loadData(tables);
  } else {
    initialState = structuredClone({
      ...initialState,
      screen: 'Home'
    });

    Object.keys(db).forEach(key1 => {
      Object.keys(db[key1]).forEach(key2 => {
        initialState['db' + key1][key2] = db[key1][key2];
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

export const test = (key, result) => {
  let value = get[key]?.(mystore.getState())?.toString();
  if (value !== result.toString()) {
    value = mystore.getState();

    for (const k of key.split('.')) {
      value = value[k];
    }

    if (value?.toString() !== result.toString()) {
      // I'd prefer console.error, but that requires showing all react_devtools_backend.js
      console.info(`${key} should be ${result} instead of ${value}`);
      console.info(get[key]?.(mystore.getState()));
    }
  }
} // test