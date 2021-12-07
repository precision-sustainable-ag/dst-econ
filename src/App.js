// npm i --no-optional

// https://itnext.io/fixing-security-vulnerabilities-in-npm-dependencies-in-less-than-3-mins-a53af735261d
// npm i minimist --save-dev
// "resolutions": {
//   "minimist": "^1.2.5"
// }
// "scripts": {
//   "preinstall": "npx npm-force-resolutions"
// }
// npm i

// TODO: autofocus map
// TODO: Inputs.js for everything
// TODO: Google Maps already loaded outside @googlemaps/js-api-loader.
// TODO: Editable crops/prices
// TODO: https://wlazarus.cfans.umn.edu/william-f-lazarus-farm-machinery-management
// TODO: MACHDATA
// TODO: Plant Data Service:  Disregard, build own

// WAIT: Soil Erosion Control
// WAIT: Additional Considerations

// DONE: material-ui -> mui
// DONE: Don't autofill
// DONE: npm install warnings
// DONE: npm audit warnings
// DONE: Autocomplete height
// DONE: Next to Resources, Back should be Revenue Impact
// DONE: Warning: Cannot update a component (`App`) while rendering a different component (`Screens`).

import React from 'react';
import './App.css';
import {Screens} from './components/Navigation';
import {defaults} from './defaults';

