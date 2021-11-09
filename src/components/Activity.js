import {Autocomplete, Input} from './Inputs';

const dollars = (n) => isFinite(n) ? '$' + (+n).toFixed(2) : '';

const Activity = ({db, parms, props, type}) => {
  let breakdown;

  if (type === 'species') {
    breakdown = '';
  } else {
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
  
    data = db[type][parms[type + 4]] || {};

    const powerUnit = data['Default Power Unit'];
    
    power = db.power[powerUnit] || {};

    const annualUseAcres  = Math.round(data['Acres/year']);

    const annualUseHours  = power['Expected Use (Hr/yr)'];

    acresHour  = (+data['Acres/hour']).toFixed(1);

    const totalImplementCost = (type) => (
      implementCost('Labor',         'Labor (hr/acre)') +
      implementCost('Depreciation',  'Depreciation ($/acre)') + 
      implementCost('Interest',      'Interest ($/acre)') + 
      implementCost('Repairs',       'Repair ($/acre)') + 
      implementCost('Taxes',         'Taxes ($/acre)') + 
      implementCost('Insurance',     'Insurance ($/acre)') + 
      implementCost('Storage',       'Shed ($/acre)')
    ); // totalImplementCost

    const totalPowerCost = (type) => (
      powerCost('Fuel') +
      powerCost('Depreciation') + 
      powerCost('Interest') + 
      powerCost('Repairs') + 
      powerCost('Taxes') + 
      powerCost('Insurance') +
      powerCost('Storage')
    ); // totalPowerCost

    const relativeCost = () => (
      relevantCost('Labor',         'Labor (hr/acre)') +
      relevantCost('Fuel') +
      relevantCost('Depreciation',  'Depreciation ($/acre)') + 
      relevantCost('Interest',      'Interest ($/acre)') + 
      relevantCost('Repairs',       'Repair ($/acre)') + 
      relevantCost('Taxes',         'Taxes ($/acre)') + 
      relevantCost('Insurance',     'Insurance ($/acre)') + 
      relevantCost('Storage',       'Shed ($/acre)')
    ); // relativeCost

    const heading = {
      seedbed: 'Seedbed Preparation',
      planting: 'Cover Crop Planting',
    }[type];
    
    const Costs = ({desc, lookup}) => {
      const d = desc.replace('Storage shed', 'Storage');
      const iCost = implementCost(d, lookup);
      const pCost = powerCost(d, lookup);
      const total    = '$' + totalCost(d, lookup).toFixed(2);
      const relevant = '$' + relevantCost(d, lookup).toFixed(2);
  
      const style = parms[`${type}${d}`] === 'false' ? {background: '#ddd', color: '#888'}  : {};
  
      return (
        <tr style={style}>
          <td>
            <label><input {...props(`${type}${d}`)} type="checkbox" /> {desc}</label>
          </td>
          <td>{iCost ? '$' + iCost.toFixed(2) : ''}</td>
          <td>{pCost ? '$' + pCost.toFixed(2) : ''}</td>
          <td>{total}</td>
          <td>{relevant}</td>
        </tr>
      )
    } // Costs

    breakdown = parms[type + 4] &&
      <div className={type}>
        <table id="Activity">
          <thead>
            <tr>
              <th rowSpan="2">Activity</th>
              <th colSpan="2">{heading}</th>
              <th className="hidden"></th>
            </tr>
            <tr>
              <th className="hidden">d</th>
              <th>Implement</th><th>Power</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Implement Used</td>
              <td>
                <Autocomplete
                  {...props(type + '4')}
                  options={Object.keys(db[type])}
                />
              </td>
              <td></td>
            </tr>

            <tr>
              <td>Power Used</td>
              <td></td>
              <td style={{whiteSpace: 'nowrap'}}>
                <Input {...props(type + 'Power')} style={{width: '5em'}}/>
                {powerUnit.replace(/\d+/, '')}
              </td>
            </tr>

            <tr>
              <td>Annual Use (acres)</td>
              <td>{annualUseAcres}</td><td></td>
            </tr>

            <tr>
              <td>Annual Use (hours)</td>
              <td></td><td>{annualUseHours}</td>
            </tr>

            <tr>
              <td>Acres/hour</td>
              <td></td><td>{acresHour}</td>
            </tr>
          </tbody>
        </table>

        <table id="Costs">
          <thead>
            <tr>
              <th rowSpan="2">Cost Description</th>
              <th colSpan="4">{heading}</th>
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
              <td>{'$' + totalImplementCost(type).toFixed(2)}</td>
              <td>{'$' + totalPowerCost(type).toFixed(2)}</td>
              <td>{'$' + (totalImplementCost(type) + totalPowerCost(type)).toFixed(2)}</td>
              <td>{'$' + relativeCost(type).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
  }

  const SummaryRow = ({parm, desc}) => (
    +parms[parm] ? <tr><td>{desc}</td><td>{dollars(parms[parm])}</td></tr> : null
  ) // SummaryRow

  const total = +parms.coverCropTotal + +parms.seedbed7 + +parms.planting7;

  const summary = (
    total > 0 &&
    <table id="Summary">
      <caption>Summary of Expenses</caption>
      <thead>
        <tr><th>Description</th><th>Expense</th></tr>
      </thead>
      <tbody>
        <SummaryRow parm="coverCropTotal" desc="Cover crop seed" />
        <SummaryRow parm="seedbed7"       desc="Seedbed preparation" />
        <SummaryRow parm="planting7"      desc="Planting activity" />
      </tbody>
      <tfoot>
        <tr><td>Total</td><td>{dollars(total)}</td></tr>
      </tfoot>
    </table>
  )

  return (
    <>
      {summary}
      {breakdown}
    </>
  )
} // Activity

export default Activity;