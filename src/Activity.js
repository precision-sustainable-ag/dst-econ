const Activity = ({sets, db, parms, ps}) => {
  const implementCost = (type, desc, lookup) => {
    let result = (+db[type][type === 'tillage' ? parms.T4 : parms.P4] || {})[lookup] || 0;
  
    if (type === 'tillage' && db.tillage[parms.T4]) {
      result = +db.tillage[parms.T4][lookup];
    } else if (type === 'planting' && db.planting[parms.P4]) {
      result = +db.planting[parms.P4][lookup];
    } else {
      result = 0;
    }

    if (desc === 'Labor') {
      result *= db.rates.skilled.value;
    }

    return result;
  } // implementCost

  const powerCost = (type, desc) => {
    let result;

    if (type === 'planting') {
      result = desc === 'Labor' ? 0 :
               desc === 'Fuel'  ? (power[type]['Fuel (gal/hour)'] * (1 + +db.rates.lubrication.value)) * db.rates.fuel.value / plantingAcresHour :
                                  power[type][desc + ' ($/hour)'] / plantingAcresHour;
    } else {
      result = desc === 'Labor' ? 0 :
               desc === 'Fuel'  ? (power[type]['Fuel (gal/hour)'] * (1 + +db.rates.lubrication.value)) * db.rates.fuel.value / tillageAcresHour :
                                   power[type][desc + ' ($/hour)'] / tillageAcresHour;
    }

    return result;
  } // powerCost

  const totalCost = (type, desc, lookup) => {
    return (implementCost(type, desc, lookup) || 0) + (powerCost(type, desc, lookup) || 0);
  } // totalCost

  const relevantCost = (type, desc, lookup) => {
    return parms['include' + desc] === 'true' ? totalCost(type, desc, lookup) : 0;
  } // relevantCost

  const Costs = ({desc, lookup}) => {
    const d = desc.replace('Storage shed', 'Storage');
    const iCost = {};
    const pCost = {};
    const total = {};
    const relevant = {};

    ['tillage', 'planting'].map(type => {
      iCost[type] = implementCost(type, d, lookup);
      pCost[type] = powerCost(type, d, lookup);
  
      total[type]    = '$' + totalCost(type, d, lookup).toFixed(2);
      relevant[type] = '$' + relevantCost(type, d, lookup).toFixed(2);
    });

    const style = parms[`include${d}`] === 'false' ? {background: '#ddd', color: '#888'}  : {};

    return (
      <tr style={style}>
        <td>
          <label><input {...ps(`include${d}`)} type="checkbox" /> {desc}</label>
        </td>
        <td>{iCost.tillage ? '$' + iCost.tillage.toFixed(2) : ''}</td>
        <td>{pCost.tillage ? '$' + pCost.tillage.toFixed(2) : ''}</td>
        <td>{total.tillage}</td>
        <td>{relevant.tillage}</td>

        <td>{iCost.planting ? '$' + iCost.planting.toFixed(2) : ''}</td>
        <td>{pCost.planting ? '$' + pCost.planting.toFixed(2) : ''}</td>
        <td>{total.planting}</td>
        <td>{relevant.planting}</td>
      </tr>
    )
  } // Costs

  const dtillage  = db.tillage[parms.T4] || {};
  const dplanting = db.planting[parms.P4] || {};

  let classes = '';

  if (parms.T3 === 'Self' && parms.T4) classes += ' tillage';
  if (parms.P3 === 'Self' && parms.P4) classes += ' planting';

  const tillagePowerUnit  = dtillage['Default Power Unit'];
  const plantingPowerUnit = dplanting['Default Power Unit'];
  
  const power = {
    tillage: db.power[tillagePowerUnit] || {},
    planting: db.power[plantingPowerUnit] || {}
  }

  const tillageAnnualUseAcres  = Math.round(dtillage['Acres/year']);
  const plantingAnnualUseAcres = Math.round(dplanting['Acres/year']);

  const tillageAnnualUseHours  = power.tillage['Expected Use (Hr/yr)'];
  const plantingAnnualUseHours = power.planting['Expected Use (Hr/yr)'];

  const tillageAcresHour  = (+dtillage['Acres/hour']).toFixed(1);
  const plantingAcresHour = (+dplanting['Acres/hour']).toFixed(1);

  const totalImplementCost = (type) => (
    implementCost(type, 'Labor',         'Labor (hr/acre)') +
    implementCost(type, 'Depreciation',  'Depreciation ($/acre)') + 
    implementCost(type, 'Interest',      'Interest ($/acre)') + 
    implementCost(type, 'Repairs',       'Repair ($/acre)') + 
    implementCost(type, 'Taxes',         'Taxes ($/acre)') + 
    implementCost(type, 'Insurance',     'Insurance ($/acre)') + 
    implementCost(type, 'Storage',       'Shed ($/acre)')
  ); // totalImplementCost

  const totalPowerCost = (type) => (
    powerCost(type, 'Fuel') +
    powerCost(type, 'Depreciation') + 
    powerCost(type, 'Interest') + 
    powerCost(type, 'Repairs') + 
    powerCost(type, 'Taxes') + 
    powerCost(type, 'Insurance') +
    powerCost(type, 'Storage')
  ); // totalPowerCost

  const relativeCost = (type) => (
    relevantCost(type, 'Labor',         'Labor (hr/acre)') +
    relevantCost(type, 'Fuel') +
    relevantCost(type, 'Depreciation',  'Depreciation ($/acre)') + 
    relevantCost(type, 'Interest',      'Interest ($/acre)') + 
    relevantCost(type, 'Repairs',       'Repair ($/acre)') + 
    relevantCost(type, 'Taxes',         'Taxes ($/acre)') + 
    relevantCost(type, 'Insurance',     'Insurance ($/acre)') + 
    relevantCost(type, 'Storage',       'Shed ($/acre)')
  ); // relativeCost

  const T5 = parms.T3 === 'Self' ? relativeCost('tillage').toFixed(2) : db.costDefaults['Seedbed preparation'].cost;
  sets.T5(T5);
  sets.T7(parms.T1 === 'No' || parms.T2 === 'Yes' ? 0 : parms.T6 || parms.T5);

  const P5 = parms.P3 === 'Self' ? relativeCost('planting').toFixed(2) : db.costDefaults['Planting'].cost;
  sets.P5(P5);
  sets.P7(parms.P6 || parms.P5);

  return (
    <div className="Planting">
      <table id="Activity" className={classes}>
        <thead>
          <tr>
            <th rowSpan="2">Activity</th>
            <th colSpan="2">Seedbed Preparation</th>
            <th className="hidden"></th>
            <th colSpan="2">Cover Crop Planting</th>
            <th className="hidden"></th>
          </tr>
          <tr>
            <th className="hidden">d</th>
            <th>Implement</th><th>Power</th>
            <th>Implement</th><th>Power</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Implement Used</td>
            <td>{parms.T4}</td><td></td>
            <td>{parms.P4}</td><td></td>
          </tr>

          <tr>
            <td>Power Used</td>
            <td></td><td>{tillagePowerUnit}</td>
            <td></td><td>{plantingPowerUnit}</td>
          </tr>

          <tr>
            <td>Annual Use (acres)</td>
            <td>{tillageAnnualUseAcres}</td><td></td>
            <td>{plantingAnnualUseAcres}</td><td></td>
          </tr>

          <tr>
            <td>Annual Use (hours)</td>
            <td></td><td>{tillageAnnualUseHours}</td>
            <td></td><td>{plantingAnnualUseHours}</td>
          </tr>

          <tr>
            <td>Acres/hour</td>
            <td></td><td>{tillageAcresHour}</td>
            <td></td><td>{plantingAcresHour}</td>
          </tr>
        </tbody>
      </table>

      <table id="Costs" className={classes}>
        <thead>
          <tr>
            <th rowSpan="2">Cost Description</th>
            <th colSpan="4">Seedbed Preparation</th>
            <th className="hidden"></th>
            <th className="hidden"></th>
            <th className="hidden"></th>
            <th colSpan="4">Cover Crop Planting</th>
            <th className="hidden"></th>
            <th className="hidden"></th>
            <th className="hidden"></th>
          </tr>
          <tr>
            <th className="hidden"></th>
            <th>Implement Cost<br/>($/acre)</th>
            <th>Power Cost<br/>($/acre)</th>
            <th>Actual Cost<br/>($/acre)</th>
            <th>Relevant cost<br/>($/acre)</th>

            <th>Implement Cost<br/>($/acre)</th>
            <th>Power Cost<br/>($/acre)</th>
            <th>Actual Cost<br/>($/acre)</th>
            <th>Relevant cost<br/>($/acre)</th>
          </tr>
        </thead>
        <tbody>
          <Costs desc="Labor"        lookup="Labor (hr/acre)" />
          <Costs desc="Fuel"         lookup=""/>
          <Costs desc="Depreciation" lookup="Depreciation ($/acre)"/>
          <Costs desc="Interest"     lookup="Interest ($/acre)"/>
          <Costs desc="Repairs"      lookup="Repair ($/acre)"/>
          <Costs desc="Taxes"        lookup="Taxes ($/acre)"/>
          <Costs desc="Insurance"    lookup="Insurance ($/acre)"/>
          <Costs desc="Storage shed" lookup="Shed ($/acre)"/>
          <tr>
            <td>Total</td>
            <td>{'$' + totalImplementCost('tillage').toFixed(2)}</td>
            <td>{'$' + totalPowerCost('tillage').toFixed(2)}</td>
            <td>{'$' + (totalImplementCost('tillage') + totalPowerCost('tillage')).toFixed(2)}</td>
            <td>{'$' + relativeCost('tillage').toFixed(2)}</td>

            <td>{'$' + totalImplementCost('planting').toFixed(2)}</td>
            <td>{'$' + totalPowerCost('planting').toFixed(2)}</td>
            <td>{'$' + (totalImplementCost('planting') + totalPowerCost('planting')).toFixed(2)}</td>
            <td>{'$' + relativeCost('planting').toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
} // Activity

export default Activity;