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
            <th colSpan="2">Seedbed preparation</th>
          </tr>
          <Logic
            id="T1"
            q="Will you do cover crop seedbed preparation prior to planting the cover crop?"
            a={['Yes', 'No']}
            parms={parms}
            ps={ps}
          />

          <Logic
            id="T2"
            q="Would you do this field activity if not planting a cover crop?"
            a={['Yes', 'No']}
            parms={parms}
            cond={parms.T1 === 'Yes'}
            ps={ps}
          />

          <Logic
            id="T3"
            q="Who will do this activity?"
            a={['Self', 'Custom Operator']}
            parms={parms}
            cond={parms.T1 === 'Yes' && parms.T2 === 'No'}
            ps={ps}
          />

          <Logic
            id="T4"
            q="What type of seedbed preparation will be done?"
            a={['', ...Object.keys(db.tillage)]}
            parms={parms}
            cond={parms.T1 === 'Yes' && parms.T2 === 'No' && parms.T3 === 'Self'}
            ps={ps}
          />

          <Logic
            id="T5"
            q={parms.T3 === 'Self' ? 'Estimated relevant cost ($/acre)' : 'Estimated custom cost ($/acre)'}
            a={T5}
            parms={parms}
            cond={parms.T1 === 'Yes' && parms.T2 === 'No'}
            ps={ps}
          />

          <Logic
            id="T6"
            q="Cost override"
            a={'number'}
            parms={parms}
            cond={parms.T1 === 'Yes' && parms.T2 === 'No'}
            ps={ps}
          />

          <Logic
            id="T7"
            q={parms.T2 === 'Yes' ? 'There is no cost associated with cover crop seedbed preparation.' : 'Cost of seedbed preparation necessary for cover cropping.'}
            a={T7}
            parms={parms}
            ps={ps}
          />

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

      <table id="Activity" className={classes}>
        <thead>
          <tr>
            <th rowSpan="2">Activity</th>
            <th colSpan="2">Tillage</th>
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
            <th colSpan="4">Tillage</th>
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
} // Planting

export default Planting;