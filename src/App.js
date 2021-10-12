import React, {useState} from 'react';
import './App.css';
import {Screens} from './Navigation';

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

let parms = {
  help                : '',
  helpX               : 0,
  helpY               : 0,
  species             : [],
  rates               : [],
  prices              : [],
  coverCropTotal      : 0,
  seedbed1            : '', // 'Yes',
  seedbed2            : 'No',
  seedbed3            : 'Self',
  seedbed4            : '',  // 'Chisel Plow; 37 Ft'
  seedbed5            : '',
  seedbed6            : '',
  seedbed7            : '',
  planting3           : 'Self',
  planting4           : '',
  planting5           : '',
  planting6           : '',
  planting7           : '',
  lat                 : 40.7849,
  lng                 : -74.8073,
  mapZoom             : 13,
  mapType             : 'hybrid',
  location            : '',
  state               : '',
  USDARegion          : '',
  
  seedbedLabor        : 'true',
  seedbedFuel         : 'true',
  seedbedDepreciation : 'true',
  seedbedInterest     : 'true',
  seedbedRepairs      : 'true',
  seedbedTaxes        : 'true',
  seedbedInsurance    : 'true',
  seedbedStorage      : 'true',
  seedbedPower        : '15',
  
  plantingLabor       : 'true',
  plantingFuel        : 'true',
  plantingDepreciation: 'true',
  plantingInterest    : 'true',
  plantingRepairs     : 'true',
  plantingTaxes       : 'true',
  plantingInsurance   : 'true',
  plantingStorage     : 'true',
  plantingPower       : '',
  
  includeLabor        : 'true',
  includeFuel         : 'true',
  includeDepreciation : 'true',
  includeInterest     : 'true',
  includeRepairs      : 'true',
  includeTaxes        : 'true',
  includeInsurance    : 'true',
  includeStorage      : 'true',
  farm                : '',
  acres               : '',
  description         : '',
  priorCrop           : '',
  otherPriorCrop      : '',
  cashCrop            : '',
  otherCashCrop       : '',
  labor               : '',
  previousScreen      : 'Home',
}

const ps = (s) => ({
  id: s,
  name: s,
  value: parms[s],
  checked: parms[s] === 'true',
  /*
    Handle change events for Material-UI components that don't bubble, such as Autocomplete and Select.
    MUI is incredibly inconsistent in its event handlers.
    For example:
      Here's the Autocomplete onChange callback: function(event: React.SyntheticEvent, value: T | Array<T>, reason: string, details?: string)
      Here's the Select onChange callback:       function(event: SelectChangeEvent<T>, child?: object)
  */
  onChange: ({target}, value) => {
    try {
      const id = (target.id || target.name).split('-')[0];  // Autocomplete adds a hyphen and extra text to the ID
      console.log(id, value);
      sets[id](value);
    } catch(ee) {
      console.log(target);
    }
  }
});

const sets = {};

document.title = 'Econ DST';

const holdError = console.error;
console.error = (msg, ...subst) => {
  if (!/You provided a/.test(msg)) {
    holdError(msg, ...subst)
  }
}

const loadData = async(table) => {
  const alias = (col) => {
    // 'Typical Seeding Rate (lb/ac) [seedingRate]' becomes 'seedingRate'
    return col.includes('[') ? col.split(/[[\]]/)[1] : col;
  }

  db[table] = {};

  let response = await fetch(`https://api.airtable.com/v0/appRBt6oxz1E9v2F4/${table}?api_key=keySO0dHQzGVaSZp2`);
  let rec = await response.json();

  const data = rec.records.map(r => r.fields);
  const cols = Object.keys(data[0]);

  data.forEach(rec => {
    const obj = db[table][rec.key] = {};
    cols.forEach(col => {
      obj[alias(col)] = rec[col];
    });
  });

  console.log(db[table]);
} // loadData

const db = {};

loadData('coefficients');
loadData('power');
loadData('seedList');
loadData('costDefaults');
loadData('rates');
loadData('stateRegions');
loadData('seedbed');
loadData('planting');
loadData('cropMaint');
loadData('harvest');

export default App;
