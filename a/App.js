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
import Store, {db} from './components/Store';

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

    let acresHour;

    const implementCost = (desc) => {
      if (parms[type + 'ImplementCost'] === 'false') {
        return 0;
      }

      let result;

      if (data[desc]) {
        result = +data[desc];
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
               desc === 'Fuel'  ? (power['Fuel'] * (1 + +db.rates.lubrication.value)) * db.rates.fuel.value / acresHour :
                                  power[desc] / acresHour;
  
      return result;
    } // powerCost
  
    const totalCost = (desc) => {
      return (implementCost(desc) || 0) + (powerCost(desc) || 0);
    } // totalCost
  
    const relevantCost = (desc) => {
      return parms[type + desc] === 'true' ? totalCost(desc) : 0;
    } // relevantCost

    const ds = /Chemical/.test(otype) ? otype.match(/[A-Z][a-z]+/)[0] : 4;
    const data = db.implements[parms[type + ds]];

    if (!data) {
      return;
    }

    const powerUnit = parms[type + 'Power'] || data['default power unit'];

    const power = db.power[powerUnit] || {};

    set[type + 'AnnualUseAcres'](Math.round(data['acres/year']));
    set[type + 'AnnualUseHours'](power['expected use (hr/yr)']);

    acresHour  = (+data['acres/hour']).toFixed(1);
    set[type + 'AcresHour'](acresHour);

    const totalRelevantCost = () => (
      relevantCost('Labor') +
      relevantCost('Fuel') +
      relevantCost('Depreciation') +
      relevantCost('Interest') + 
      relevantCost('Repairs') + 
      relevantCost('Taxes') + 
      relevantCost('Insurance') + 
      relevantCost('Storage')
    ); // totalRelevantCost

    const costdb = {
      seedbed: 'Seedbed preparation',
      planting: 'Planting'
    }[type];

    const total = parms[type + 3] === 'Self' ? totalRelevantCost(type).toFixed(2) : db.costDefaults[costdb].cost;

    console.log(implementCost('Depreciation'), powerCost('Depreciation'), parms[type + 'Power'], type + 'Power');

    set[type + 'Estimated'](total);
    set[type + 'Total'](total);

    if (type === 'termination') {
      const terminationUnitCost = dbvalue('herbicides', parms.terminationProduct, 'Cost ($)'); // done
      const terminationRate     = dbvalue('herbicides', parms.terminationProduct, 'Rate');     // done

      switch (otype) {
        case 'terminationProduct' :
          set.terminationUnitCost(terminationUnitCost);
          set.terminationUnit    (dbvalue('herbicides', parms.terminationProduct, 'Unit (cost)'));
          set.terminationRate    (terminationRate);
          set.terminationRateUnit(dbvalue('herbicides', parms.terminationProduct, 'Unit (rate)'));
          break;
        case 'terminationUnitCost' :
        case 'terminationRate' :
          set.terminationProductCost((terminationUnitCost * terminationRate).toFixed(2));
          break;
        case 'terminationRoller' :
          set.terminationRollerCost(total);
          break;
        default: ;
      }
    }
  } // updateCosts

  const testSeedbed = () => {
    if (parms.seedbed1 === 'No' || parms.seedbed2 === 'Yes') {
      set.seedbed4('');
      set.seedbedTotal(0);
      set.screen('Planting');
      set.previousScreen('Planting');
    }
  } // testSeedbed

  const testTermination = () => {
    if (parms.termination2 === 'Yes') {
      set.screen('Tillage');
      set.previousScreen('Tillage');
    }
  } // testTermination

  const dbvalue = (table, key, parm) => {
    return db[table][key] ? db[table][key][parm] : '';
  } // dbvalue

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
      species                 : [],
      rates                   : [],
      prices                  : [],
      coverCropTotal          : 0,
      USDARegion              : '',
      
      seedbed1                : '', // 'Yes',
      seedbed2                : 'No',
      seedbed3                : 'Self',
      seedbed4                : '',  // 'Chisel Plow; 37 Ft'
      seedbed7                : '',
      
      planting3               : 'Self',
      planting4               : '',
      planting7               : '',

      termination2            : 'No', // 'No',
      termination3            : 'Self', // 'Self'
      terminationMethod       : '', // 'Herbicide application'
      terminationProduct      : '', // 'liberty'
      terminationUnitCost     : '',
      terminationUnit         : '',
      terminationRate         : '',
      terminationRateUnit     : '',
      terminationProductCost  : '',
      terminationCustomCost   : '',
      terminationChemical     : '',
      terminationChemicalCost : '',
      terminationRoller       : '',
      terminationRollerCost   : '',
      terminationTillage      : '',
      terminationTillageCost  : '',
      terminationTillagePower : '',
      terminationTillageAnnualUseAcres : '',
      terminationTillageAnnualUseHours : '',
      terminationTillageAcresHour : '',
      terminationTillageTotal : '',

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

      terminationLabor           : 'true',
      terminationFuel            : 'true',
      terminationDepreciation    : 'true',
      terminationInterest        : 'true',
      terminationRepairs         : 'true',
      terminationTaxes           : 'true',
      terminationInsurance       : 'true',
      terminationStorage         : 'true',
      terminationImplementCost   : 'true',
      terminationPowerCost       : 'true',
      terminationPower           : '',
      terminationAnnualUseAcres  : 0,
      terminationAnnualUseHours  : 0,
      terminationAcresHour       : 0,
      terminationEstimated       : 0,
      terminationTotal           : 0,
      terminationTillage4        : 0,
      
      farm                       : '',
      acres                      : '',
      description                : '',
      priorCrop                  : '',
      otherPriorCrop             : '',
      cashCrop                   : '',
      otherCashCrop              : '',
      labor                      : '',
      previousScreen             : 'Home',
      effects: {
        species                 : updateSpeciesTotal,
        rates                   : updateSpeciesTotal,
        prices                  : updateSpeciesTotal,

        seedbed1                : testSeedbed,
        seedbed2                : testSeedbed,

        seedbed4                : updateCosts,
        planting4               : updateCosts,

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

        termination2            : testTermination,
        terminationLabor        : updateCosts,
        terminationFuel         : updateCosts,
        terminationDepreciation : updateCosts,
        terminationInterest     : updateCosts,
        terminationRepairs      : updateCosts,
        terminationTaxes        : updateCosts,
        terminationInsurance    : updateCosts,
        terminationStorage      : updateCosts,
        terminationPower        : updateCosts,
        terminationImplementCost: updateCosts,
        terminationPowerCost    : updateCosts,

        terminationMethod       : updateCosts,
        terminationProduct      : updateCosts,
        terminationUnitCost     : updateCosts,
        terminationRate         : updateCosts,
        terminationRoller       : updateCosts,
        terminationTillage4     : updateCosts,

      }
    }
  );

  return (
    <Store>
      <Screens set={set} db={db} parms={parms} props={props} />
    </Store>
  );
} // App

document.title = 'Econ DST';

export default App;
