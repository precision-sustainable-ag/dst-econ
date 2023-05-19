/* eslint-disable no-console */
// import {current} from '@reduxjs/toolkit';

import React from 'react';
import { createStore, set, get } from './redux-autosetters';

export { set, get } from './redux-autosetters';
export const db = {};

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
  Taxes: false,
  Storage: false,
  Insurance: false,
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

const initialState = {
  focus: null,
  focused: null,
  scrollTop: 0,
  dev: /(localhost|dev)/i.test(window.location),
  screen: 'Loading',
  newScreen: '',
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  status: '',
  previousScreen: 'Field',
  map: {
    lat: 0,
    lon: 0,
    address: {},
  },
  mapFeatures: {
    zoom: 13,
    area: '',
  },
  location: '',
  farm: '',
  field: '',
  $labor: 0,
  $diesel: 0,
  cashCrop: '',
  otherCashCrop: '',
  description: null,
  species: [],
  rates: [],
  prices: [],
  coverCropTotal: (state) => {
    let total = 0;

    state.species.forEach((s, n) => {
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
  $fertCost: (state) => -(
    state.fertNAdded * state.$fertN
    + state.fertPAdded * state.$fertP
    + state.fertKAdded * state.$fertK
  ) - (state.$fertApplication || 0),
  seedbed: { ...shared },
  planting: { ...shared },
  unused: { ...shared },
  herbicide: {
    ...shared,
    total: (state) => (state.herbicideAdditional.cost || 0)
    + (state.herbicideAdditional.total || 0)
    + (state.herbicideFall.total || 0)
    + (state.herbicideFall.savings || 0)
    - ((state.herbicideReduced.cost || 0)
    + (state.herbicideReduced.total || 0)),
  },
  herbicideAdditional: {
    ...shared,
    product: '',
    unitCost: (state) => db.herbicides?.[state.herbicideAdditional.product]?.['Cost ($)'],
    rate: (state) => db.herbicides?.[state.herbicideAdditional.product]?.Rate,
    cost: (state) => state.herbicideAdditional.unitCost * state.herbicideAdditional.rate || 0,
  },
  herbicideReduced: {
    ...shared,
    product: '',
    unitCost: (state) => db.herbicides?.[state.herbicideReduced.product]?.['Cost ($)'],
    rate: (state) => db.herbicides?.[state.herbicideReduced.product]?.Rate,
    cost: (state) => state.herbicideReduced.unitCost * state.herbicideReduced.rate || 0,
  },
  herbicideFall: {
    ...shared,
    savings: 0,
  },
  yield: {
    ...shared,
    yield: undefined,
    price: (state) => db.commodities?.[state.cashCrop]?.price,
    typical: (state) => state.yield.yield * state.yield.price,
    adjusted: (state) => {
      const r = [
        +(
          state.yield.typical
          * (1 + (db.commodities?.[state.cashCrop]?.['one year'] ?? 0))
        ).toFixed(0),
        +(
          state.yield.typical
          * (1 + (db.commodities?.[state.cashCrop]?.['three year'] ?? 0))
        ).toFixed(0),
        +(
          state.yield.typical
          * (1 + (db.commodities?.[state.cashCrop]?.['five year'] ?? 0))
        ).toFixed(0),
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
  erosion: {
    ...shared,
    total: (state) => (state.erosion.q3 * state.erosion.q4) / state.mapFeatures.area,
  },
  chemical: { ...shared },
  roller: { ...shared },
  tillage: { ...shared },

  tillage1: {
    ...shared,
    costReductions: (state) => (state.tillage1.q5 === 'Yes' ? -state.tillageFall.total : 0)
    - (state.tillageElimination.total || 0),
  },
  tillageFall: { ...shared },
  tillageElimination: { ...shared },
  tillageOther: { ...shared },
  tillageAll: {
    ...shared,
    total: (state) => (state.tillage1.costReductions || 0) + (state.tillageOther.total || 0),
  },
  termination: {
    ...shared,
    unitCost: (state) => db.herbicides?.[state.termination.product]?.['Cost ($)'],
    rate: (state) => db.herbicides?.[state.termination.product]?.Rate,
    productCost: (state) => state.termination.unitCost * state.termination.rate || undefined,
    additionalHerbicides: [],
    additionalRates: [],
    additionalPrices: [],
    additionalTotal: (state) => {
      let total = 0;

      state.termination.additionalHerbicides.forEach((s, n) => {
        if (s) {
          total
          += (state.termination.additionalRates[n] || 0)
          * (state.termination.additionalPrices[n] || 0);
        }
      });
      return total;
    },
    reducedHerbicides: [],
    reducedRates: [],
    reducedPrices: [],
    reducedTotal: (state) => {
      let total = 0;

      state.termination.reducedHerbicides.forEach((s, n) => {
        if (s) {
          total
          += (state.termination.reducedRates[n] || 0)
          * (state.termination.reducedPrices[n] || 0);
        }
      });

      return total;
    },
    total: (state) => (+state.termination.productCost || 0)
      + (+state.chemical.total || 0)
      + (+state.roller.total || 0)
      + (+state.tillage.total || 0)
      + ((+state.termination.additionalTotal || 0)
      - (+state.termination.reducedTotal || 0)),
  },
  fertility: {
    ...shared,
    total: (state) => state.$fertCredit + state.$fertCost,
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
    fallWaste: 0.5,
    fallGrazing: '',
    springGraze: undefined,
    springDryMatter: undefined,
    springWaste: 0.5,
    springGrazing: '',
    dryMatter: undefined,
    wasted: undefined,
    $hay: undefined,
    hoursAcre: 0.5,
    baleSize: undefined,
    baleTime: undefined,
    tractor: '',
    lbsNotFed: (state) => +(
      (state.additional.fallDryMatter * state.additional.fallWaste
      + state.additional.springDryMatter * state.additional.springWaste)
      / state.additional.dryMatter
      / (1 - state.additional.wasted)
    ).toFixed(0) || '',
  },
};

export const formulas = { ...initialState };

const afterChange = {
  screen: (state) => {
    if (state.screen === 'Field') {
      state.focus = 'location';
    }
    const main = document.querySelector('#Main');
    if (main) {
      main.scrollTop = 0;
    }
    if (state.screen !== 'Resources') {
      state.previousScreen = state.screen;
    }
  },
  cashCrop: (state, { payload }) => {
    if (payload === 'Other') {
      state.focus = 'otherCashCrop';
    } else {
      state.otherCashCrop = '';
    }
  },
  species: (state, action) => {
    const { index, value } = action.payload;
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
  useFertilizer: (state, { payload }) => {
    if (payload === 'Yes') {
      state.focus = 'fertNAdded';
    } else {
      state.fertNAdded = 0;
      state.fertPAdded = 0;
      state.fertKAdded = 0;
      state.focus = '$fertApplication';
    }
  },
  'herbicide.q1': (state, { payload }) => {
    if (payload === 'No') {
      state.herbicideAdditional.estimated = 0;
      state.herbicideAdditional.total = 0;
      state.herbicideAdditional.implement = '';
    }
  },
  'herbicide.q2': (state, { payload }) => {
    if (payload === 'No') {
      state.herbicideAdditional.estimated = 0;
      state.herbicideAdditional.total = 0;
      state.herbicideAdditional.implement = '';
    }
  },
  'herbicide.q5': (state, { payload }) => {
    if (payload === 'No') {
      state.herbicideReduced.estimated = 0;
      state.herbicideReduced.total = 0;
    }
  },
  'herbicide.q8': (state, { payload }) => {
    if (payload === 'No') {
      state.herbicideFall.estimated = 0;
      state.herbicideFall.total = 0;
      state.newScreen = 'Erosion';
    }
  },
  'seedbed.q1': (state, { payload }) => {
    if (payload === 'No') {
      state.seedbed.estimated = 0;
      state.seedbed.total = 0;
      state.newScreen = 'Planting';
    }
  },
  'seedbed.q2': (state, { payload }) => {
    if (payload === 'Yes') {
      state.seedbed.estimated = 0;
      state.seedbed.total = 0;
      state.newScreen = 'Planting';
    }
  },
  // Termination ___________________________________________________________________________
  'termination.product': (state) => {
    state.focus = 'termination.unitCost';
  },
  'termination.additionalHerbicides': (state, { payload }) => {
    const { index } = payload;
    const { value } = payload;

    if (value) {
      state.termination.additionalPrices[index] = db.herbicides[value]?.['Cost ($)'];
      state.termination.additionalRates[index] = db.herbicides[value]?.Rate;
    }
  },
  'termination.reducedHerbicides': (state, { payload }) => {
    const { index } = payload;
    const { value } = payload;

    if (value) {
      state.termination.reducedPrices[index] = db.herbicides[value]?.['Cost ($)'];
      state.termination.reducedRates[index] = db.herbicides[value]?.Rate;
    }
  },
  // Tillage ___________________________________________________________________________
  'tillageFall.q2': (state, { payload }) => {
    if (payload === 'Yes') {
      state.focus = 'tillageFall.implement';
    }
  },
  'tillageElimination.q2': (state, { payload }) => {
    if (payload === 'Yes') {
      state.focus = 'tillageElimination.implement';
    }
  },
  'tillageOther.q2': (state, { payload }) => {
    if (payload === 'Yes') {
      state.focus = 'tillageOther.implement';
    } else if (state.tillage1.q1 === 'Yes') {
      state.newScreen = 'Fertility';
    }
  },
  'tillage1.q1': (state, { payload }) => {
    if (payload === 'Yes' && state.tillageOther.q2 === 'No') {
      state.newScreen = 'Fertility';
    }
  },
  'additional.nrcs': (state, { payload }) => {
    if (payload === 'Yes') {
      state.focus = 'additional.$costShare';
      const data = db.eqip[state.map.address.stateAbbreviation];
      const species = state.species.filter((e) => e);
      if (species.length === 1) {
        state.additional.$costShare = data?.basic;
      } else if (species.length > 1) {
        state.additional.$costShare = data?.multiple || data?.basic;
      }
    } else {
      state.additional.$costShare = 0;
    }
  },
  'additional.grazing': (state, { payload }) => {
    if (payload === 'No') {
      state.newScreen = 'Yield';
    }
  },
  'additional.lease': (state, { payload }) => {
    if (payload === 'Yes') {
      state.focus = 'additional.$lease';
    }
  },
  'additional.fallGraze': (state, { payload }) => {
    if (payload === 'Yes') {
      state.focus = 'additional.fallDryMatter';
    } else {
      state.focus = 'additional.springGraze';
      state.additional.fallDryMatter = undefined;
      state.additional.fallWaste = 0.5;
    }
  },
  'additional.springGraze': (state, { payload }) => {
    if (payload === 'Yes') {
      state.focus = 'additional.springDryMatter';
      state.additional.springDryMatter = undefined;
      state.additional.springWaste = 0.5;
    }
  },
  'erosion.q1': (state, { payload }) => {
    if (payload === 'No') {
      state.newScreen = 'Additional';
    }
  },
  'erosion.q2': (state, { payload }) => {
    state.erosion.q3 = db.erosionControl[payload].cost;
  },
};

const reducers = {
  resize: (state) => {
    // Cannot perform 'set' on a proxy that has been revoked
    // clearTimeout(resizeTimer);
    // resizeTimer = setTimeout(() => {
    state.screenWidth = window.innerWidth;
    state.screenHeight = window.innerHeight;
    // }, 100);
  },
  updateLocation: (state, { payload }) => {
    state = { ...state, ...payload };
    return state;
  },
};

export const store = createStore(initialState, { afterChange, reducers });

const getCosts = (state, current) => {
  ['implements', 'power'].forEach((type) => {
    state[current][`$${type}`].total = 0;

    [
      'Fuel',
      'Depreciation',
      'Interest',
      'Repairs',
      'Taxes',
      'Insurance',
      'Storage',
      'Labor',
    ].forEach((parm) => {
      if (!state[current][`${type}Cost`] || !state[current][parm]) {
        state[current][`$${type}`][parm] = 0;
        return;
      }

      const section = state[current];
      const o = type === 'implements' ? section.implement : section.power;

      const { acresHour } = state[current];

      const divisor = type === 'implements'
        ? section.annualUseAcres
        : section.annualUseHours * acresHour;

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
      const tradein = (
        RV1
        - RV2 * p['expected life (years)'] ** 0.5
        - RV3 * p['expected use (hr/yr)'] ** 0.5
        + RV4 * db.rates.projected.value
      ) ** 2
        + 0.25 * RV5;
      const listprice = p['purchase price 2020'] / (1 - p['list discount']);
      const $tradein = tradein * listprice;
      const annualdepreciation = (p['purchase price 2020'] - $tradein) / p['expected life (years)'];
      const accumulatedrepairs = listprice * (RF1 * ((p['expected life (years)'] * p['expected use (hr/yr)']) / 1000) ** RF2);
      const annualrepairs = accumulatedrepairs / p['expected life (years)'];

      // console.log({parm, tradein, listprice, $tradein, annualdepreciation, accumulatedrepairs, annualrepairs, divisor});

      let value;

      switch (parm) {
        case 'Fuel':
          value = +(
            p.HP
            * p['fuel use (gal/PTO hp/hr)']
            * (1 + +db.rates.lubrication.value)
            * state.$diesel
          ) / acresHour;
          break;
        case 'Depreciation':
          value = annualdepreciation / divisor;
          break;
        case 'Interest':
          value = (
            (
              (p['purchase price 2020'] + $tradein + annualdepreciation) / 2
            )
            * db.rates.interest.value
          ) / divisor;
          break;
        case 'Repairs':
          value = annualrepairs / divisor;
          break;
        case 'Taxes':
          value = (
            (
              (p['purchase price 2020'] + $tradein + annualdepreciation) / 2
            )
            * db.rates.property.value
          ) / divisor;
          break;
        case 'Insurance':
          value = (
            (
              (p['purchase price 2020'] + $tradein + annualdepreciation) / 2
            )
            * db.rates.insurance.value
          ) / divisor;
          break;
        case 'Storage':
          value = (db.rates.storage.value * p['shed (ft^2)']) / divisor;
          break;
        case 'Labor':
          value = ((p['tractor (hr/impl)'] * p['labor (hr/trac)']) / acresHour)
          * state.$labor;
          break;
        default:
          value = p[parm];
      }

      value = value || 0;

      state[current][`$${type}`][parm] = value;
      state[current][`$${type}`].total += value;
    });

    state[current].estimated = +(
      state[current].$implements.total + state[current].$power.total
    ).toFixed(2);
    state[current].total = state[current].estimated;
  });
}; // getCosts

[
  'seedbed',
  'planting',
  'chemical',
  'roller',
  'tillage',
  'tillageFall',
  'tillageElimination',
  'tillageOther',
  'herbicideAdditional',
  'herbicideReduced',
  'herbicideFall',
].forEach((section) => {
  afterChange[`${section}.implementsCost`] = (state) => getCosts(state, section);
  afterChange[`${section}.powerCost`] = (state) => getCosts(state, section);
  afterChange[`${section}.Labor`] = (state) => getCosts(state, section);
  afterChange[`${section}.Fuel`] = (state) => getCosts(state, section);
  afterChange[`${section}.Depreciation`] = (state) => getCosts(state, section);
  afterChange[`${section}.Interest`] = (state) => getCosts(state, section);
  afterChange[`${section}.Repairs`] = (state) => getCosts(state, section);
  afterChange[`${section}.Taxes`] = (state) => getCosts(state, section);
  afterChange[`${section}.Storage`] = (state) => getCosts(state, section);
  afterChange[`${section}.Insurance`] = (state) => getCosts(state, section);
  afterChange[`${section}.annualUseHours`] = (state, { payload }) => payload && getCosts(state, section);
  afterChange[`${section}.annualUseAcres`] = (state, { payload }) => payload && getCosts(state, section);

  afterChange[`${section}.implement`] = (state, { payload }) => {
    const obj = state[section];

    if (payload === 'Hire custom operator') {
      const def = {
        seedbed: 'Seedbed preparation',
        planting: 'Planting',
        tillage: 'Seedbed preparation',
        tillageFall: 'Seedbed preparation',
        tillageElimination: 'Seedbed preparation',
        tillageOther: 'Seedbed preparation',
        chemical: 'Herbicide application',
        roller: 'Roller',
        herbicideAdditional: 'Herbicide application',
        herbicideReduced: 'Herbicide application',
        herbicideFall: 'Herbicide application',
      }[section];

      state.focus = `${section}.total`;
      obj.estimated = db.costDefaults[def].cost;
      obj.total = db.costDefaults[def].cost;
    } else if (payload === 'I will not reduce my post emerge spray applications') {
      // empty
    } else if (payload) {
      const p = db.implements[payload];

      obj.power = p['default power unit'];
      obj.acresHour = +(
        (p.size1 * p['field speed (m/h)'] * p['field efficiency'])
        / db.rates.conversion.value
      ).toFixed(2);
      obj.annualUseAcres = +(obj.acresHour * p['expected use (hr/yr)']).toFixed(0);

      return [`${section}.power`];
    }
    return null;
  };

  afterChange[`${section}.power`] = (state) => {
    const obj = state[section];

    if (obj.power) {
      obj.annualUseHours = db.power[obj.power]['expected use (hr/yr)'];
      getCosts(state, section);

      if (/tillage[1-3]/.test(section)) {
        state.focus = `${section}.total`;
      } else {
        state.focus = `${section}.annualUseAcres`;
      }
    }
  };
});

afterChange.$labor = (state) => {
  getCosts(state, 'seedbed');
  getCosts(state, 'planting');
  getCosts(state, 'chemical');
  getCosts(state, 'roller');
  getCosts(state, 'tillage');
  getCosts(state, 'tillageFall');
  getCosts(state, 'tillageElimination');
  getCosts(state, 'tillageOther');
  getCosts(state, 'herbicideAdditional');
  getCosts(state, 'herbicideReduced');
  getCosts(state, 'herbicideFall');
};

afterChange.$diesel = afterChange.$labor;

let status = '';
const loadData = async (tables) => {
  // 'Typical Seeding Rate (lb/ac) [seedingRate]' becomes 'seedingRate'
  const alias = (col) => (col.includes('[') ? col.split(/[[\]]/)[1] : col);

  const table = tables.shift();

  const response = await fetch(
    `https://api.airtable.com/v0/appRBt6oxz1E9v2F4/${table}?api_key=keySO0dHQzGVaSZp2`,
  );
  const rec = await response.json();

  db[table] = {};

  status += `${table} `;

  const data = rec.records.map((r) => r.fields);

  data.forEach((rec2) => {
    const cols = Object.keys(rec2);
    db[table][rec2.key] = {};
    const obj = db[table][rec2.key];
    cols.forEach((col) => {
      obj[alias(col)] = rec2[col];
    });
  });

  store.dispatch(set.status(status));

  // fill in missing values:
  Object.keys(db).forEach((key) => {
    const d = db[key];
    const set2 = new Set();
    Object.keys(d).forEach((key2) => {
      Object.keys(d[key2]).forEach(set2.add, set2); // https://stackoverflow.com/a/50882116/3903374
    });
    set2.forEach((value) => {
      Object.keys(d).forEach((key2) => {
        if (!(value in d[key2])) {
          d[key2][value] = '';
        }
      });
    });
  });

  if (tables.length) {
    loadData(tables);
  } else {
    store.dispatch(set.screen('Field'));
    store.dispatch(set.$labor(db.rates?.skilled?.value));
    store.dispatch(set.$diesel(db.rates?.fuel?.value));
    store.dispatch(set.$fertP(db.rates?.P2O5?.value));
    store.dispatch(set.$fertK(db.rates?.K2O?.value));
  }
}; // loadData

export const queue = (f, time = 1) => {
  setTimeout(f, (queue.i += 1) * time);
  setTimeout(() => {
    queue.i = 0;
  }, time + 999);
};
queue.i = 0;

loadData([
  'coefficients',
  'rates',
  'costDefaults',
  'herbicides',
  'implements',
  'power',
  'seedList',
  'stateRegions',
  'commodities',
  'eqip',
  'erosionControl',
]);

export const dollars = (n) => {
  if (!Number.isFinite(n)) {
    return '';
  }
  if (+n < 0) {
    return (
      <span style={{ color: 'red' }}>
        ($
        {(-n).toFixed(2)}
        )
      </span>
    );
  }
  return `$${(+n).toFixed(2)}`;
}; // dollars

export const test = (key, result) => {
  let value = get[key]?.(store.getState())?.toString();
  if (value !== result.toString()) {
    value = store.getState();

    key.split('.').forEach((k) => {
      value = value[k];
    });

    if (value?.toString() !== result.toString()) {
      // I'd prefer console.error, but that requires showing all react_devtools_backend.js
      console.info(`${key} should be ${result} instead of ${value}`);
      console.info(get[key]?.(store.getState()));
    }
  }
}; // test

export const getDefaults = (parms) => {
  const def = {};
  if (!Array.isArray(parms)) {
    parms = parms.split('|');
  }

  parms.forEach((parm) => {
    let s = initialState;
    parm.split('.').forEach((k) => {
      s = s[k];
    });
    def[parm] = s;
  });

  return def;
}; // getDefaults

export const clearInputs = (defaults, exclude = []) => {
  Object.keys(defaults).forEach((key) => {
    if (!exclude.includes(key)) {
      try {
        let s = set;
        key.split('.').forEach((k) => {
          s = s[k];
        });
        store.dispatch(s(defaults[key]));
      } catch (error) {
        console.log(key, error);
      }
    }
  });
}; // clearInputs

// let resizeTimer;

export const exampleSeeds = () => {
  store.dispatch(set.species({ index: 0, value: 'Clover, Crimson' }));
  store.dispatch(set.species({ index: 1, value: 'Clover, Berseem' }));
}; // exampleSeeds

export const exampleHerbicides = () => {
  const herbicideDefaults = getDefaults(
    Object.keys(get.herbicide).map((parm) => `herbicide.${parm}`),
  );
  const fallDefaults = getDefaults(
    Object.keys(get.herbicideFall).map((parm) => `herbicideFall.${parm}`),
  );
  const additionalDefaults = getDefaults(
    Object.keys(get.herbicideAdditional).map((parm) => `herbicideAdditional.${parm}`),
  );
  const reducedDefaults = getDefaults(
    Object.keys(get.herbicideReduced).map((parm) => `herbicideReduced.${parm}`),
  );

  const defaults = {
    ...herbicideDefaults,
    ...fallDefaults,
    ...additionalDefaults,
    ...reducedDefaults,
  };

  clearInputs(defaults);

  store.dispatch(set.herbicide.q1('Yes'));
  store.dispatch(set.herbicide.q2('Yes'));
  store.dispatch(set.herbicideAdditional.product('atrazine'));

  store.dispatch(set.herbicide.q5('Yes'));
  store.dispatch(set.herbicideReduced.product('liberty'));

  store.dispatch(set.herbicideAdditional.implement('Boom Sprayer, Pull-Type; 90 Ft'));
  store.dispatch(set.herbicideReduced.implement('Boom Sprayer, Self-Propelled; 90 Ft'));

  store.dispatch(set.herbicide.q8('Yes'));
  store.dispatch(set.herbicideFall.savings(20));
  store.dispatch(set.herbicideFall.implement('Boom Sprayer, Pull-Type; 90 Ft'));
}; // exampleHerbicides

export const exampleSeedbed = () => {
  store.dispatch(set.seedbed.q1('Yes'));
  store.dispatch(set.seedbed.implement('Chisel Plow, Front Dsk; 16.3 Ft'));
}; // exampleSeedbed

export const examplePlanting = () => {
  store.dispatch(set.planting.implement('Presswheel Drill; 16 Ft'));
}; // examplePlanting

const clearTermination = () => {
  const defaults = getDefaults([
    'termination.additionalHerbicides',
    'termination.additionalPrices',
    'termination.additionalRates',
    'termination.reducedHerbicides',
    'termination.reducedPrices',
    'termination.reducedRates',
    'termination.q2',
    'chemical.implement',
    'chemical.power',
    'chemical.implementsCost',
    'chemical.powerCost',
    'chemical.Labor',
    'chemical.Fuel',
    'chemical.Depreciation',
    'chemical.Interest',
    'chemical.Repairs',
    'chemical.Taxes',
    'chemical.Insurance',
    'chemical.Storage',
    'roller.implement',
    'roller.power',
    'roller.implementsCost',
    'roller.powerCost',
    'roller.Labor',
    'roller.Fuel',
    'roller.Depreciation',
    'roller.Interest',
    'roller.Repairs',
    'roller.Taxes',
    'roller.Insurance',
    'roller.Storage',
    'tillage.implement',
    'tillage.power',
    'tillage.implementsCost',
    'tillage.powerCost',
    'tillage.Labor',
    'tillage.Fuel',
    'tillage.Depreciation',
    'tillage.Interest',
    'tillage.Repairs',
    'tillage.Taxes',
    'tillage.Insurance',
    'tillage.Storage',
    'termination.method',
    'termination.customCost',
    'termination.product',
  ]);
  clearInputs(defaults);
}; // clearTermination

export const exampleTermination1 = () => {
  clearTermination();
  store.dispatch(set.termination.q2('No'));
  store.dispatch(set.termination.method('Herbicide application'));
  store.dispatch(set.termination.product('atrazine'));
  store.dispatch(set.termination.unitCost(333));
  store.dispatch(set.termination.product('dicamba'));
  store.dispatch(set.chemical.implement('Boom Sprayer, Self-Propelled; 90 Ft'));
}; // exampleTermination1

export const exampleTermination2 = () => {
  clearTermination();
  store.dispatch(set.termination.method('Herbicide application'));
  store.dispatch(set.termination.q2('Yes'));
  store.dispatch(set.termination.q3('Yes'));

  store.dispatch(set.termination.additionalHerbicides({ value: 'dicamba', index: 0 }));
  store.dispatch(set.termination.additionalRates({ value: 3, index: 0 }));
  store.dispatch(set.termination.additionalPrices({ value: 4, index: 0 }));

  store.dispatch(set.termination.additionalHerbicides({ value: 'atrazine', index: 1 }));
  store.dispatch(set.termination.additionalRates({ value: 5, index: 1 }));
  store.dispatch(set.termination.additionalPrices({ value: 6, index: 1 }));

  store.dispatch(set.termination.reducedHerbicides({ value: 'liberty', index: 0 }));
  store.dispatch(set.termination.reducedRates({ value: 7, index: 0 }));
  store.dispatch(set.termination.reducedPrices({ value: 8, index: 0 }));
}; // exampleTermination2

export const exampleTermination3 = () => {
  clearTermination();
  store.dispatch(set.termination.q2('No'));
  store.dispatch(set.termination.method('Roller'));
  store.dispatch(set.roller.implement('Cover Crop Roller; 10.5 Ft'));
}; // exampleTermination2

export const exampleTermination4 = () => {
  clearTermination();
  store.dispatch(set.termination.q2('No'));
  store.dispatch(set.termination.method('Tillage'));
  store.dispatch(set.tillage.implement('Chisel Plow; 23 Ft'));
}; // exampleTermination4

export const exampleTermination5 = () => {
  clearTermination();
  store.dispatch(set.termination.q2('No'));
  store.dispatch(set.termination.method('Roller with follow-up herbicide'));
  store.dispatch(set.chemical.implement('Boom Sprayer, Pull-Type; 90 Ft'));
  store.dispatch(set.roller.implement('Cover Crop Roller; 10.5 Ft'));
}; // exampleTermination5

const clearTillage = () => {
  const tillageDefaults = getDefaults(
    Object.keys(get.tillage1).map((parm) => `tillage1.${parm}`),
  );
  const fallDefaults = getDefaults(
    Object.keys(get.tillageFall).map((parm) => `tillageFall.${parm}`),
  );
  const eliminationDefaults = getDefaults(
    Object.keys(get.tillageElimination).map((parm) => `tillageElimination.${parm}`),
  );
  const otherDefaults = getDefaults(
    Object.keys(get.tillageOther).map((parm) => `tillageOther.${parm}`),
  );
  const defaults = {
    ...tillageDefaults,
    ...fallDefaults,
    ...eliminationDefaults,
    ...otherDefaults,
  };
  clearInputs(defaults);
}; // clearTillage

export const exampleTillage1 = () => {
  clearTillage();
  store.dispatch(set.tillage1.q1('No'));
  store.dispatch(set.tillageFall.q2('Yes'));
  store.dispatch(set.tillageFall.implement('Chisel Plow; 23 Ft'));
  store.dispatch(set.tillage1.q5('Yes'));
  store.dispatch(set.tillageElimination.q2('No'));
  store.dispatch(set.tillageOther.q2('Yes'));
  store.dispatch(set.tillageOther.implement('Chisel Plow, Front Dsk; 16.3 Ft'));
}; // exampleTillage1

export const exampleTillage2 = () => {
  clearTillage();
  store.dispatch(set.tillage1.q1('No'));
  store.dispatch(set.tillageFall.q2('No'));
  store.dispatch(set.tillageElimination.q2('No'));
  store.dispatch(set.tillageOther.q2('No'));
}; // exampleTillage2

export const exampleTillage3 = () => {
  clearTillage();
  store.dispatch(set.tillage1.q1('No'));
  store.dispatch(set.tillageFall.q2('Yes'));
  store.dispatch(set.tillageFall.implement('Chisel Plow; 23 Ft'));
  store.dispatch(set.tillage1.q5('Yes'));
  store.dispatch(set.tillageElimination.q2('No'));
  store.dispatch(set.tillageOther.q2('No'));
}; // exampleTillage3

export const exampleTillage4 = () => {
  clearTillage();
  store.dispatch(set.tillage1.q1('No'));
  store.dispatch(set.tillageFall.q2('Yes'));
  store.dispatch(set.tillageFall.implement('Chisel Plow; 23 Ft'));
  store.dispatch(set.tillage1.q5('Yes'));
  store.dispatch(set.tillageElimination.q2('Yes'));
  store.dispatch(set.tillageElimination.implement('Chisel Plow; 23 Ft'));
  store.dispatch(set.tillageOther.q2('No'));
}; // exampleTillage4

export const exampleTillage5 = () => {
  clearTillage();
  store.dispatch(set.tillage1.q1('No'));
  store.dispatch(set.tillageFall.q2('No'));
  store.dispatch(set.tillageElimination.q2('No'));
  store.dispatch(set.tillageOther.q2('Yes'));
  store.dispatch(set.tillageOther.implement('Chisel Plow; 23 Ft'));
}; // exampleTillage5

export const exampleFertilityBenefit = () => {
  store.dispatch(set.fertN(30));
  store.dispatch(set.fertP(0));
  store.dispatch(set.fertK(0));
  store.dispatch(set.$fertN(0.75));
  store.dispatch(set.$fertP(0.6));
  store.dispatch(set.$fertK(0.5));
  store.dispatch(set.fertNAdded(0));
  store.dispatch(set.fertPAdded(15));
  store.dispatch(set.fertKAdded(10));
  store.dispatch(set.$fertApplication(8));
  store.dispatch(set.useFertilizer('Yes'));
}; // exampleFertilityBenefit

export const exampleFertilityCost = () => {
  store.dispatch(set.fertN(5));
  store.dispatch(set.fertP(25));
  store.dispatch(set.fertK(10));
  store.dispatch(set.$fertN(0.75));
  store.dispatch(set.$fertP(0.6));
  store.dispatch(set.$fertK(0.5));
  store.dispatch(set.fertNAdded(30));
  store.dispatch(set.fertPAdded(15));
  store.dispatch(set.fertKAdded(10));
  store.dispatch(set.$fertApplication(8));
  store.dispatch(set.useFertilizer('Yes'));
}; // exampleFertilityCost

export const exampleErosion = () => {
  store.dispatch(set.farm('My farm'));
  store.dispatch(set.field('My field'));
  store.dispatch(set.mapFeatures.area(150));
  store.dispatch(set.erosion.q1('Yes'));
  store.dispatch(set.erosion.q2('Trackhoe'));
  store.dispatch(set.erosion.q4(20));
}; // exampleErosion

export const exampleYield1 = () => {
  store.dispatch(set.yield.yield('150'));
  store.dispatch(set.cashCrop('Soybeans'));
  store.dispatch(set.yield.q2('Use cover crop adjusted yield estimates'));
  store.dispatch(set.yield.q4('5'));
}; // exampleYield1

export const exampleYield2 = () => {
  store.dispatch(set.yield.yield('150'));
  store.dispatch(set.cashCrop('Corn'));
  store.dispatch(set.yield.q2('Use cover crop adjusted yield estimates'));
  store.dispatch(set.yield.q4('5'));
}; // exampleYield2
