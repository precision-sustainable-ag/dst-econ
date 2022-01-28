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
      if (parms[type + 'ImplementCost'] === 'false') {
        return 0;
      }

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
      if (parms[type + 'PowerCost'] === 'false') {
        return 0;
      }

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

    data = db.implements[parms[type + 4]];

    if (!data) {
      return;
    }

    const powerUnit = parms[type + 'Power'] || data['default power unit'];

    power = db.power[powerUnit] || {};

    set[type + 'AnnualUseAcres'](Math.round(data['acres/year']));
    set[type + 'AnnualUseHours'](power['Expected Use (Hr/yr)']);

    acresHour  = (+data['acres/hour']).toFixed(1);
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

      const data = db.implements[value] || {};

      const powerUnit = data['default power unit']; //.match(/\d+/)[0];
      set[type + 'Total'](0);  // clear override so it can be recalculated
      set[type + 'Power'](powerUnit);
      updateCosts(type);
    } catch(ee) {
      console.log(parm, ee.message);
    }
  } // powerUnits

  const dbvalue = (table, key, parm) => {
    return db[table][key] ? db[table][key][parm] : '';
  } // dbvalue

  const updateTermination = (otype) => {
    switch (otype) {
      case 'terminationMethod' :
        break;
      case 'terminationProduct' :
        set.terminationUnitCost(dbvalue('herbicides', parms.terminationProduct, 'Cost ($)'));
        set.terminationUnit    (dbvalue('herbicides', parms.terminationProduct, 'Unit (cost)'));
        set.terminationRate    (dbvalue('herbicides', parms.terminationProduct, 'Rate'));
        set.terminationRateUnit(dbvalue('herbicides', parms.terminationProduct, 'Unit (rate)'));
        break;
      case 'terminationUnitCost' :
        set.terminationProductCost((parms.terminationUnitCost * parms.terminationRate).toFixed(2));
        break;
      case 'terminationRate' :
        set.terminationProductCost((parms.terminationUnitCost * parms.terminationRate).toFixed(2));
        break;
      default: ;
    }
  } // updateTermination

  const change = (parm, value, target, index) => {
    if (/(Labor|Fuel|Depreciation|Interest|Repairs|Taxes|Insurance|Storage|ImplementCost|PowerCost)$/.test(parm)) {
      const type = parm.match(/[a-z]+/)
      set[type + 'Total'](0);
      set[parm](target.checked ? 'true' : 'false');
    } else if (parm === 'species') {
      set.species(arr => {
        arr[index] = value;
        return [...arr];
      });

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
      USDARegion          : '',
      
      seedbed1            : '', // 'Yes',
      seedbed2            : 'No',
      seedbed3            : 'Self',
      seedbed4            : '',  // 'Chisel Plow; 37 Ft'
      seedbed7            : '',
      
      planting3           : 'Self',
      planting4           : '',
      planting7           : '',

      termination2        : 'No', // 'No',
      termination3        : 'Self', // 'Self'
      terminationMethod   : 'Herbicide application', // 'Herbicide application'
      terminationProduct  : 'liberty', // 'liberty'
      terminationUnitCost : '',
      terminationUnit     : '',
      terminationRate     : '',
      terminationRateUnit : '',
      terminationProductCost : '',
      terminationCustomCost  : '',
      terminationChemicalEquipment : '',
      
      seedbedLabor            : 'true',
      seedbedFuel             : 'true',
      seedbedDepreciation     : 'true',
      seedbedInterest         : 'true',
      seedbedRepairs          : 'true',
      seedbedTaxes            : 'true',
      seedbedInsurance        : 'true',
      seedbedStorage          : 'true',
      seedbedImplementCost    : 'true',
      seedbedPowerCost        : 'true',
      seedbedPower            : '',
      seedbedAnnualUseAcres   : 0,
      seedbedAnnualUseHours   : 0,
      seedbedAcresHour        : 0,
      seedbedEstimated        : 0,
      seedbedTotal            : 0,
      
      plantingLabor           : 'true',
      plantingFuel            : 'true',
      plantingDepreciation    : 'true',
      plantingInterest        : 'true',
      plantingRepairs         : 'true',
      plantingTaxes           : 'true',
      plantingInsurance       : 'true',
      plantingStorage         : 'true',
      plantingImplementCost   : 'true',
      plantingPowerCost       : 'true',
      plantingPower           : '',
      plantingAnnualUseAcres  : 0,
      plantingAnnualUseHours  : 0,
      plantingAcresHour       : 0,
      plantingEstimated       : 0,
      plantingTotal           : 0,
      
      farm                : '',
      acres               : '',
      description         : '',
      priorCrop           : '',
      otherPriorCrop      : '',
      cashCrop            : '',
      otherCashCrop       : '',
      labor               : '',
      previousScreen      : 'Home',
      effects: {
        species                 : updateSpeciesTotal,
        rates                   : updateSpeciesTotal,
        prices                  : updateSpeciesTotal,

        seedbed1                : testSeedbed,
        seedbed2                : testSeedbed,

        seedbed4                : powerUnits,
        planting4               : powerUnits,

        seedbedLabor            : updateCosts,
        seedbedFuel             : updateCosts,
        seedbedDepreciation     : updateCosts,
        seedbedInterest         : updateCosts,
        seedbedRepairs          : updateCosts,
        seedbedTaxes            : updateCosts,
        seedbedInsurance        : updateCosts,
        seedbedStorage          : updateCosts,
        seedbedPower            : updateCosts,
        seedbedImplementCost    : updateCosts,
        seedbedPowerCost        : updateCosts,
        
        plantingLabor           : updateCosts,
        plantingFuel            : updateCosts,
        plantingDepreciation    : updateCosts,
        plantingInterest        : updateCosts,
        plantingRepairs         : updateCosts,
        plantingTaxes           : updateCosts,
        plantingInsurance       : updateCosts,
        plantingStorage         : updateCosts,
        plantingPower           : updateCosts,
        plantingImplementCost   : updateCosts,
        plantingPowerCost       : updateCosts,

        terminationMethod       : updateTermination,
        terminationProduct      : updateTermination,
        terminationUnitCost     : updateTermination,
        terminationRate         : updateTermination,
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

  if (table === 'implements') {
    Object.keys(db.implements).forEach(key => {
      const c = db.implements[key];
      c.RF1 = db.coefficients[c['defaulty ASABE category']].RF1;
      c.RF2 = db.coefficients[c['defaulty ASABE category']].RF2;
      c.RV1 = db.coefficients[c['defaulty ASABE category']].RV1;
      c.RV2 = db.coefficients[c['defaulty ASABE category']].RV2;
      c.RV3 = db.coefficients[c['defaulty ASABE category']].RV3;
      c.RV4 = db.coefficients[c['defaulty ASABE category']].RV4;
      c.RV5 = db.coefficients[c['defaulty ASABE category']].RV5;

      c['tradein%'] = (c.RV1 - c.RV2 * c['expected life (years)'] ** 0.5 - c.RV3 * c['expected use (hr/yr)'] ** 0.5 + c.RV4 * db.rates.projected.value) ** 2 + 0.25 * c.RV5;
      c['listprice'] = c['purchase price 2020'] / (1 - c['list discount']);
      c['tradein$'] = c['tradein%'] * c['listprice'];
      c['annualdepreciation'] = (c['purchase price 2020'] - c['tradein$']) / c['expected life (years)'];
      c['accumulatedrepairs'] = c['listprice'] * (c.RF1 * (c['expected life (years)'] * c['expected use (hr/yr)'] / 1000) ** c.RF2);
      c['annualrepairs'] = c['accumulatedrepairs'] / c['expected life (years)'];
      c['acres/hour'] = c.size1 * c['field speed (m/h)'] * c['field efficiency'] / db.rates.conversion.value;
      c['acres/year'] = c['acres/hour'] * c['expected use (hr/yr)'];
      c['depreciation'] = c['annualdepreciation'] / c['acres/year'];
      c['interest'] = (c['purchase price 2020'] + c['tradein$'] + c['annualdepreciation']) / 2 * db.rates.interest.value / c['acres/year'];
      c['repair'] = c['annualrepairs'] / c['acres/year'];
      c['taxes'] = (c['purchase price 2020'] + c['tradein$'] + c['annualdepreciation']) / 2 * db.rates.property.value / c['acres/year'];
      c['insurance'] = (c['purchase price 2020'] + c['tradein$'] + c['annualdepreciation']) / 2 * db.rates.insurance.value / c['acres/year'];
      c['labor'] = (c['tractor (hr/impl)'] * c['labor (hr/trac)']) / c['acres/hour'];
      c['shed$'] = db.rates.storage.value * c['shed (ft^2)'] / c['acres/year'];
      // console.log(key);
      // console.log(c);
    });

    console.log(db.implements);
  }
} // loadData

const db = {};

loadData('coefficients');
loadData('power');
loadData('seedList');
loadData('costDefaults');
loadData('rates');
loadData('stateRegions');
loadData('herbicides');
loadData('implements');

export default App;
