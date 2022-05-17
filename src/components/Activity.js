import {Input} from './Inputs';

import {useSelector, useDispatch} from 'react-redux';
import {get, set, dollars, implementCost, powerCost, totalCost, totalRelevantCost} from '../store/store';

const Activity = ({type, ds = 'q4'}) => {
  const dispatch = useDispatch();
  const state           = useSelector(get[type]);

  const edited          = state.edited;
  const imp             = state[ds];
  const ImplementCost   = state.implementCost;
  const PowerCost       = state.powerCost;
  const Labor           = state.Labor;
  const Fuel            = state.Fuel;
  const Depreciation    = state.Depreciation;
  const Interest        = state.Interest;
  const Repairs         = state.Repairs;
  const Taxes           = state.Taxes;
  const Insurance       = state.Insurance;
  const Storage         = state.Storage;
  const coverCropTotal  = useSelector(get.coverCropTotal) || 0;
  const seedbedTotal    = useSelector(get.seedbed).total;
  const plantingTotal   = useSelector(get.planting).total;
  const fertilityTotal  = useSelector(get.fertility).total;
  const state3          = useSelector(get[type]).q3;

  const totalImplementCost = () => {
    return (
      (Labor        || 0) * implementCost('Labor') +
      (Depreciation || 0) * implementCost('Depreciation') + 
      (Interest     || 0) * implementCost('Interest') + 
      (Repairs      || 0) * implementCost('Repairs') + 
      (Taxes        || 0) * implementCost('Taxes') + 
      (Insurance    || 0) * implementCost('Insurance') + 
      (Storage      || 0) * implementCost('Storage')
    );
  }; // totalImplementCost

  const totalPowerCost = () => (
    (Fuel         || 0) * powerCost('Fuel') +
    (Depreciation || 0) * powerCost('Depreciation') + 
    (Interest     || 0) * powerCost('Interest') + 
    (Repairs      || 0) * powerCost('Repairs') +
    (Taxes        || 0) * powerCost('Taxes') + 
    (Insurance    || 0) * powerCost('Insurance') +
    (Storage      || 0) * powerCost('Storage')
  ); // totalPowerCost

  const heading = {
    seedbed: 'Seedbed Preparation',
    planting: 'Cover Crop Planting',
  }[type];
  
  const Costs = ({desc, lookup}) => {
    const d = desc.replace('Storage shed', 'Storage');

    const val = state[d];

    const iCost = implementCost(d, lookup);
    const pCost = powerCost(d, lookup);
    const total = '$' + totalCost(d, lookup).toFixed(2);

    const style = !val ? {background: '#ddd', color: '#888'}  : {};

    return (
      <tr style={style}>
        <td>
          <label>
            <Input
              id={type}
              property={d}
              type="checkbox"
              onChange={() => dispatch(set[type]({property: 'total', value: totalRelevantCost()}))}
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

  // useEffect(() => { // TODO
  //   if (Object.keys(data).length) {    
  //     change('change', type + 'Estimated', totalImplementCost(type) + totalPowerCost(type));
  //     if (!state[type + 'Total']) {
  //       change('change', type + 'Total', totalImplementCost(type) + totalPowerCost(type));
  //     }
  //   }
  // });

  let breakdown;

  if (/species|fertility/.test(type)) {
    breakdown = '';
  } else {
    let cname = type;
    if (!ImplementCost) {
      cname += ' noImplementCost';
    }

    if (!PowerCost) {
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
                  state3 !== 'Custom Operator' &&
                  imp &&
                  !edited
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
                    id={type}
                    property={'implementCost'}
                    type="checkbox"
                    onChange={() => {
                      console.log(totalRelevantCost());
                      dispatch(set[type]({property: 'total', value: totalRelevantCost()}))
                    }}
                  />
                </label>
              </th>
              <th>
                <label>
                  Power Cost<br/>($/acre)
                  <br/>
                  <Input
                    id={type}
                    property={'powerCost'}
                    type="checkbox"
                    onChange={() => dispatch(set[type]({property: 'total', value: totalRelevantCost()}))}
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

  const SummaryRow = ({parm, desc}) => {
    return parm ? <tr><td>{desc}</td><td>{dollars(parm)}</td></tr> : null;
  } // SummaryRow

  const total = +coverCropTotal + +seedbedTotal + +plantingTotal + +fertilityTotal;

  const summary = (
    total > 0 &&
    <table id="Summary">
      <caption>Summary of Expenses</caption>
      <thead>
        <tr><th>Description</th><th>Expense</th></tr>
      </thead>
      <tbody>
        <SummaryRow parm={coverCropTotal} desc="Cover crop seed" />
        <SummaryRow parm={seedbedTotal}   desc="Seedbed preparation" />
        <SummaryRow parm={plantingTotal}  desc="Planting activity" />
        <SummaryRow parm={fertilityTotal} desc="Fertility" />
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