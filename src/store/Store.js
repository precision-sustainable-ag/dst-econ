// import {current} from '@reduxjs/toolkit';

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
  focus: null,
  focused: null,
  scrollTop: 0,
  firstName: '',
  lastName: '',
  fullName: (state) => state.firstName + ' ' + state.lastName,
  fullName2: (state) => state.fullName,
  dev: /(localhost|dev)/i.test(window.location),
  test: '',
  test2: {a: {b: {c: 3}}},
  array1: ['This ', 'is ', 'a ', 'test'],
  array2: {
    a: [4, 3, 2, 1],
  },
  screen: 'Loading',
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  showMap: window.innerWidth > 1200,
  maxZoom: 20, // max zoom of satellite imagery for current lat/lon; used on home map
  status: '',
  previousScreen: 'Field',
  lat: 40.7985,
  lon: -74.8215,
  // lat: 0,
  // lon: 0,
  mapType: 'hybrid',
  mapZoom: 13,
  mapPolygon: [],
  location: '',
  state: 'New Jersey',
  stateAbbreviation: 'NJ',
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
    total: (state) => (state.herbicideAdditional.cost + state.herbicideAdditional.total + state.herbicideFall.total) - (state.herbicideReduced.cost + state.herbicideReduced.total + state.herbicideFall.savings),
  },
  herbicideAdditional: {
    ...shared,
    product: '',
    unitCost: (state) => db.herbicides?.[state.herbicideAdditional.product]?.['Cost ($)'],
    rate: (state) => db.herbicides?.[state.herbicideAdditional.product]?.['Rate'],
    cost: (state) => (state.herbicideAdditional.unitCost * state.herbicideAdditional.rate) || 0,
  },
  herbicideReduced: {
    ...shared,
    product: '',
    unitCost: (state) => db.herbicides?.[state.herbicideReduced.product]?.['Cost ($)'],
    rate: (state) => db.herbicides?.[state.herbicideReduced.product]?.['Rate'],
    cost: (state) => (state.herbicideReduced.unitCost * state.herbicideReduced.rate) || 0,
  },
  herbicideFall: {
    ...shared,
    savings : 0,
  },
  yield: {
    ...shared,
    yield: undefined,
    price: (state) => db.commodities?.[state.cashCrop]?.price,
    typical: (state) => state.yield.yield * state.yield.price,
    adjusted: (state) => {
      const r = [
        +(state.yield.typical * (1 + db.commodities?.[state.cashCrop]?.['one year'])).toFixed(0),
        +(state.yield.typical * (1 + db.commodities?.[state.cashCrop]?.['three year'])).toFixed(0),
        +(state.yield.typical * (1 + db.commodities?.[state.cashCrop]?.['five year'])).toFixed(0),
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
      return (state.tillage1.q5 === 'Yes' ? -state.tillageFall.total : 0) - (state.tillageElimination.total || 0);
    }
  },
  tillageFall: {...shared},
  tillageElimination: {...shared},
  tillageOther: {...shared},
  tillageAll: {
    ...shared,
    total: (state) => {
      return state.tillage1.costReductions + state.tillageOther.total;
    }
  },
  termination: {
    ...shared,
    unitCost:    (state) => db.herbicides?.[state.termination.product]?.['Cost ($)'],
    rate:        (state) => db.herbicides?.[state.termination.product]?.['Rate'],
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
    reducedHerbicides:  [],
    reducedRates:       [],
    reducedPrices:      [],
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
    total: (state) => {
      return (state.termination.productCost || 0) + (state.chemical.total || 0) + (state.roller.total || 0) +
             (state.tillage.total || 0) + ((state.termination.additionalTotal || 0) - (state.termination.reducedTotal || 0))
    },
  },
  fertility: {
    ...shared,
    total: (state) => state.$fertCredit + state.$fertCost
  },
  additional: {
    $landowner: '0.00',
    nrcs: '',
    $costShare: '0.00',
    $carbonOffset: '0.00',
    $insuranceDiscount: '0.00',
    grazing: '',
    lease: '',
    $lease: undefined,
    fallGraze: undefined,
    fallDryMatter: undefined,
    fallWaste: 0.50,
    fallGrazing: '',
    springGraze: undefined,
    springDryMatter: undefined,
    springWaste: 0.50,
    springGrazing: '',
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
    seedbed:              {...shared},
    planting:             {...shared},
    herbicide:            {...shared},
    herbicideAdditional:  {...shared},
    herbicideReduced:     {...shared},
    herbicideFall:        {...shared},
    yield:                {...shared},
    erosion:              {...shared},
    termination:          {...shared},
    fertility:            {...shared},
    chemical:             {...shared},
    roller:               {...shared},
    tillage:              {...shared},
    tillage1:             {...shared},
    tillageFall:          {...shared},
    tillageElimination:   {...shared},
    tillageOther:         {...shared},
  },
};

