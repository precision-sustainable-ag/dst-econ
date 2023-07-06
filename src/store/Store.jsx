/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */

// import { current as showCurrent } from '@reduxjs/toolkit';

import React from 'react';

import { createStore, set, get } from './redux-autosetters';
import { db } from './airtables';

export { set, get } from './redux-autosetters';
export { db } from './airtables';

export const dollars = (n) => {
  if (!Number.isFinite(n)) {
    return '';
  }
  if (+n < 0) {
    return (
      <span style={{ color: 'red' }}>
        $
        {(-n).toFixed(2)}
      </span>
    );
  }
  return `$${(+n).toFixed(2)}`;
}; // dollars

export const dev = /(localhost|dev)/i.test(window.location);

const terminationTotal = (state) => (
  (+state.termination.productCost || 0)
  + (+state.chemical.total || 0)
  + (+state.roller.total || 0)
  + (+state.tillage.total || 0)
  + ((+state.termination.additionalTotal || 0) - (+state.termination.reducedTotal || 0))
);

const tillageTotal = (state) => (state.tillage1.costReductions || 0) + (state.tillageOther.total || 0) + (state.tillageFall.total || 0);

const herbicideTotal = (state) => (
  (state.herbicideAdditional.cost || 0)
  + (state.herbicideAdditional.total || 0)
  + (state.herbicideFall.total || 0)
  + (state.herbicideFall.savings || 0)
  - ((state.herbicideReduced.cost || 0) + (state.herbicideReduced.total || 0))
);

const grazingTotal = (state) => {
  if (state.grazing.$lease) {
    return -state.grazing.$lease;
  }

  const fall = state.grazing.fall;
  const spring = state.grazing.spring;
  const $hay = state.grazing.$hay;
  const hoursAcre = state.grazing.hoursAcre;
  const $labor = state.$labor;
  const $diesel = state.$diesel;

  if (+fall + +spring === 0) {
    return 0;
  }

  if (+$hay === 0 || +$labor === 0 || +$diesel === 0) {
    return 0;
  }

  const pctFallWaste = 0.50;
  const pctSpringWaste = 0.50;
  const dryMatter = 0.88;
  const hayWasted = 0.22;
  const lbsNotFed = ((((fall * pctFallWaste) + (spring * pctSpringWaste)) / dryMatter) / (1 - hayWasted));
  const balesFed = 1800;
  const timeFed = 0.5;
  const fuelConsumption = 6;
  const additionalLabor = -($labor * hoursAcre);
  const reductionHayFed = lbsNotFed * ($hay / 2000);
  const reductionFuel = (lbsNotFed / balesFed) * (timeFed * fuelConsumption * $diesel);
  const reductionLabor = (lbsNotFed / balesFed) * timeFed * $labor;
  return -(additionalLabor + reductionHayFed + reductionFuel + reductionLabor);
}; // grazingTotal

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
  mobile: !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 800,
  calculated: {},
  revenueColor: false,
  revenuePadding: false,
  name: '',
  email: '',
  feedback: '',
  focus: null,
  focused: null,
  modalData: '',
  anchor: '',
  scrollTop: 0,
  airTables: '',
  screen: 'Loading',
  newScreen: '',
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
  revenueOpen: {},
  coverCropTotal: (state) => {
    let total = 0;

    state.species.forEach((s, n) => {
      if (s) {
        total += (state.rates[n] || 0) * (state.prices[n] || 0);
      }
    });

    return total;
  },
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
    total: herbicideTotal,
  },
  herbicideAdditional: {
    ...shared,
    product: '',
    unitCost: (state) => db.herbicides?.[state.herbicideAdditional.product]?.['Cost ($)'],
    rate: (state) => db.herbicides?.[state.herbicideAdditional.product]?.Rate,
    cost: '',
    // cost: (state) => state.herbicideAdditional.unitCost * state.herbicideAdditional.rate || 0,
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
    total: tillageTotal,
  },
  termination: {
    ...shared,
    unitCost: (state) => db.herbicides?.[state.termination.product]?.['Cost ($)'],
    rate: (state) => db.herbicides?.[state.termination.product]?.Rate,
    // productCost: (state) => state.termination.unitCost * state.termination.rate || undefined,
    productCost: '',
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
          total += (state.termination.reducedRates[n] || 0)
                   * (state.termination.reducedPrices[n] || 0);
        }
      });

      return total;
    },
    total: terminationTotal,
  },
  fertility: {
    ...shared,
    total: (state) => state.$fertCredit + state.$fertCost,
  },
  additional: {
    $landowner: 0,
    nrcs: '',
    $costShare: 0,
    $carbonOffset: 0,
    $insuranceDiscount: 0,
    total: (state) => +state.additional.$landowner + +state.additional.$costShare
      + +state.additional.$carbonOffset + +state.additional.$insuranceDiscount,
  },
  grazing: {
    grazing: '',
    lease: '',
    $lease: 0,
    $hay: 0,
    hoursAcre: 0,
    fall: '0',
    spring: '0',
    total: grazingTotal,
  },
};

