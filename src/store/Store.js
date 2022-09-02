import {createStore, set, get} from './redux-autosetters';

const shared = {
  q1: '',
  q2: '',
  q3: '',
  q4: '',
  q5: '',
  q6: '',
  q7: '',
  q8: '',
  q9: '',
  q10: '',
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
  help   : '',
  helpX  : 0,
  helpY  : 0,  
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
  $fertN: undefined, // db.rates.Nitrogen.value
  $fertP: 0,
  $fertK: 0,
  fertNAdded: 0,
  fertPAdded: 0,
  fertKAdded: 0,
  $fertApplication: undefined, // was db.costDefaults['Custom Fertilizer Appl'].cost
  $fertCredit: (state) => state.fertN * state.$fertN + state.fertP * state.$fertP + state.fertK * state.$fertK,
  $fertCost: (state) => -(state.fertNAdded * state.$fertN + state.fertPAdded * state.$fertP + state.fertKAdded * state.$fertK) - state.$fertApplication,
  seedbed:  {...shared},
  planting: {...shared},
  herbicide: {
    ...shared,
    product1: '',
    unitCost1:    (state) => db.herbicides[state.herbicide.product1]?.['Cost ($)'],
    rate1:        (state) => db.herbicides[state.herbicide.product1]?.['Rate'],
    productCost1: (state) => (state.herbicide.unitCost1 * state.herbicide.rate1) || undefined,

    product2: '',
    unitCost2:    (state) => db.herbicides[state.herbicide.product2]?.['Cost ($)'],
    rate2:        (state) => db.herbicides[state.herbicide.product2]?.['Rate'],
    productCost2: (state) => (state.herbicide.unitCost2 * state.herbicide.rate2) || undefined,
  },
  herbicideAdditional: {...shared},
  herbicideReduced: {...shared},
  herbicideFall: {...shared},
  yield: {
    ...shared,
    yield: undefined,
    price: (state) => db.commodities[state.cashCrop]?.price,
    typical: (state) => state.yield.yield * state.yield.price,
    adjusted: (state) => {
      const r = [
        +(state.yield.typical * (1 + db.commodities[state.cashCrop]?.['one year'])).toFixed(0),
        +(state.yield.typical * (1 + db.commodities[state.cashCrop]?.['three year'])).toFixed(0),
        +(state.yield.typical * (1 + db.commodities[state.cashCrop]?.['five year'])).toFixed(0),
      ];

      state.yield.impact = [
        r[0] - state.yield.typical,
        r[1] - state.yield.typical,
        r[2] - state.yield.typical,
      ];

      if (/typical/.test(state.yield.q2)) {
        state.yield.total = 0;
      } else {
        // console.log(state.yield.impact);
        // console.log(['1', '3', '5'].indexOf(state.yield.q4));
        state.yield.total = state.yield.impact[['1', '3', '5'].indexOf(state.yield.q4)];
      }

      return r;
    },
    impact: [],
  },
  erosion:  {
    ...shared,
    total: (state) => (state.erosion.q3 * state.erosion.q4) / state.acres
  },
  chemical: {...shared},
  roller:   {...shared},
  tillage:  {...shared},
  tillage1: {
    ...shared,
    costReductions: (state) => {
      return (state.tillage1.q5 === 'Yes' ? -state.tillage1.total : 0) - state.tillage2.total
    }
  },
  tillage2: {...shared},
  tillage3: {...shared},
  tillageAll: {
    ...shared,
    total: (state) => {
      return state.tillage1.costReductions + state.tillage3.total;
    }
  },
  termination: {
    ...shared,
    unitCost:    (state) => db.herbicides[state.termination.product]?.['Cost ($)'],
    rate:        (state) => db.herbicides[state.termination.product]?.['Rate'],
    productCost: (state) => (state.termination.unitCost * state.termination.rate) || undefined,
    additionalHerbicides: [],
    additionalRates:      [],
    additionalPrices:     [],
    additionalTotal: (state) => {
      let total = 0;
  
      state.termination.additionalHerbicides
        .forEach((s, n) => {
          if (s) {
            total += (state.termination.additionalRates[n] || 0) * (state.termination.additionalPrices[n] || 0);
          }
        });
      return total;
    },
    reducedHerbicides:    [],
    reducedRates:         [],
    reducedPrices:        [],
    reducedTotal: (state) => {
      let total = 0;
  
      state.termination.reducedHerbicides
        .forEach((s, n) => {
          if (s) {
            total += (state.termination.reducedRates[n] || 0) * (state.termination.reducedPrices[n] || 0);
          }
        });
      return total;
    },
  },
  fertility: {
    ...shared,
    total: (state) => state.$fertCredit + state.$fertCost
  },
  additional: {
    $landowner: '0.00',
    $costShare: '0.00',
    $carbonOffset: '0.00',
    grazing: '',
    lease: '',
    $lease: undefined,
    fallGraze: undefined,
    fallDryMatter: undefined,
    fallWaste: 0.50,
    springGraze: undefined,
    springDryMatter: undefined,
    springWaste: 0.50,
    dryMatter: undefined,
    wasted: undefined,
    $hay: undefined,
    hoursAcre: 0.5,
    baleSize: undefined,
    baleTime: undefined,
    tractor: '',
    lbsNotFed: (state) => {
      return (+((((state.additional.fallDryMatter * state.additional.fallWaste) + (state.additional.springDryMatter * state.additional.springWaste)) / state.additional.dryMatter)/(1 - state.additional.wasted)).toFixed(0)) || '';
    },
  },
  shown: {
    seedbed:          {...shared},
    planting:         {...shared},
    herbicide:        {...shared},
    herbicideAdditional:  {...shared},
    herbicideReduced:    {...shared},
    herbicideFall:    {...shared},
    yield:            {...shared},
    erosion:          {...shared},
    termination:      {...shared},
    fertility:        {...shared},
    chemical:         {...shared},
    roller:           {...shared},
    tillage:          {...shared},
    tillage1:         {...shared},
    tillage2:         {...shared},
    tillage3:         {...shared},
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
      state.rates[index] = (db.seedList[value] || {}).seedingRate || '';
      state.prices[index] = (db.seedList[value] || {}).price || '';
      state.focus = `rates${index}`;
      const fertN = (db.seedList[value] || {}).NCredit || '';
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
  'herbicide.q2': (state, {payload}) => {
    if (payload === 'No') {
      state.herbicideAdditional.estimated = 0;
      state.herbicideAdditional.total = 0;
      state.herbicideAdditional.implement = '';
    }
  },
  'herbicide.q5': (state, {payload}) => {
    if (payload === 'No') {
      state.herbicideReduced.estimated = 0;
      state.herbicideReduced.total = 0;
    }
  },
  'herbicide.q8': (state, {payload}) => {
    if (payload === 'No') {
      state.herbicideFall.estimated = 0;
      state.herbicideFall.total = 0;
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
  'termination.product': (state) => {
    state.focus = 'termination.unitCost'
  },
  'termination.q2': (state, {payload}) => {
    if (payload === 'Yes' && state.termination.method !== 'Herbicide application') {
      state.screen = 'Tillage';
    }
  },
  'termination.q3': (state, {payload}) => {
    if (payload === 'No') {
      state.screen = 'Tillage';
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
  'termination.additionalHerbicides': (state, {payload}) => {
    const index = payload.index;
    const value = payload.value;

    if (value) {
      state.termination.additionalPrices[index] = db.herbicides[value]?.['Cost ($)'];
      state.termination.additionalRates[index]  = db.herbicides[value]?.['Rate'];
    }
  },
  'termination.reducedHerbicides': (state, {payload}) => {
    const index = payload.index;
    const value = payload.value;

    if (value) {
      state.termination.reducedPrices[index] = db.herbicides[value]?.['Cost ($)'];
      state.termination.reducedRates[index]  = db.herbicides[value]?.['Rate'];
    }
  },
  'tillage1.q2': (state, {payload}) => {
    state.tillage1.estimated = 0;
    state.tillage1.total = 0;
    state.tillage1.implement = '';
    if (payload === 'Yes') {
      state.focus = 'tillage1.implement';
    }
  },
  'tillage2.q2': (state, {payload}) => {
    state.tillage2.estimated = 0;
    state.tillage2.total = 0;
    state.tillage2.implement = '';
    if (payload === 'Yes') {
      state.focus = 'tillage2.implement';
    }
  },
  'tillage3.q2': (state, {payload}) => {
    state.tillage3.estimated = 0;
    state.tillage3.total = 0;
    state.tillage3.implement = '';
    if (payload === 'Yes') {
      state.focus = 'tillage3.implement';
    } else if (state.tillage1.q1 === 'Yes') {
      state.screen = 'Fertility';
    }
  },
  'tillage1.q1': (state, {payload}) => {
    if (payload === 'Yes' && state.tillage3.q2 === 'No') {
      state.screen = 'Fertility';
    }
  },
  'additional.grazing': (state, {payload}) => {
    if (payload === 'No') {
      state.screen = 'Yield';
    }
  },
  'additional.lease': (state, {payload}) => {
    if (payload === 'Yes') {
      state.focus = 'additional.$lease';
    }
  },
  'additional.fallGraze': (state, {payload}) => {
    if (payload === 'Yes') {
      state.focus = 'additional.fallDryMatter';
    } else {
      state.focus = 'additional.springGraze';
      state.additional.fallDryMatter = undefined;
      state.additional.fallWaste = 0.50;
    }
  },
  'additional.springGraze': (state, {payload}) => {
    if (payload === 'Yes') {
      state.focus = 'additional.springDryMatter';
      state.additional.springDryMatter = undefined;
      state.additional.springWaste = 0.50;
    }
  },
  'erosion.q1': (state, {payload}) => {
    if (payload === 'No') {
      state.screen = 'Additional';
    }
  },
  'erosion.q2': (state, {payload}) => {
    state.erosion.q3 = {
      'Skid steer'  : 80,
      'Trackhoe'    : 100,
      'Dozer'       : 125
    }[payload];
  },
};

['seedbed', 'planting', 'chemical', 'roller', 'tillage', 'tillage1', 'tillage2', 'tillage3', 'herbicideAdditional', 'herbicideReduced', 'herbicideFall'].forEach(section => {
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

    if (payload === 'Hire custom operator') {
      const def = {
        seedbed  : 'Seedbed preparation',
        planting : 'Planting',
        tillage  : 'Seedbed preparation',
        tillage1 : 'Seedbed preparation',
        tillage2 : 'Seedbed preparation',
        tillage3 : 'Seedbed preparation',
        chemical : 'Herbicide application',
        roller   : 'Roller',
        herbicideAdditional: 'Herbicide application',
        herbicideReduced: 'Herbicide application',
        herbicideFall: 'Herbicide application',
      }[section];

      state.focus = section + '.total';
      console.log(db.costDefaults);
      obj.estimated = obj.total = db.costDefaults[def].cost;
    } else if (payload === 'I will not be making an additional application') {
      return;
    } else if (payload) {
      const p = db.implements[payload];
    
      obj.power = p['default power unit'];
      obj.acresHour = +(p['size1'] * p['field speed (m/h)'] * p['field efficiency'] / db.rates.conversion.value).toFixed(2);
      obj.annualUseAcres = +(obj.acresHour * p['expected use (hr/yr)']).toFixed(0);
      
      return [section + '.power'];
    }
  };

  afterChange[section + '.power'] = (state) => {
    const obj = state[section];
    
    if (obj.power) {
      obj.annualUseHours = db.power[obj.power]['expected use (hr/yr)'];
      getCosts(state, section);

      if (/tillage[1-3]/.test(section)) {
        state.focus = section + '.total';
      } else {
        state.focus = section + '.annualUseAcres';
      }
    }
  };

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
      const p = db[type][o] || {};

      const ASABE = db.coefficients[p['default ASABE category']] || {};
    
      const RF1 = ASABE.RF1 || 0;
      const RF2 = ASABE.RF2 || 0;
      const RV1 = ASABE.RV1 || 0;
      const RV2 = ASABE.RV2 || 0;
      const RV3 = ASABE.RV3 || 0;
      const RV4 = ASABE.RV4 || 0;
      const RV5 = ASABE.RV5 || 0;
      // console.log({RF1,RF2,RV1,RV2,RV3,RV4,RV5});
    
      // console.log(p['default ASABE category']);
      const tradein = (RV1 - RV2 * p['expected life (years)'] ** 0.5 - RV3 * p['expected use (hr/yr)'] ** 0.5 + RV4 * db.rates.projected.value) ** 2 + 0.25 * RV5;  
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
          value = +((p['HP'] * p['fuel use (gal/PTO hp/hr)']) * (1 + +db.rates.lubrication.value)) * db.rates.fuel.value / acresHour;
          break;
        case 'Depreciation':
          value = annualdepreciation / divisor;
          break;
        case 'Interest':
          value = (p['purchase price 2020'] + $tradein + annualdepreciation) / 2 * db.rates.interest.value / divisor;
          break;
        case 'Repairs':
          value = annualrepairs / divisor;
          break;
        case 'Taxes':
          value = (p['purchase price 2020'] + $tradein + annualdepreciation) / 2 * db.rates.property.value / divisor;
          break;
        case 'Insurance':
          value = (p['purchase price 2020'] + $tradein + annualdepreciation) / 2 * db.rates.insurance.value / divisor;
          break;
        case 'Storage':
          value = db.rates.storage.value * p['shed (ft^2)'] / divisor;
          break;
        case 'Labor':
          value = (p['tractor (hr/impl)'] * p['labor (hr/trac)']) / acresHour * db.rates.skilled.value;
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

  store.dispatch(set.status(status));

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
    store.dispatch(set.screen('Home'));
  }
} // loadData

export const db = {};

export const queue = (f, time=1) => {
  setTimeout(f, queue.i++ * time);
  setTimeout(() => queue.i = 0, time + 999);
}
queue.i = 0;

let status = '';
loadData(['coefficients', 'rates', 'costDefaults', 'herbicides', 'implements', 'power', 'seedList', 'stateRegions', 'commodities']);

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
  let value = get[key]?.(store.getState())?.toString();
  if (value !== result.toString()) {
    value = store.getState();

    for (const k of key.split('.')) {
      value = value[k];
    }

    if (value?.toString() !== result.toString()) {
      // I'd prefer console.error, but that requires showing all react_devtools_backend.js
      console.info(`${key} should be ${result} instead of ${value}`);
      console.info(get[key]?.(store.getState()));
    }
  }
} // test

export const getDefaults = (parms) => {
  const def = {};
  if (!Array.isArray(parms)) {
    parms = parms.split('|');
  }

  parms.forEach(parm => {
    let s = initialState;
    for (const k of parm.split('.')) {
      s = s[k];
    }
    def[parm] = s;
  });
  // console.log(def);
  return def;
} // getDefaults

export const clearInputs = (defaults) => {
  for (const key in defaults) {
    try {
      let s = set;
      for (const k of key.split('.')) {
        s = s[k];
      }
      // console.log(key, typeof defaults[key], defaults[key]);
      store.dispatch(s(defaults[key]));
    } catch(error) {
      console.log(key, error);
    }
  }
} // clearInputs

export const store = createStore(initialState, {afterChange});

export {set, get} from './redux-autosetters';
