import Activity from './Activity';

const Logic = ({q, a, id, cond=true, ps, parms}) => {
  return (
    <>
      {cond && 
        <tr className={id}>
          <td>{q}</td>
          <td>
            {
              a instanceof Array ?
                a.length < 3 ? 
                <>
                  {
                    a.map(a => (
                      <label key={a}>
                        <input key={a} type="radio" name={id} id={id} value={a} checked={a === parms[id]}/>{a}
                        <br/>
                      </label>
                    ))
                  }
                </>
                :
                <select {...ps(id)} >
                  {a.map(a => <option key={a}>{a}</option>)}
                </select> 
              :
              a === 'number' ?
                <input {...ps(id)} /> :
              isFinite(a) ? 
                '$' + (+a).toFixed(2)
              :
                ''
            }
          </td>
        </tr>
      }
    </>
  )
} // Logic

const Planting = ({setScreen, db, parms, ps, sets}) => {
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

  const powerCost = (type, desc, lookup) => {
    if (type === 'planting') {
      return desc === 'Labor' ? 0 :
             desc === 'Fuel'  ? (power[type]['Fuel (gal/hour)'] * (1 + +db.rates.lubrication.value)) * db.rates.fuel.value / plantingAcresHour:
                                 power[type][desc + ' ($/hour)'] / plantingAcresHour;
    } else {
      return desc === 'Labor' ? 0 :
             desc === 'Fuel'  ? (power[type]['Fuel (gal/hour)'] * (1 + +db.rates.lubrication.value)) * db.rates.fuel.value / tillageAcresHour:
                                 power[type][desc + ' ($/hour)'] / tillageAcresHour;
    }
  } // powerCost

  const totalCost = (type, desc, lookup) => {
    return (implementCost(type, desc, lookup) || 0) + (powerCost(type, desc, lookup) || 0);
  } // totalCost

  const relevantCost = (type, desc, lookup) => {
    return parms['include' + desc] ? totalCost(type, desc, lookup) : 0;
  } // relevantCost

  const Costs = ({desc, lookup}) => {
    const d = desc.replace('Repairs', 'Repair').replace('Storage shed', 'Shed');
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

    return (
      <tr>
        <td>{desc}</td>
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

    return (
      <tr>
        <td>{desc}</td>
        {
          ['tillage', 'planting'].map(type => {
            const iCost = implementCost(type, d, lookup);
            const pCost = powerCost(type, d, lookup);
        
            const total    = '$' + totalCost(type, d, lookup).toFixed(2);
            const relevant = '$' + relevantCost(type, d, lookup).toFixed(2);
        
            return (
              <>
                <td>{iCost ? '$' + iCost.toFixed(2) : ''}</td>
                <td>{pCost ? '$' + pCost.toFixed(2) : ''}</td>
                <td>{total}</td>
                <td>{relevant}</td>
              </>
            )
          })
        }
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
    implementCost(type, 'Repair',        'Repair ($/acre)') + 
    implementCost(type, 'Taxes',         'Taxes ($/acre)') + 
    implementCost(type, 'Insurance',     'Insurance ($/acre)') + 
    implementCost(type, 'Shed',          'Shed ($/acre)')
  ); // totalImplementCost

  const totalPowerCost = (type) => (
    powerCost(type, 'Fuel',          '') +
    powerCost(type, 'Depreciation',  'Depreciation ($/acre)') + 
    powerCost(type, 'Interest',      'Interest ($/acre)') + 
    powerCost(type, 'Repair',        'Repair ($/acre)') + 
    powerCost(type, 'Taxes',         'Taxes ($/acre)') + 
    powerCost(type, 'Insurance',     'Insurance ($/acre)') + 
    powerCost(type, 'Shed',          'Shed ($/acre)')
  ); // totalPowerCost

  const relativeCost = (type) => (
    relevantCost(type, 'Labor',         'Labor (hr/acre)') +
    relevantCost(type, 'Fuel',          '') +
    relevantCost(type, 'Depreciation',  'Depreciation ($/acre)') + 
    relevantCost(type, 'Interest',      'Interest ($/acre)') + 
    relevantCost(type, 'Repair',        'Repair ($/acre)') + 
    relevantCost(type, 'Taxes',         'Taxes ($/acre)') + 
    relevantCost(type, 'Insurance',     'Insurance ($/acre)') + 
    relevantCost(type, 'Shed',          'Shed ($/acre)')
  ); // relativeCost

  const T5 = parms.T3 === 'Self' ? relativeCost('tillage').toFixed(2) : db.costDefaults['Seedbed preparation'].cost;
  const T7 = parms.T1 === 'No' || parms.T2 === 'Yes' ? 0 : parms.T6 || T5;

  const P5 = parms.P3 === 'Self' ? relativeCost('planting').toFixed(2) : db.costDefaults['Planting'].cost;
  const P7 = parms.P6 || P5;

  return (
    <div className="Planting">
      <h1>Economic Decision Aid for Cover Crops: Planting Decisions</h1>
      <div id="About">
        Decisions surrounding cover crop decisions require understanding how they will be impacted by the prior cash crop.
        Only activities that are incurred because a cover crop is planted are charged to the cover crop.
        If you were going to do the activity without planting a cover crop, its cost is not considered a cost of growing the cover crop.
      </div>
      <hr/>

      <strong>Cover Crop Establishment</strong>
      <table>
        <tbody>
          <tr>
            <th colSpan="2">Planting</th>
          </tr>

          <Logic
            id="P3"
            q="Who will do this activity?"
            a={['Self', 'Custom Operator']}
            parms={parms}
            ps={ps}
          />

          <Logic
            id="P4"
            q="What type of seedbed preparation will be done?"
            a={['', ...Object.keys(db.planting)]}
            parms={parms}
            ps={ps}
            cond={parms.P3 === 'Self'}
          />

          <Logic
            id="P5"
            q={parms.P3 === 'Self' ? 'Estimated relevant cost ($/acre)' : 'Estimated custom cost ($/acre)'}
            a={P5}
            parms={parms}
            ps={ps}
          />

          <Logic
            id="P6"
            q="Cost override"
            a={'number'}
            parms={parms}
            ps={ps}
          />

          <Logic
            id="P7"
            q="Cost of planting activity necessary for cover cropping."
            a={P7}
            parms={parms}
            ps={ps}
          />

          <Logic
            id="Total"
            q="Total cost of seedbed preparation and planting ($/acre)"
            a={(+T7 + +P7).toFixed(2)}
            parms={parms}
            ps={ps}
          />

        </tbody>
      </table>
      
      <hr/>
      <div>
        <button onClick={() => setScreen('Seedbed') }>Back</button>
      </div>
      <hr/>

      <Activity db={db} parms={parms} ps={ps} />
    </div>
  )
} // Planting

Planting.menu = 'Planting decisions';


export default Planting;