import {Input} from './Inputs';

import {useSelector} from 'react-redux';
import {get, dollars} from '../store/store';

const Activity = ({type, ds = 'implement'}) => {
  const state           = useSelector(get[type]);
  const estimated       = state.estimated;
  const tot             = state.total;
  const edited          = estimated !== tot;
  const imp             = state[ds];
  const ImplementsCost  = state.implementsCost;
  const PowerCost       = state.powerCost;
  const coverCropTotal  = useSelector(get.coverCropTotal) || 0;
  const seedbedTotal    = useSelector(get.seedbed).total || 0;
  const plantingTotal   = useSelector(get.planting).total || 0;
  const fertilityTotal  = useSelector(get.fertility).total || 0;
  const state3          = useSelector(get[type]).q3;

  const heading = {
    seedbed: 'Seedbed Preparation',
    planting: 'Cover Crop Planting',
  }[type];
  
  const Costs = ({desc}) => {
    const d = desc.replace('Storage shed', 'Storage');

    const val = state[d];

    const iCost = state.$implements[d];
    const pCost = state.$power[d];
    const total = '$' + (iCost + pCost).toFixed(2);

    const style = !val ? {background: '#ddd', color: '#888'}  : {};

    return (
      <tr style={style}>
        <td>
          <label>
            <Input
              id={type + '.' + d}
              type="checkbox"
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

  let breakdown;

  if (/species|fertility/.test(type)) {
    breakdown = '';
  } else {
    let cname = type;
    if (!ImplementsCost) {
      cname += ' noImplementCost';
    }

    if (!PowerCost) {
      cname += ' noPowerCost';
    }

    breakdown = (
                  state3 !== 'Custom Operator' &&
                  imp &&
                  !edited
                ) && (
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
                    id={type + '.implementsCost'}
                    type="checkbox"
                  />
                </label>
              </th>
              <th>
                <label>
                  Power Cost<br/>($/acre)
                  <br/>
                  <Input
                    id={type + '.powerCost'}
                    type="checkbox"
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
              <td>{'$' + state.$implements.total.toFixed(2)}</td>
              <td>{'$' + state.$power.total.toFixed(2)}</td>
              <td>{'$' + (state.$implements.total + state.$power.total).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
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