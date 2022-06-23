import {configureStore, createAction, createReducer, current} from '@reduxjs/toolkit';

const shared = {
  q1: '',
  q2: '',
  q3: '',
  implement: '',
  power: '',
  method: '',
  product: '',
  customCost: 0,
  acresHour: 0,
  estimated: undefined,
  total: undefined,
  annualUseAcres: undefined,
  annualUseHours: undefined,
  implementsCost: true,
  powerCost: true,
  Labor: true,
  Fuel: true,
  Depreciation: true,
  Interest: true,
  Repairs: true,
  Taxes: true,
  Storage: true,
  Insurance: true,
  $implements: {
    Labor: 0,
    Fuel: 0,
    Depreciation: 0,
    Interest: 0,
    Repairs: 0,
    Taxes: 0,
    Storage: 0,
    Insurance: 0,
    total: 0,
  },
  $power: {
    Labor: 0,
    Fuel: 0,
    Depreciation: 0,
    Interest: 0,
    Repairs: 0,
    Taxes: 0,
    Storage: 0,
    Insurance: 0,
    total: 0,
  },
};

let initialState = {
  focus: null,
  firstName: '',
  lastName: '',
  fullName: (state) => state.firstName + ' ' + state.lastName,
  fullName2: (state) => state.fullName,
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
  field: '',
  acres: undefined,
  $labor: undefined,
  priorCrop: '',
  otherPriorCrop: '',
  cashCrop: '',
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
  fertNAdded: 0,
  fertPAdded: 0,
  fertKAdded: 0,
  $fertApplication: undefined, // dbcostDefaults['Custom Fertilizer Appl'].cost
  $fertCredit: (state) => state.fertN * state.$fertN + state.fertP * state.$fertP + state.fertK * state.$fertK,
  $fertCost: (state) => -(state.fertNAdded * state.$fertN + state.fertPAdded * state.$fertP + state.fertKAdded * state.$fertK) - state.$fertApplication,
  seedbed:  {...shared},
  planting: {...shared},
  chemical: {...shared},
  roller:   {...shared},
  tillage:  {...shared},
  termination: {
    ...shared,
    unitCost:    (state) => state.dbherbicides[state.termination.product]?.['Cost ($)'],
    rate:        (state) => state.dbherbicides[state.termination.product]?.['Rate'],
    productCost: (state) => state.termination.unitCost * state.termination.rate,
  },
  fertility: {
    ...shared,
    total: (state) => state.$fertCredit + state.$fertCost
  },
  shown: {
    seedbed:      {...shared},
    planting:     {...shared},
    termination:  {...shared},
    fertility:    {...shared},
    chemical:     {...shared},
    roller:       {...shared},
    tillage:      {...shared},
  },
};

