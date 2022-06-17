import {Input} from './Inputs';

import {useSelector} from 'react-redux';
import {get, dollars} from '../store/store';

const Activity = ({type, ds = 'implement'}) => {
  const state             = useSelector(get[type]);
  const estimated         = state.estimated;
  const tot               = state.total;
  const edited            = estimated !== tot;
  const imp               = state[ds];
  const ImplementsCost    = state.implementsCost;
  const PowerCost         = state.powerCost;
  const coverCropTotal    = useSelector(get.coverCropTotal) || 0;
  const seedbedTotal      = useSelector(get.seedbed.total) || 0;
  const plantingTotal     = useSelector(get.planting.total) || 0;
  const fertilityTotal    = useSelector(get.fertility.total) || 0;

  const productCost       = useSelector(get.termination.productCost) || 0;
  const chemicalTotal     = useSelector(get.chemical.total) || 0;
  const rollerTotal       = useSelector(get.roller.total) || 0;
  const tillageTotal      = useSelector(get.tillage.total) || 0;
  const terminationTotal  = productCost + chemicalTotal + rollerTotal + tillageTotal;

  const state3            = useSelector(get[type]).q3;

  const heading = {
    seedbed:      'Seedbed Preparation',
    planting:     'Cover Crop Planting',
    chemical:     'Chemical Spray',
    roller:       'Roller',
    tillage:      'Tillage',
    termination:  'Termination total',
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

  const total = +coverCropTotal + +seedbedTotal + +plantingTotal + +fertilityTotal + +terminationTotal;

  const summary = (
    total > 0 &&
    <table id="Summary">
      <caption>Summary of Expenses</caption>
      <thead>
        <tr><th>Description</th><th>Expense</th></tr>
      </thead>
      <tbody>
        <SummaryRow parm={coverCropTotal}   desc="Cover crop seed" />
        <SummaryRow parm={seedbedTotal}     desc="Seedbed preparation" />
        <SummaryRow parm={plantingTotal}    desc="Planting activity" />
        <SummaryRow parm={fertilityTotal}   desc="Fertility" />

        {
          false && terminationTotal > 0 &&
          <>
            <tr><th colSpan="100">Termination</th></tr>
            <SummaryRow parm={chemicalTotal}    desc="Chemical" />
            <SummaryRow parm={rollerTotal}      desc="Roller" />
            <SummaryRow parm={tillageTotal}     desc="Tillage" />
            <SummaryRow parm={productCost}      desc="Product cost" />
          </>
        }
        {
          true && terminationTotal > 0 &&
          <>
            <SummaryRow parm={terminationTotal} desc="Termination" />
          </>
        }
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