const App = () => {
  const updateSpeciesTotal = () => {
    let total = 0;
    parms.species.forEach((s, n) => {
      if (s) {
        total += (+parms.rates[n] || 0) * (+parms.prices[n] || 0)
      }
    });
    set.coverCropTotal(total);
  } // updateSpeciesTotal

  const updateCosts = (otype) => {
    const type = otype.match(/[a-z]+/g)[0];

    let data;
    let power;
    let acresHour;

    const implementCost = (desc, lookup) => {
      let result;

      if (data[lookup]) {
        result = +data[lookup];
      } else {
        result = 0;
      }
  
      if (desc === 'Labor') {
        result *= db.rates.skilled.value;
      }

      return result;
    } // implementCost
  
    const powerCost = (desc) => {
      let result;
  
      result = desc === 'Labor' ? 0 :
               desc === 'Fuel'  ? (power['Fuel (gal/hour)'] * (1 + +db.rates.lubrication.value)) * db.rates.fuel.value / acresHour :
                                  power[desc + ' ($/hour)'] / acresHour;
  
      return result;
    } // powerCost
  
    const totalCost = (desc, lookup) => {
      return (implementCost(desc, lookup) || 0) + (powerCost(desc, lookup) || 0);
    } // totalCost
  
    const relevantCost = (desc, lookup) => {
      return parms[type + desc] === 'true' ? totalCost(desc, lookup) : 0;
    } // relevantCost

    data = db[type][parms[type + 4]];

    if (!data) {
      return;
    }

    const powerUnit = parms[type + 'Power'] || data['Default Power Unit'];
    
    power = db.power[powerUnit] || {};

    set[type + 'AnnualUseAcres'](Math.round(data['Acres/year']));
    set[type + 'AnnualUseHours'](power['Expected Use (Hr/yr)']);

    acresHour  = (+data['Acres/hour']).toFixed(1);
    set[type + 'AcresHour'](acresHour);

    const totalRelevantCost = () => (
      relevantCost('Labor',         'Labor (hr/acre)') +
      relevantCost('Fuel') +
      relevantCost('Depreciation',  'Depreciation ($/acre)') + 
      relevantCost('Interest',      'Interest ($/acre)') + 
      relevantCost('Repairs',       'Repair ($/acre)') + 
      relevantCost('Taxes',         'Taxes ($/acre)') + 
      relevantCost('Insurance',     'Insurance ($/acre)') + 
      relevantCost('Storage',       'Shed ($/acre)')
    ); // totalRelevantCost

    const costdb = {
      seedbed: 'Seedbed preparation',
      planting: 'Planting'
    }[type];

    const total = parms[type + 3] === 'Self' ? totalRelevantCost(type).toFixed(2) : db.costDefaults[costdb].cost;

    set[type + 'Estimated'](total);
    set[type + 'Total'](total);
  } // updateCosts

  const testSeedbed = () => {
    if (parms.seedbed1 === 'No' || parms.seedbed2 === 'Yes') {
      set.seedbed4('');
      set.seedbedTotal(0);
      set.screen('Planting');
      set.previousScreen('Planting');
    }
  } // testSeedbed

  const powerUnits = (parm) => {
    try {
      const type = parm.replace('4', '');
      const value = parms[parm];

      const data = db[type][value] || {};
      const powerUnit = data['Default Power Unit']; //.match(/\d+/)[0];
      set[type + 'Total'](0);  // clear override so it can be recalculated
      set[type + 'Power'](powerUnit);
      updateCosts(type);
    } catch(ee) {
      console.log(parm, ee.message);
    }
  } // powerUnits

  const change = (parm, value, target, index) => {
    if (/(Labor|Fuel|Depreciation|Interest|Repairs|Taxes|Insurance|Storage)$/.test(parm)) {
      const type = parm.match(/[a-z]+/)
      set[type + 'Total'](0);
      set[parm](target.checked ? 'true' : 'false');
    } else if (parm === 'species') {
      set.rates(arr => {
        arr[index] = (db.seedList[value] || {}).seedingRate;
        return [...arr];
      });

      set.prices(arr => {
        arr[index] = (db.seedList[value] || {}).price;
        return [...arr];
      });
    }
  } // change

  let {parms, set, props} = defaults(
    change,
    {
      species             : [],
      rates               : [],
      prices              : [],
      coverCropTotal      : 0,
      seedbed1            : '', // 'Yes',
      seedbed2            : 'No',
      seedbed3            : 'Self',
      seedbed4            : '',  // 'Chisel Plow; 37 Ft'
      seedbed7            : '',
      planting3           : 'Self',
      planting4           : '',
      planting7           : '',
      USDARegion          : '',
      
      seedbedLabor        : 'true',
      seedbedFuel         : 'true',
      seedbedDepreciation : 'true',
      seedbedInterest     : 'true',
      seedbedRepairs      : 'true',
      seedbedTaxes        : 'true',
      seedbedInsurance    : 'true',
      seedbedStorage      : 'true',
      seedbedPower        : '',
      seedbedAnnualUseAcres    : 0,
      seedbedAnnualUseHours    : 0,
      seedbedAcresHour         : 0,
      seedbedEstimated    : 0,
      seedbedTotal        : 0,
      
      plantingLabor       : 'true',
      plantingFuel        : 'true',
      plantingDepreciation: 'true',
      plantingInterest    : 'true',
      plantingRepairs     : 'true',
      plantingTaxes       : 'true',
      plantingInsurance   : 'true',
      plantingStorage     : 'true',
      plantingPower       : '',
      plantingAnnualUseAcres   : 0,
      plantingAnnualUseHours   : 0,
      plantingAcresHour        : 0,
      plantingEstimated   : 0,
      plantingTotal       : 0,
      
      farm                : '',
      acres               : '',
      description         : 'hp',
      priorCrop           : '',
      otherPriorCrop      : '',
      cashCrop            : '',
      otherCashCrop       : '',
      labor               : '',
      previousScreen      : 'Home',
      effects: {
        species             : updateSpeciesTotal,
        rates               : updateSpeciesTotal,
        prices              : updateSpeciesTotal,

        seedbed1            : testSeedbed,
        seedbed2            : testSeedbed,

        seedbed4            : powerUnits,
        planting4           : powerUnits,

        seedbedLabor        : updateCosts,
        seedbedFuel         : updateCosts,
        seedbedDepreciation : updateCosts,
        seedbedInterest     : updateCosts,
        seedbedRepairs      : updateCosts,
        seedbedTaxes        : updateCosts,
        seedbedInsurance    : updateCosts,
        seedbedStorage      : updateCosts,
        seedbedPower        : updateCosts,
        
        plantingLabor       : updateCosts,
        plantingFuel        : updateCosts,
        plantingDepreciation: updateCosts,
        plantingInterest    : updateCosts,
        plantingRepairs     : updateCosts,
        plantingTaxes       : updateCosts,
        plantingInsurance   : updateCosts,
        plantingStorage     : updateCosts,
        plantingPower       : updateCosts,
      }
    }
  );

  return (
    <Screens set={set} db={db} parms={parms} props={props} />
  );
} // App

document.title = 'Econ DST';

// const holdError = console.error;
// console.error = (msg, ...subst) => {
//   if (!/You provided a/.test(msg)) {
//     holdError(msg, ...subst)
//   }
// }

const loadData = async(table) => {
  const alias = (col) => {
    // 'Typical Seeding Rate (lb/ac) [seedingRate]' becomes 'seedingRate'
    return col.includes('[') ? col.split(/[[\]]/)[1] : col;
  }

  db[table] = {};

  let response = await fetch(`https://api.airtable.com/v0/appRBt6oxz1E9v2F4/${table}?api_key=keySO0dHQzGVaSZp2`);
  let rec = await response.json();

  const data = rec.records.map(r => r.fields);

  data.forEach(rec => {
    const cols = Object.keys(rec);
    const obj = db[table][rec.key] = {};
    cols.forEach(col => {
      obj[alias(col)] = rec[col];
    });
  });

  // console.log(db[table]);
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