const afterChange = {
  priorCrop: (state, {payload}) => {
    if (payload === 'Other') {
      state.focus = 'otherPriorCrop';
    } else {
      state.otherPriorCrop = '';
    }
  },
  cashCrop: (state, {payload}) => {
    if (payload === 'Other') {
      state.focus = 'otherCashCrop';
    } else {
      state.otherCashCrop = '';
    }
  },
  species: (state, action) => {
    const {index, value} = action.payload;
    if (Number.isFinite(index)) {
      state.rates[index] = (state.dbseedList[value] || {}).seedingRate || '';
      state.prices[index] = (state.dbseedList[value] || {}).price || '';
      state.focus = `rates${index}`;
      const fertN = (state.dbseedList[value] || {}).NCredit || '';
      if (fertN) {
        state.fertN = fertN;
      }
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
      state.seedbed.estimated = 0;
      state.seedbed.total = 0;
      state.screen = 'Planting';
    }
  },
  'seedbed.q2': (state, {payload}) => {
    if (payload === 'Yes') {
      state.seedbed.estimated = 0;
      state.seedbed.total = 0;
      state.screen = 'Planting';
    }
  },
  'seedbed.q3': (state, {payload}) => {
    switch (payload) {
      case 'Self':
        state.focus = 'seedbed.implement';
        state.seedbed.estimated = state.seedbed.total = undefined;
        break;
      case 'Custom Operator':
        state.focus = 'seedbed.total';
        state.seedbed.estimated = state.seedbed.total = state.dbcostDefaults['Seedbed preparation'].cost;
        break;
      default:
    }
  },
  'planting.q3': (state, {payload}) => {
    switch (payload) {
      case 'Self':
        state.focus = 'planting.implement';
        state.planting.estimated = state.planting.total = undefined;
        break;
      case 'Custom Operator':
        state.focus = 'planting.total';
        state.planting.estimated = state.planting.total = state.dbcostDefaults['Planting'].cost;
        break;
      default:
    }
  },
  'termination.q2': (state, {payload}) => {
    if (payload === 'Yes') {
      state.screen = 'Tillage';
    }
  },
  'termination.q3': (state, {payload}) => {
    switch (payload) {
      case 'Self':
        state.focus = 'termination.method';
        break;
      case 'Custom Operator':
        state.focus = 'termination.customCost';
        break;
      default:
    }
  },
  'termination.method': (state) => {
    state.chemical.implement = '';
    state.chemical.power = '';
    state.chemical.total = 0;

    state.roller.implement = '';
    state.roller.power = '';
    state.roller.total = 0;

    state.tillage.implement = '';
    state.tillage.power = '';
    state.tillage.total = 0;
  },
};

['seedbed', 'planting', 'chemical', 'roller', 'tillage'].forEach(section => {
  afterChange[section + '.implementsCost'] = (state) => getCosts(state, section);
  afterChange[section + '.powerCost'] =      (state) => getCosts(state, section);
  afterChange[section + '.Labor'] =          (state) => getCosts(state, section);
  afterChange[section + '.Fuel'] =           (state) => getCosts(state, section);
  afterChange[section + '.Depreciation'] =   (state) => getCosts(state, section);
  afterChange[section + '.Interest'] =       (state) => getCosts(state, section);
  afterChange[section + '.Repairs'] =        (state) => getCosts(state, section);
  afterChange[section + '.Taxes'] =          (state) => getCosts(state, section);
  afterChange[section + '.Storage'] =        (state) => getCosts(state, section);
  afterChange[section + '.Insurance'] =      (state) => getCosts(state, section);
  afterChange[section + '.annualUseHours'] = (state, {payload}) => payload && getCosts(state, section);
  afterChange[section + '.annualUseAcres'] = (state, {payload}) => payload && getCosts(state, section);

  afterChange[section + '.implement'] = (state, {payload}) => {
    const obj = state[section];

    if (payload) {
      const p = state.dbimplements[payload];
    
      obj.power = p['default power unit'];
      obj.acresHour = +(p['size1'] * p['field speed (m/h)'] * p['field efficiency'] / state.dbrates.conversion.value).toFixed(2);
      obj.annualUseAcres = +(obj.acresHour * p['expected use (hr/yr)']).toFixed(0);
      state.focus = section + '.power';
      return [section + '.power'];
    }
  };

  afterChange[section + '.power'] = (state) => {
    const obj = state[section];
    
    if (obj.power) {
      obj.annualUseHours = state.dbpower[obj.power]['expected use (hr/yr)'];
      getCosts(state, section);
      state.focus = section + '.annualUseAcres';
    }
  };

});

const sets = {};
const gets = {};

const funcs = {};
const methods = {};

const processMethods = ((state, key) => {
  if (methods[key]) {
    for (let k in methods[key]) {
      let st = state;
      for (const key of k.split('.').slice(0, -1)) st = st[key];
      const l = k.includes('.') ? k.split('.').slice(-1)[0] : k;
      st[l] = methods[key][k](state);
      processMethods(state, k);
    }
  }
});