export const formulas = { ...initialState };

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
    state.calculated[`${current}.total`] = state[current].total;

    state.termination.total = terminationTotal(state);
    state.tillageAll.total = tillageTotal(state);
    state.herbicide.total = herbicideTotal(state);
  });
}; // getCosts

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
      state.yield.yield = '';
      state.focus = 'otherCashCrop';
    } else {
      state.yield.yield = db.commodities[payload]?.yield;
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
  'grazing.lease': (state, { payload }) => {
    if (payload === 'Yes') {
      state.grazing.fall = '0';
      state.grazing.spring = '0';
      state.grazing.$hay = '';
      state.grazing.hoursAcre = '';
      state.grazing.total = 0;
      state.focus = 'grazing.$lease';
    } else {
      state.grazing.$lease = '';
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
      state.herbicideAdditional.product = '';
      state.herbicideAdditional.cost = 0;
      state.herbicideAdditional.estimated = 0;
      state.herbicideAdditional.total = 0;
      state.herbicideAdditional.implement = '';
    } else if (state.herbicide.q1 === 'Yes' && payload === 'Yes') {
      state.herbicideAdditional.cost = db.costDefaults?.['Herbicide product']?.cost;
      state.focus = 'herbicideAdditional.product';
    }
  },
  'termination.q2': (state, { payload }) => {
    if (payload === 'No') {
      state.termination.productCost = db.costDefaults?.['Herbicide product']?.cost;
      state.focus = 'termination.product';
    } else {
      state.termination.productCost = 0;
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
      const data = db.eqip[state.map.address.stateCode];
      const species = state.species.filter((e) => e);
      if (species.length === 1) {
        state.additional.$costShare = data?.basic;
        state.calculated['additional.$costShare'] = data?.basic;
      } else if (species.length > 1) {
        state.additional.$costShare = data?.multiple || data?.basic;
        state.calculated['additional.$costShare'] = data?.multiple || data?.basic;
      }
    } else {
      state.additional.$costShare = 0;
      delete state.calculated['additional.$costShare'];
    }
  },
  'grazing.grazing': (state, { payload }) => {
    if (payload === 'No') {
      state.newScreen = 'Additional';
    }
  },
  'erosion.q1': (state, { payload }) => {
    if (payload === 'No') {
      state.newScreen = 'Grazing';
    }
  },
  'erosion.q2': (state, { payload }) => {
    state.erosion.q3 = db.erosionControl?.[payload]?.cost;
    if (state.erosion.q3) {
      state.calculated['erosion.q3'] = state.erosion.q3;
    } else {
      delete state.calculated['erosion.q3'];
    }
  },
  $labor: (state) => {
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
  },
  map: (state) => {
    state.mapFeatures.zoom = 16;
  },
};

afterChange.$diesel = afterChange.$labor;

const reducers = {
  updateLocation: (state, { payload }) => {
    state = { ...state, ...payload };
    return state;
  },
};

export const store = createStore(initialState, { afterChange, reducers });

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

    payload = payload.replace('HIRE ', '');
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
      state.calculated[`${section}.total`] = obj.total;
    } else if (Object.keys(db.costDefaults).includes(payload)) {
      state.focus = `${section}.total`;
      obj.estimated = db.costDefaults[payload].cost;
      obj.total = db.costDefaults[payload].cost;
      state.calculated[`${section}.total`] = obj.total;
    } else if (payload === 'I will not reduce my post emerge spray applications') {
      // empty
    } else if (payload) {
      const p = db.implements[payload] || {};

      obj.power = p['default power unit'];
      obj.acresHour = +(
        (p.size1 * p['field speed (m/h)'] * p['field efficiency'])
        / db.rates.conversion.value
      ).toFixed(2);
      obj.annualUseAcres = +(obj.acresHour * p['expected use (hr/yr)']).toFixed(0);
      state.calculated[`${section}.annualUseAcres`] = obj.annualUseAcres;

      return [`${section}.power`];
    }
    return null;
  };

  afterChange[`${section}.power`] = (state) => {
    const obj = state[section];

    if (obj.power) {
      obj.annualUseHours = db.power[obj.power]?.['expected use (hr/yr)'];
      state.calculated[`${section}.annualUseHours`] = obj.annualUseHours;
      getCosts(state, section);

      if (/tillage[1-3]/.test(section)) {
        state.focus = `${section}.total`;
      } else {
        state.focus = `${section}.annualUseAcres`;
      }
    }
  };
});

const loaded = () => {
  store.dispatch(set.screen('Field'));
  store.dispatch(set.$labor(db.rates?.skilled?.value));
  store.dispatch(set.$diesel(db.rates?.fuel?.value));
  store.dispatch(set.$fertP(db.rates?.P2O5?.value));
  store.dispatch(set.$fertK(db.rates?.K2O?.value));
}; // loaded

let status = '';
let airTables = `
/* eslint-disable import/prefer-default-export */
/* eslint-disable max-len */
/* eslint-disable comma-dangle */
/* eslint-disable quote-props */
/* eslint-disable quotes */
`.trim();

