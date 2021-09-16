import React, {useEffect, useState} from 'react';
import './App.css';

import {Screens} from './Navigation';

// Tables
import counties           from './counties';
import regions            from './regions';
import seedList           from './seedlist';
import costDefaults       from './costDefaults';
import fertilizerProducts from './fertilizerProducts';
import herbicides         from './herbicides';
import expenseTypes       from './expenseTypes';
import rates              from './rates';
import coefficients       from './coefficients';
import power              from './power';
import stateRegions       from './stateRegions';
import { tillage, planting, cropMaint, harvest} from './implement';

const App = () => {
  // can't do useState in a loop unless it's in a component, even if that component is unused
  const State = (parm, value) => {
    [parms[parm], sets[parm]] = React.useState(value);
  }

  let setSpecies;
  [parms.species, setSpecies] = useState([]);

  let setRate;
  [parms.rates, setRate] = useState([]);

  let setPrice;
  [parms.prices, setPrice] = useState([]);

  for (const [parm, value] of Object.entries(parms)) {
    if (Array.isArray(value)) {

    } else {
      State(parm, value);
    }
  }

  return (
    <div>
      <Screens sets={sets} db={db} parms={parms} setSpecies={setSpecies} setRate={setRate} setPrice={setPrice} ps={ps} />
    </div>
  );
} // App

const countiesTable = (key, data) => {
  const obj = db[key];

  counties.trim().split(/[\n\r]+/).slice(1).forEach(data => {
    data = data.split('\t');
    obj[data[0] + ' ' + data[1]] = {
      county: data[0],
      state: data[1],
      code: data[2]
    }
  });
} // countiesTable

const toTable = (key, data, n = 0) => {
  db[key] = {};
  const obj = db[key];

  data = data.trim().split(/[\n\r]+/).map(d => d.trim().split('\t'));
  const cols = data[0].map(col => alias[key][col] || col);

  data.slice(1).forEach(data => {
    obj[data[n]] = {};

    cols.slice(1).forEach((col, i) => {
      obj[data[n]][col] = data[i + 1];
    })
  });
} // toTable

const alias = {
  'regions': {
    'Cover Crop Region': 'coverCrop',
    'USDA Crop Production Region': 'usda'
  },
  'seedList': {
    'Typical Seeding Rate (lb/ac)': 'seedingRate',
    'Estimated Price ($/lb)': 'price',
    'Legume?': 'legume',
    'N credit': 'NCredit',
    'Erosion benefit': 'erosion'
  },
  'costDefaults': {
    'Defaults': 'defaults',
    '$/acre': 'cost'
  },
  'fertilizerProducts': {
    '$/unit nutrient': 'cost',
  },
  'herbicides': {
    'Rate': 'rate',
    'Unit (rate)': 'unitRate',
    'Cost/unit': 	'cost',
    'Unit (cost)': 'unitCost'
  },
  'expenseTypes': {
    'Cash': 'cash',
    'non-cash': 'nonCash'
  },
  'rates': {
    'Value': 'value'
  },
  'coefficients': {

  },
  'power': {

  },
  'stateRegions': {

  },
  'tillage': {
    ImplName: 'name',
    ImplDescription: 'description'
  },
  'planting': {
    ImplName: 'name',
    ImplDescription: 'description'
  },
  'cropMaint': {
    ImplName: 'name',
    ImplDescription: 'description'
  },
  'harvest': {
    ImplName: 'name',
    ImplDescription: 'description'
  },
}

const db = {
  // counties,
  regions,
  seedList,
  costDefaults,
  fertilizerProducts,
  herbicides,
  expenseTypes,
  rates,
  coefficients,
  power,
  tillage,
  planting,
  cropMaint,
  harvest,
  stateRegions,
}

Object.keys(db).forEach(key => {
  if (/tillage|planting|cropMaint|harvest/.test(key)) {
    toTable(key, db[key], 5);
  } else if (/power/.test(key)) {
    toTable(key, db[key], 2);
    console.log(db.power);
  } else {
    toTable(key, db[key]);
  }
});

// toTable('regions', regions);
// toTable('seedList', seedList);
// toTable('costDefaults', costDefaults);
// toTable('fertilizerProducts', fertilizerProducts);
// toTable('herbicides', herbicides);
// toTable('expenseTypes', expenseTypes);
// toTable('rates', rates);
// toTable('tillage', tillage);


let parms = {
  help                : '',
  helpX               : 0,
  helpY               : 0,
  species             : [],
  rates               : [],
  prices              : [],
  T1                  : '',
  T2                  : 'No',
  T3                  : 'Self',
  T4                  : '',
  T5                  : '',
  T6                  : '',
  T7                  : '',
  P3                  : 'Self',
  P4                  : '',
  P5                  : '',
  P6                  : '',
  P7                  : '',
  lat                 : 40.7849,
  lng                 : -74.8073,
  mapZoom             : 13,
  mapType             : 'hybrid',
  location            : '',
  state               : '',
  USDARegion          : '',
  includeLabor        : 'true',
  includeFuel         : 'true',
  includeDepreciation : 'true',
  includeInterest     : 'true',
  includeRepairs      : 'true',
  includeTaxes        : 'true',
  includeInsurance    : 'true',
  includeStorage      : 'true',
}

const ps = (s) => ({
  id: s,
  value: parms[s],
  checked: parms[s] === 'true'
});

const sets = {};

document.title = 'Econ DST';

const holdError = console.error;
console.error = (msg, ...subst) => {
  if (!/You provided a/.test(msg)) {
    holdError(msg, ...subst)
  }
}

export default App;