const builders = (builder) => {
  const recurse = (obj, set, get, parents = []) => {
    Object.keys(obj).forEach((key) => {
      const isArray = Array.isArray(obj[key]);
      const isObject = !isArray && obj[key] instanceof Object;
      const fullkey = parents.length ? parents.join('.') + '.' + key : key;

      if (key !== 'name') { // TODO: implements
        get[key] = (state) => {
          let st = state;
          for (const k of parents) st = st[k];

          if (!st) {
            alert('Unknown: ' + fullkey);
          }
          return st[key];
        }

        if (typeof obj[key] === 'function') {
          funcs[fullkey] = obj[key];
          // console.log(obj[key]);
          let m = obj[key].toString().match(/e\.[$_\w.(]+/g);  // state.* unbuilt, e.* built
          
          if (m) {
            m = m.map(s => s.split(/e\./)[1]?.split(/\.\w+\(/)[0]);  // remove .forEach(, etc.
            m.forEach(m => {
              methods[m] = methods[m] || {};
              methods[m][fullkey] = funcs[fullkey];
            });
          }
  
          obj[key] = undefined;
          return;
        }
      }

      if (key !== 'name') { // TODO: implements
        set[key] = createAction(fullkey);

        builder
          .addCase(set[key], (state, action) => {
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
            
            if (afterChange[fullkey]) {
              const ac = afterChange[fullkey](state, action);
              if (ac) {
                ac.forEach(parm => afterChange[parm](state, action));
              }
            }

            // TODO:  Is the first of these needed?
              processMethods(state, key);
              processMethods(state, fullkey);

            if (afterChange[fullkey]) {
              let m = afterChange[fullkey].toString().match(/state.[$_\w.(]+/g);
          
              if (m) {
                m = m.forEach(s => {
                  s = s.split('state.')[1];
                  if (s) {
                    processMethods(state, s.split(/\.\w+\(/)[0]);
                  }
                });
              }
            }
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

console.log({
  set,
  funcs,
  methods
});

const getCosts = (state, current) => {
  ['implements', 'power'].forEach(type => {
    state[current]['$' + type].total = 0;

    ['Fuel', 'Depreciation', 'Interest', 'Repairs', 'Taxes', 'Insurance', 'Storage', 'Labor'].forEach(parm => {
      if (!state[current][type + 'Cost'] || !state[current][parm]) {
        state[current]['$' + type][parm] = 0;
        return;
      }

      const section = state[current];
      const o = type === 'implements' ? section.implement : section.power;

      const acresHour = state[current].acresHour;

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
    
      // console.log(p['default ASABE category']);
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
          value = (p['tractor (hr/impl)'] * p['labor (hr/trac)']) / acresHour * state.dbrates.skilled.value;
          break;
        default:
          value = p[parm];
      }

      value = value || 0;

      state[current]['$' + type][parm] = value;
      state[current]['$' + type].total += value;
    });

    state[current].estimated = +(state[current].$implements.total + state[current].$power.total).toFixed(2);
    state[current].total = state[current].estimated;
  })
} // getCosts

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

const db = {};

export const queue = (f, time=1) => {
  setTimeout(f, queue.i++ * time);
  setTimeout(() => queue.i = 0, time + 999);
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

export const getDefaults = (parms) => {
  const def = {};
  parms.split('|').forEach(parm => {
    let s = initialState;
    for (const k of parm.split('.')) {
      s = s[k];
    }
    def[parm] = s;
  });
  console.log(def);
  return def;
} // getDefaults

export const clearInputs = (defaults) => {
  for (const key in defaults) {
    try {
      let s = set;
      for (const k of key.split('.')) {
        s = s[k];
      }
      console.log(key, defaults[key]);
      mystore.dispatch(s(defaults[key]));
    } catch(error) {
      console.log(error);
    }
  }
} // clearInputs