const loadAirtables = async (tables) => {
  // 'Typical Seeding Rate (lb/ac) [seedingRate]' becomes 'seedingRate'
  const alias = (col) => (col.includes('[') ? col.split(/[[\]]/)[1] : col);

  const table = tables.shift();

  const order = /commodities|costDefaults/.test(table) ? 'order' : 'key';

  const response = await fetch(
    `https://api.airtable.com/v0/appRBt6oxz1E9v2F4/${table}?api_key=keySO0dHQzGVaSZp2&sort%5B0%5D%5Bfield%5D=${order}`,
  );
  const rec = await response.json();

  db[table] = {};

  status += `${table} `;

  const data = rec.records.map((r) => r.fields);

  data.forEach((rec2) => {
    const cols = Object.keys(rec2);
    let { key } = rec2;
    if (rec2.screen) {
      key += `|${rec2.screen}`;
    }
    db[table][key] = {};
    const obj = db[table][key];
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

  airTables += `\nconst AT${table} = ${JSON.stringify(db[table], null, 2)};\n`;

  if (tables.length) {
    loadAirtables(tables);
  } else {
    airTables = `${airTables}
export const db = {
  coefficients: ATcoefficients,
  rates: ATrates,
  costDefaults: ATcostDefaults,
  herbicides: ATherbicides,
  implements: ATimplements,
  power: ATpower,
  seedList: ATseedList,
  stateRegions: ATstateRegions,
  commodities: ATcommodities,
  eqip: ATeqip,
  erosionControl: ATerosionControl,
};
`;
    store.dispatch(set.airTables(airTables));
    loaded();
  }
}; // loadAirtables

export const queue = (f, time = 1) => {
  setTimeout(f, (queue.i += 1) * time);
  setTimeout(() => {
    queue.i = 0;
  }, time + 999);
};
queue.i = 0;

const tables = [
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
];

if (dev) {
  loadAirtables(tables);
} else {
  loaded();
}

export const test = (key, result) => {
  let value = get[key]?.(store.getState())?.toString();
  if (value !== result.toString()) {
    value = store.getState();

    key.split('.').forEach((k) => {
      value = value[k];
    });

    if (value?.toString() !== result.toString()) {
      // I'd prefer console.error, but that requires showing all react_devtools_backend.js
      console.log(`ERROR: ${key} should be ${result} instead of ${value}`);
      // console.log(get[key]?.(store.getState()));
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
    if (key === '$labor') {
      store.dispatch(set.$labor(db.rates?.skilled?.value));
    } else if (key === '$diesel') {
      store.dispatch(set.$diesel(db.rates?.fuel?.value));
    } else if (!exclude.includes(key)) {
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

export const exampleAdditional = () => {
  exampleSeeds();
  store.dispatch(set.map.address({ stateCode: 'GA' }));
  store.dispatch(set.additional.$landowner(200));
  store.dispatch(set.additional.nrcs('Yes'));
  store.dispatch(set.additional.$carbonOffset(150));
  store.dispatch(set.additional.$insuranceDiscount(500));

  test('additional.$costShare', 63.01);
  test('additional.total', 913.01);
}; // exampleAdditional

export const exampleGrazing = () => {
  store.dispatch(set.grazing.grazing('Yes'));
  store.dispatch(set.grazing.lease('No'));
  store.dispatch(set.grazing.fall(500));
  store.dispatch(set.grazing.spring(1000));
  store.dispatch(set.grazing.$hay(80));
  store.dispatch(set.grazing.hoursAcre(0.05));
  store.dispatch(set.$labor(20));
  store.dispatch(set.$diesel(3));
}; // exampleGrazing

export const exampleHome = () => {
  store.dispatch(set.location('123 Main Street, Athens, GA, USA'));
  store.dispatch(set.farm('My farm'));
  store.dispatch(set.field('My field'));
  store.dispatch(set.mapFeatures.area(123));
  store.dispatch(set.field('My field'));
  store.dispatch(set.cashCrop('Corn'));
  store.dispatch(set.map.lat(33.9347));
  store.dispatch(set.map.lon(-83.3157));
  store.dispatch(set.mapFeatures.zoom(13));
}; // exampleHome

export const exampleField = () => {
  store.dispatch(set.location('123 Main Street, Athens, GA, USA'));
  store.dispatch(set.farm('My farm'));
  store.dispatch(set.field('My field'));
  store.dispatch(set.mapFeatures.area(123));
  store.dispatch(set.field('My field'));
  store.dispatch(set.cashCrop('Corn'));
  store.dispatch(set.map.lat(33.9347));
  store.dispatch(set.map.lon(-83.3157));
  store.dispatch(set.mapFeatures.zoom(13));
}; // exampleField

if (/demo/i.test(window.location)) {
  exampleField();
  exampleErosion();
  examplePlanting();
  exampleSeedbed();
  exampleSeeds();
  exampleGrazing();
  exampleHerbicides();
  exampleTermination1();
  exampleTermination2();
  exampleTermination3();
  exampleTermination4();
  exampleTermination5();
  exampleTillage1();
  exampleTillage2();
  exampleTillage3();
  exampleTillage4();
  exampleTillage5();
  exampleFertilityBenefit();
  exampleFertilityCost();
  exampleYield1();
  exampleYield2();
}

export const mobile = !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 800;