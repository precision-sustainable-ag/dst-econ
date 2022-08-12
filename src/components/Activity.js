import {Input} from './Inputs';

import {useSelector} from 'react-redux';
import {get, dollars} from '../store/store';

const Activity = ({type, instructions=true}) => {
  const state             = useSelector(get[type]);
  const estimated         = state.estimated;
  const tot               = state.total;
  const edited            = estimated !== tot;
  const imp               = state.implement;
  const ImplementsCost    = state.implementsCost;
  const PowerCost         = state.powerCost;

  const state3            = useSelector(get[type]).q3;

  const heading = {
    seedbed:      'Seedbed Preparation',
    planting:     'Cover Crop Planting',
    chemical:     'Chemical Spray',
    roller:       'Roller',
    tillage:      'Tillage',
    termination:  'Termination total',
    tillage1:     'Fall tillage',
    tillage2:     'Other tillage',
    tillage3:     'Cover crop tillage',
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
                  (state3 !== 'Custom Operator' && imp !== 'Hire custom operator') &&
                  imp &&
                  !edited
                ) && (
      <>
        {
          instructions &&
          <p>
            Farmers view costs differently, so the table below allows the user to customize the cost estimation to fit their needs.
            The default cost estimation assumes all ownership and variable costs are relevant.
            However, some farmers will want to focus on the cash costs of fuel and labor.
            Removing the check from the box would allow such an analysis.
            Others would want to ignore all costs that definitely do not change with use so they would uncheck the boxes for interest, taxes, insurance and shed.
            Basically, the costs you want to count toward the cost of cover crops should have a checkmark beside it.
            If you are not concerned with certain costs, remove the checkmark.
          </p>
        }
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
      </>
    )
  }

  return breakdown;
} // Activity

export const Summary = () => {
  const coverCropTotal    = useSelector(get.coverCropTotal) || 0;
  const seedbedTotal      = useSelector(get.seedbed.total) || 0;
  const plantingTotal     = useSelector(get.planting.total) || 0;
  const fertilityTotal    = -useSelector(get.fertility.total) || 0;
  const erosionTotal      = -useSelector(get.erosion.total) || 0;
  const productCost       = useSelector(get.termination.productCost) || 0;
  const chemicalTotal     = useSelector(get.chemical.total) || 0;
  const rollerTotal       = useSelector(get.roller.total) || 0;
  const tillageTotal      = useSelector(get.tillage.total) || 0;
  const herbicideTotal    = (useSelector(get.termination.additionalTotal) || 0) - (useSelector(get.termination.reducedTotal) || 0);
  const terminationTotal  = productCost + chemicalTotal + rollerTotal + tillageTotal + herbicideTotal;
  const tillageAllTotal   = useSelector(get.tillageAll.total) || 0;
  const yieldTotal        = useSelector(get.yield.total) || 0;
  const total = +coverCropTotal + +seedbedTotal + +plantingTotal + +fertilityTotal + +erosionTotal + +terminationTotal + +tillageAllTotal + +yieldTotal;

  const SummaryRow = ({parm, desc, type}) => {
    if (
      (type === 'Costs'    && parm > 0) ||
      (type === 'Benefits' && parm < 0)
    ) {
      return <tr><td>{desc}</td><td>{dollars(Math.abs(parm))}</td></tr>;
    } else {
      return null;
    }
  } // SummaryRow

  const CostsBenefits = ({type}) => {
    // console.log({type, coverCropTotal, seedbedTotal, plantingTotal, fertilityTotal, erosionTotal, terminationTotal, tillageAllTotal, yieldTotal});
    if (
      (type === 'Costs'    && (coverCropTotal > 0 || seedbedTotal > 0 || plantingTotal > 0 || fertilityTotal > 0 || erosionTotal > 0 || terminationTotal > 0 || tillageAllTotal > 0 || yieldTotal > 0)) ||
      (type === 'Benefits' && (coverCropTotal < 0 || seedbedTotal < 0 || plantingTotal < 0 || fertilityTotal < 0 || erosionTotal < 0 || terminationTotal < 0 || tillageAllTotal < 0 || yieldTotal < 0))
    ) {
      return (
        <>
          <thead>
            <tr><th>Description</th><th>{type}</th></tr>
          </thead>
          <tbody>
            <SummaryRow type={type} parm={coverCropTotal}   desc="Seed expense" />
            <SummaryRow type={type} parm={seedbedTotal}     desc="Seed bed preparation" />
            <SummaryRow type={type} parm={plantingTotal}    desc="Planting" />
            <SummaryRow type={type} parm={terminationTotal} desc="Termination" />
            <SummaryRow type={type} parm={tillageAllTotal}  desc="Tillage" />
            <SummaryRow type={type} parm={fertilityTotal}   desc="Fertility" />
            <SummaryRow type={type} parm={erosionTotal}     desc="Erosion" />
            <SummaryRow type={type} parm={yieldTotal}       desc="Yield" />
          </tbody>
        </>
      )
    }
  }; // CostsBenefits

  const farm      = useSelector(get.farm);
  const field     = useSelector(get.field);
  const acres     = useSelector(get.acres);
  const cashCrop  = useSelector(get.cashCrop);

  return (
    (total || farm || field || acres || cashCrop) && (
      <table id="Summary">
        <caption>Summary</caption>
        {(farm || field || acres || cashCrop) && (
          <>
            <thead></thead>
            <tbody>
              {farm     && <tr><td>Farm     </td><td>{farm}     </td></tr>}
              {field    && <tr><td>Field    </td><td>{field}    </td></tr>}
              {acres    && <tr><td>Acres    </td><td>{acres}    </td></tr>}
              {cashCrop && <tr><td>Cash crop</td><td>{cashCrop} </td></tr>}
            </tbody>
          </>
        )}
        <CostsBenefits type="Costs" />
        <CostsBenefits type="Benefits" />
        {total ? (
          <tfoot>
            <tr><td>Total</td><td>{dollars(total)}</td></tr>
          </tfoot>
        ) : null}
      </table>
    )
  );
} // Summary

export default Activity;