const afterChange = {
  screen: (state) => {
    if (state.screen === 'Field') {
      state.focus = 'location';
    }
    const main = document.querySelector('#Main');
    if (main) {
      main.scrollTop = 0;
    }
  },
  lat: (state) => {
    const mz = new window.google.maps.MaxZoomService();

    mz.getMaxZoomAtLatLng({lat: +state.lat, lng: +state.lon}, (result) => {
      store.dispatch(set.maxZoom(result.zoom))
    });
  },
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
  'herbicide.q1': (state, {payload}) => {
    if (payload === 'No') {
      state.herbicideAdditional.estimated = 0;
      state.herbicideAdditional.total = 0;
      state.herbicideAdditional.implement = '';
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
      state.screen = 'Erosion';
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
// Termination ___________________________________________________________________________
  'termination.product': (state) => {
    state.focus = 'termination.unitCost'
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
// Tillage ___________________________________________________________________________
  'tillageFall.q2': (state, {payload}) => {
    if (payload === 'Yes') {
      state.focus = 'tillageFall.implement';
    }
  },
  'tillageElimination.q2': (state, {payload}) => {
    if (payload === 'Yes') {
      state.focus = 'tillageElimination.implement';
    }
  },
  'tillageOther.q2': (state, {payload}) => {
    if (payload === 'Yes') {
      state.focus = 'tillageOther.implement';
    } else if (state.tillage1.q1 === 'Yes') {
      state.screen = 'Fertility';
    }
  },
  'tillage1.q1': (state, {payload}) => {
    if (payload === 'Yes' && state.tillageOther.q2 === 'No') {
      state.screen = 'Fertility';
    }
  },
  'additional.nrcs': (state, {payload}) => {
    if (payload === 'Yes') {
      state.focus = 'additional.$costShare';
      const data = db.eqip[state.stateAbbreviation];
      const species = state.species.filter(e => e);
      if (species.length === 1) {
        state.additional.$costShare = data?.basic;
      } else if (species.length > 1) {
        state.additional.$costShare = data?.multiple || data?.basic;
      }
    } else {
      state.additional.$costShare = 0;
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

['seedbed', 'planting', 'chemical', 'roller', 'tillage', 'tillageFall', 'tillageElimination', 'tillageOther', 'herbicideAdditional', 'herbicideReduced', 'herbicideFall'].forEach(section => {
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
        seedbed     : 'Seedbed preparation',
        planting    : 'Planting',
        tillage     : 'Seedbed preparation',
        tillageFall : 'Seedbed preparation',
        tillageElimination    : 'Seedbed preparation',
        tillageOther    : 'Seedbed preparation',
        chemical    : 'Herbicide application',
        roller      : 'Roller',
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
    store.dispatch(set.screen('Field'));
  }
} // loadData

export const db = {};

export const queue = (f, time=1) => {
  setTimeout(f, queue.i++ * time);
  setTimeout(() => queue.i = 0, time + 999);
}
queue.i = 0;

let status = '';
loadData(['coefficients', 'rates', 'costDefaults', 'herbicides', 'implements', 'power', 'seedList', 'stateRegions', 'commodities', 'eqip']);

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

export const clearInputs = (defaults, exclude=[]) => {
  for (const key in defaults) {
    if (exclude.includes(key)) continue;
    try {
      let s = set;
      for (const k of key.split('.')) {
        s = s[k];
      }
      store.dispatch(s(defaults[key]));
    } catch(error) {
      console.log(key, error);
    }
  }
} // clearInputs

// let resizeTimer;

export const exampleSpecies = () => {
  store.dispatch(set.species({index: 0, value: 'Clover, Crimson'}));
  store.dispatch(set.species({index: 1, value: 'Clover, Berseem'}));
} // exampleSpecies

export const exampleHerbicides = () => {
  const herbicideDefaults   = getDefaults(Object.keys(get.herbicide).map(parm => 'herbicide.' + parm));
  const fallDefaults        = getDefaults(Object.keys(get.herbicideFall).map(parm => 'herbicideFall.' + parm));
  const additionalDefaults  = getDefaults(Object.keys(get.herbicideAdditional).map(parm => 'herbicideAdditional.' + parm));
  const reducedDefaults     = getDefaults(Object.keys(get.herbicideReduced).map(parm => 'herbicideReduced.' + parm));
  
  const defaults = {...herbicideDefaults, ...fallDefaults, ...additionalDefaults, ...reducedDefaults};

  clearInputs(defaults);

  store.dispatch(set.herbicide.q1('Yes'));
  store.dispatch(set.herbicide.q2('Yes'));
  store.dispatch(set.herbicideAdditional.product('atrazine'));

  store.dispatch(set.herbicide.q5('Yes'));
  store.dispatch(set.herbicideReduced.product('liberty'));

  store.dispatch(set.herbicideAdditional.implement('Boom Sprayer, Pull-Type; 90 Ft'));
  store.dispatch(set.herbicideReduced.implement('Boom Sprayer, Self-Propelled; 90 Ft'));

  store.dispatch(set.herbicide.q8('Yes'));
  store.dispatch(set.herbicideFall.savings(300));
  store.dispatch(set.herbicideFall.implement('Boom Sprayer, Pull-Type; 90 Ft'));
} // exampleHerbicides

export const exampleSeedbed = () => {
  store.dispatch(set.seedbed.q1('Yes'));
  store.dispatch(set.seedbed.implement('Chisel Plow, Front Dsk; 16.3 Ft'));
} // exampleSeedbed

export const examplePlanting = () => {
  store.dispatch(set.planting.implement('Presswheel Drill; 16 Ft'));
} // examplePlanting

export const exampleTermination1 = () => {
  clearTermination();
  store.dispatch(set.termination.q2('No'));
  store.dispatch(set.termination.method('Herbicide application'));
  store.dispatch(set.termination.product('atrazine'));
  store.dispatch(set.termination.unitCost(333));
  store.dispatch(set.termination.product('dicamba'));
  store.dispatch(set.chemical.implement('Boom Sprayer, Self-Propelled; 90 Ft'));
} // exampleTermination1

export const exampleTermination2 = () => {
  clearTermination();
  store.dispatch(set.termination.method('Herbicide application'));
  store.dispatch(set.termination.q2('Yes'));
  store.dispatch(set.termination.q3('Yes'));

  store.dispatch(set.termination.additionalHerbicides({value: 'dicamba', index: 0}));
  store.dispatch(set.termination.additionalRates({value: 3, index: 0}));
  store.dispatch(set.termination.additionalPrices({value: 4, index: 0}));

  store.dispatch(set.termination.additionalHerbicides({value: 'atrazine', index: 1}));
  store.dispatch(set.termination.additionalRates({value: 5, index: 1}));
  store.dispatch(set.termination.additionalPrices({value: 6, index: 1}));

  store.dispatch(set.termination.reducedHerbicides({value: 'liberty', index: 0}));
  store.dispatch(set.termination.reducedRates({value: 7, index: 0}));
  store.dispatch(set.termination.reducedPrices({value: 8, index: 0}));
} // exampleTermination2

export const exampleTermination3 = () => {
  clearTermination();
  store.dispatch(set.termination.q2('No'));
  store.dispatch(set.termination.method('Roller'));
  store.dispatch(set.roller.implement('Cover Crop Roller; 10.5 Ft'));
} // exampleTermination2

export const exampleTermination4 = () => {
  clearTermination();
  store.dispatch(set.termination.q2('No'));
  store.dispatch(set.termination.method('Tillage'));
  store.dispatch(set.tillage.implement('Chisel Plow; 23 Ft'));
} // exampleTermination4

export const exampleTermination5 = () => {
  clearTermination();
  store.dispatch(set.termination.q2('No'));
  store.dispatch(set.termination.method('Roller with follow-up herbicide'));
  store.dispatch(set.chemical.implement('Boom Sprayer, Pull-Type; 90 Ft'));
  store.dispatch(set.roller.implement('Cover Crop Roller; 10.5 Ft'));
} // exampleTermination5

const clearTermination = () => {
  const defaults = getDefaults('termination.additionalHerbicides|termination.additionalPrices|termination.additionalRates|termination.reducedHerbicides|termination.reducedPrices|termination.reducedRates|termination.q2|chemical.implement|chemical.power|chemical.implementsCost|chemical.powerCost|chemical.Labor|chemical.Fuel|chemical.Depreciation|chemical.Interest|chemical.Repairs|chemical.Taxes|chemical.Insurance|chemical.Storage|roller.implement|roller.power|roller.implementsCost|roller.powerCost|roller.Labor|roller.Fuel|roller.Depreciation|roller.Interest|roller.Repairs|roller.Taxes|roller.Insurance|roller.Storage|tillage.implement|tillage.power|tillage.implementsCost|tillage.powerCost|tillage.Labor|tillage.Fuel|tillage.Depreciation|tillage.Interest|tillage.Repairs|tillage.Taxes|tillage.Insurance|tillage.Storage|termination.method|termination.customCost|termination.product');
  clearInputs(defaults);
} // clearTermination

export const exampleTillage1 = () => {
  clearTillage();
  store.dispatch(set.tillage1.q1('No'));
  store.dispatch(set.tillageFall.q2('Yes'));
  store.dispatch(set.tillageFall.implement('Chisel Plow; 23 Ft'));
  store.dispatch(set.tillage1.q5('Yes'));
  store.dispatch(set.tillageElimination.q2('No'));
  store.dispatch(set.tillageOther.q2('Yes'));
  store.dispatch(set.tillageOther.implement('Chisel Plow, Front Dsk; 16.3 Ft'));
} // exampleTillage1

export const exampleTillage2 = () => {
  clearTillage();
  store.dispatch(set.tillage1.q1('No'));
  store.dispatch(set.tillageFall.q2('No'));
  store.dispatch(set.tillageElimination.q2('No'));
  store.dispatch(set.tillageOther.q2('No'));
} // exampleTillage2

export const exampleTillage3 = () => {
  clearTillage();
  store.dispatch(set.tillage1.q1('No'));
  store.dispatch(set.tillageFall.q2('Yes'));
  store.dispatch(set.tillageFall.implement('Chisel Plow; 23 Ft'));
  store.dispatch(set.tillage1.q5('Yes'));
  store.dispatch(set.tillageElimination.q2('No'));
  store.dispatch(set.tillageOther.q2('No'));
} // exampleTillage3

export const exampleTillage4 = () => {
  clearTillage();
  store.dispatch(set.tillage1.q1('No'));
  store.dispatch(set.tillageFall.q2('Yes'));
  store.dispatch(set.tillageFall.implement('Chisel Plow; 23 Ft'));
  store.dispatch(set.tillage1.q5('Yes'));
  store.dispatch(set.tillageElimination.q2('Yes'));
  store.dispatch(set.tillageElimination.implement('Chisel Plow; 23 Ft'));
  store.dispatch(set.tillageOther.q2('No'));
} // exampleTillage4

export const exampleTillage5 = () => {
  clearTillage();
  store.dispatch(set.tillage1.q1('No'));
  store.dispatch(set.tillageFall.q2('No'));
  store.dispatch(set.tillageElimination.q2('No'));
  store.dispatch(set.tillageOther.q2('Yes'));
  store.dispatch(set.tillageOther.implement('Chisel Plow; 23 Ft'));
} // exampleTillage5

const clearTillage = () => {
  const tillageDefaults     = getDefaults(Object.keys(get.tillage1).map(parm => 'tillage1.' + parm));
  const fallDefaults        = getDefaults(Object.keys(get.tillageFall).map(parm => 'tillageFall.' + parm));
  const eliminationDefaults = getDefaults(Object.keys(get.tillageElimination).map(parm => 'tillageElimination.' + parm));
  const otherDefaults       = getDefaults(Object.keys(get.tillageOther).map(parm => 'tillageOther.' + parm));
  const defaults = {...tillageDefaults, ...fallDefaults, ...eliminationDefaults, ...otherDefaults};  
  clearInputs(defaults);
} // clearTillage

export const exampleFertilityBenefit = () => {
  store.dispatch(set.fertN(30));
  store.dispatch(set.fertP(0));
  store.dispatch(set.fertK(0));
  store.dispatch(set.$fertN(.75));
  store.dispatch(set.$fertP(.60));
  store.dispatch(set.$fertK(.50));
  store.dispatch(set.fertNAdded(0));
  store.dispatch(set.fertPAdded(15));
  store.dispatch(set.fertKAdded(10));
  store.dispatch(set.$fertApplication(8));
  store.dispatch(set.useFertilizer('Yes'));
} // exampleFertilityBenefit

export const exampleFertilityCost = () => {
  store.dispatch(set.fertN(5));
  store.dispatch(set.fertP(25));
  store.dispatch(set.fertK(10));
  store.dispatch(set.$fertN(.75));
  store.dispatch(set.$fertP(.60));
  store.dispatch(set.$fertK(.50));
  store.dispatch(set.fertNAdded(30));
  store.dispatch(set.fertPAdded(15));
  store.dispatch(set.fertKAdded(10));
  store.dispatch(set.$fertApplication(8));
  store.dispatch(set.useFertilizer('Yes'));
} // exampleFertilityCost

const reducers = {
  resize: (state) => {
    // Cannot perform 'set' on a proxy that has been revoked
    // clearTimeout(resizeTimer);
    // resizeTimer = setTimeout(() => {
      state.screenWidth  = window.innerWidth;
      state.screenHeight = window.innerHeight;
    // }, 100);
  },
  updateLocation: (state, {payload}) => {
    state = {...state, ...payload};
    return state;
  },
}

export const store = createStore(initialState, {afterChange, reducers});

export {set, get} from './redux-autosetters';
