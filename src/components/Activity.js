import {useEffect} from 'react';
import {useStore} from '../store/Store';

import {Input} from './Inputs';

const dollars = (n) => isFinite(n) ? '$' + (+n).toFixed(2) : '';

const Activity = ({type, ds = 4}) => {
  const {state, change, db} = useStore();

  let data;
  let power;
  let acresHour;

  const implementCost = (desc) => {
    if (!state[type + 'ImplementCost']) {
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
    if (desc === 'Labor' || !state[type + 'PowerCost']) {
      return 0;
    }

    let result;

    result = desc === 'Labor' ? 0 :
             desc === 'Fuel'  ? (power['Fuel'] * (1 + +db.rates.lubrication.value)) * db.rates.fuel.value / acresHour :
                                power[desc] / acresHour;
    
    if (!result) {
      // console.log(desc, power[desc], acresHour)
      // console.log(power);
    }
    return result;
  } // powerCost

  const totalCost = (desc) => {
    return (implementCost(desc) || 0) + (powerCost(desc) || 0);
  } // totalCost
/*  
  const relevantCost = (desc, lookup) => {
    return state[type + desc] ? totalCost(desc, lookup) : 0;
  } // relevantCost
*/  
  data = db.implements[state[type + ds]] || {};

  const powerUnit = state[type + 'Power'] || data['default power unit'];
  power = db.power[powerUnit] || {};

  acresHour  = (+data['acres/hour']).toFixed(1);

  const totalImplementCost = () => {
    return (
      (state[type + 'Labor']        || 0) * implementCost('Labor') +
      (state[type + 'Depreciation'] || 0) * implementCost('Depreciation') + 
      (state[type + 'Interest']     || 0) * implementCost('Interest') + 
      (state[type + 'Repairs']      || 0) * implementCost('Repairs') + 
      (state[type + 'Taxes']        || 0) * implementCost('Taxes') + 
      (state[type + 'Insurance']    || 0) * implementCost('Insurance') + 
      (state[type + 'Storage']      || 0) * implementCost('Storage')
    );
  }; // totalImplementCost

  const totalPowerCost = () => (
    (state[type + 'Fuel']         || 0) * powerCost('Fuel') +
    (state[type + 'Depreciation'] || 0) * powerCost('Depreciation') + 
    (state[type + 'Interest']     || 0) * powerCost('Interest') + 
    (state[type + 'Repairs']      || 0) * powerCost('Repairs') +
    (state[type + 'Taxes']        || 0) * powerCost('Taxes') + 
    (state[type + 'Insurance']    || 0) * powerCost('Insurance') +
    (state[type + 'Storage']      || 0) * powerCost('Storage')
  ); // totalPowerCost

  // console.log(data);
  // console.log(totalImplementCost());
  // console.log(totalPowerCost());
  
  const heading = {
    seedbed: 'Seedbed Preparation',
    planting: 'Cover Crop Planting',
  }[type];
  
  const Costs = ({desc, lookup}) => {
    const d = desc.replace('Storage shed', 'Storage');
    const iCost = implementCost(d, lookup);
    const pCost = powerCost(d, lookup);
    const total    = '$' + totalCost(d, lookup).toFixed(2);

    const style = !state[`${type}${d}`] ? {background: '#ddd', color: '#888'}  : {};

    return (
      <tr style={style}>
        <td>
          <label>
            <Input
              id={type + d}
              type="checkbox"
              defaultChecked
              onInput={() => change('change', type + 'Total', '')}
            />
            {desc}
          </label>
        </td>
        <td>{iCost ? '$' + iCost.toFixed(2) : ''}</td>
        <td>{pCost ? '$' + pCost.toFixed(2) : ''}</td>
        <td>{total}</td>
      </tr>
    )
  } // Costs

  useEffect(() => {
    if (Object.keys(data).length) {    
      change('change', type + 'Estimated', totalImplementCost(type) + totalPowerCost(type));
      if (!state[type + 'Total']) {
        change('change', type + 'Total', totalImplementCost(type) + totalPowerCost(type));
      }
    }
  });
    
  let breakdown;

  if (type === 'species') {
    breakdown = '';
  } else {
    let cname = type;
    if (!state[`${type}ImplementCost`]) {
      cname += ' noImplementCost';
    }

    if (!state[`${type}PowerCost`]) {
      cname += ' noPowerCost';
    }

    // useEffect(() => {
    //   if (Object.keys(data).length) {    
    //     change('change', type + 'Estimated', totalImplementCost(type) + totalPowerCost(type), true);
    //     if (!state[type + 'Total']) {
    //       change('change', type + 'Total', totalImplementCost(type) + totalPowerCost(type), true);
    //     }
    //   }
    // });

    breakdown = ((
                  state[type + 3] !== 'Custom Operator' &&
                  state[type + ds] &&
                  !state[type + 'Edited']
                )) &&
      <div className={cname} id="Breakdown">
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
              <th>
                <label>
                  Implement Cost<br/>($/acre)
                  <br/>
                  <Input
                    id={type + 'ImplementCost'}
                    type="checkbox"
                    defaultChecked
                    onInput={() => change('change', type + 'Total', '')}
                  />
                </label>
              </th>
              <th>
                <label>
                  Power Cost<br/>($/acre)
                  <br/>
                  <Input
                    id={type + 'PowerCost'}
                    type="checkbox"
                    defaultChecked
                    onInput={() => change('change', type + 'Total', '')}
                  />
                </label>
              </th>
              <th>Relevant Cost<br/>($/acre)</th>
            </tr>
          </thead>
          <tbody>
            <Costs desc="Labor"        lookup="Labor" />
            <Costs desc="Fuel"         lookup=""/>
            <Costs desc="Depreciation" lookup="Depreciation"/>
            <Costs desc="Interest"     lookup="Interest"/>
            <Costs desc="Repairs"      lookup="Repairs"/>
            <Costs desc="Taxes"        lookup="Taxes"/>
            <Costs desc="Insurance"    lookup="Insurance"/>
            <Costs desc="Storage shed" lookup="Storage"/>
            <tr className="total">
              <td>Total</td>
              <td>{'$' + totalImplementCost(type).toFixed(2)}</td>
              <td>{'$' + totalPowerCost(type).toFixed(2)}</td>
              <td>{'$' + (totalImplementCost(type) + totalPowerCost(type)).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
  }

  const SummaryRow = ({parm, desc}) => (
    +state[parm] ? <tr><td>{desc}</td><td>{dollars(state[parm])}</td></tr> : null
  ) // SummaryRow

  const total = +(state.coverCropTotal || 0) + +(state.seedbedTotal || 0) + +(state.plantingTotal || 0);

  const summary = (
    total > 0 &&
    <table id="Summary">
      <caption>Summary of Expenses</caption>
      <thead>
        <tr><th>Description</th><th>Expense</th></tr>
      </thead>
      <tbody>
        <SummaryRow parm="coverCropTotal" desc="Cover crop seed" />
        <SummaryRow parm="seedbedTotal"   desc="Seedbed preparation" />
        <SummaryRow parm="plantingTotal"  desc="Planting activity" />
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