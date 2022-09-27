import {Input} from './Inputs';

import {useSelector} from 'react-redux';
import {get, dollars} from '../store/store';

import {CardContent, Icon, Card} from '@mui/material';
import {makeStyles} from '@mui/styles';
import Draggable from 'react-draggable';

const useStyles = makeStyles({
  root: {
    boxShadow: '2px 3px rgba(20, 20, 20, 0.7)',
  }
});

const Instructions = () => (
  <>
    <p>
      Farmers view costs differently, so this table allows the user to customize the cost estimation to fit their needs.
      The default cost estimation assumes all ownership and variable costs are relevant.
      However, some farmers will want to focus on the cash costs of fuel and labor.
      Removing the check from the box would allow such an analysis.
      Others would want to ignore all costs that definitely do not change with use so they would uncheck the boxes for interest, taxes, insurance and shed.
    </p>
    <p>
      Basically, the costs you want to count toward the cost of cover crops should have a checkmark beside it.
      If you are not concerned with certain costs, remove the checkmark.
    </p>
  </>
) // Instructions

const Activity = ({type}) => {
  const width             = useSelector(get.screenWidth);
  const screenHeight      = useSelector(get.screenHeight);
  const focused           = useSelector(get.focused);
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
              tabIndex={-1}
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

  let cname = type;
  if (!ImplementsCost) {
    cname += ' noImplementCost';
  }

  if (!PowerCost) {
    cname += ' noPowerCost';
  }

  let style;
  const onMap = width > 1400;

  if (/annualUse/.test(focused) || (onMap && /implement|power/.test(focused))) {
    const rect = document.querySelector(`[id="${focused.split('.')[0]}.annualUseAcres"]`)?.getBoundingClientRect();

    if (rect) {
      let top = onMap ? rect.y - 120 : rect.y - 20;
    
      if (top + 480 > screenHeight) {
        top = Math.max(0, screenHeight - 480);
      }

      style = {
        position: 'absolute',
        left: onMap ? 'calc(900px + 4vw)' : rect.x + rect.width + 20,
        top: top,
        zIndex: 1,
        whiteSpace: 'nowrap',
      }
    }
  }

  breakdown = (
    (state3 !== 'Custom Operator' && imp !== 'Hire custom operator') &&
      imp &&
      !edited
    ) && (
    <>
      {
        style && (
          <Draggable>
            <div
              className={cname}
              id="Breakdown"
              style={style}
            >
              <Card style={{background: '#f8f8f8'}}>
                <CardContent>
                  <table id="Costs">
                    <thead>
                      <tr>
                        <th rowSpan="2" style={{verticalAlign: 'bottom'}}>
                          Cost Description
                          <Icon>
                            help
                            <Instructions/>
                          </Icon>
                        </th>
                        <th colSpan="4">{heading}</th>
                        <th className="hidden"></th>
                        <th className="hidden"></th>
                        <th className="hidden"></th>
                      </tr>
                      <tr>
                        <th className="hidden"></th>
                        <th>
                          <label>
                            Implement<br/>Cost<br/>($/acre)
                            <br/>
                            <Input
                              id={type + '.implementsCost'}
                              type="checkbox"
                              tabIndex={-1}
                            />
                          </label>
                        </th>
                        <th>
                          <label>
                            Power<br/>Cost<br/>($/acre)
                            <br/>
                            <Input
                              id={type + '.powerCost'}
                              type="checkbox"
                              tabIndex={-1}
                            />
                          </label>
                        </th>
                        <th>Relevant<br/>Cost<br/>($/acre)</th>
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

                </CardContent>
              </Card>
            </div>
          </Draggable>
        )
      }
    </>
  );

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
  const yieldTotal        = -useSelector(get.yield.total) || 0;
  const total = +coverCropTotal + +seedbedTotal + +plantingTotal + +fertilityTotal + +erosionTotal + +terminationTotal + +tillageAllTotal + +yieldTotal;

  const SummaryRow = ({parm, desc, type}) => {
    const style = type === 'Costs' ? {color: 'red'} : {color: 'black'};

    if (
      (type === 'Costs'    && parm > 0) ||
      (type === 'Benefits' && parm < 0)
    ) {
      return (
        <tr>
          <td>{desc}</td>
          <td style={style}>{dollars(Math.abs(parm))}</td>
        </tr>
      );
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

  const style = total > 0 ? {color: 'red'} : {color: 'black'};
  const classes = useStyles();

  return (
    (total || farm || field || acres || cashCrop) && (
      <div>
        <Draggable handle="strong">
          <Card variant="outlined" className={classes.root} style={{backgroundColor: '#eee'}}>
            <CardContent>
              <div id="Summary">
                <strong className="cursor">Summary</strong>
                <table>
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
                      <tr>
                        <td>Total</td>
                        <td style={style}>{dollars(Math.abs(total))}</td>
                      </tr>
                    </tfoot>
                  ) : null}
                </table>
              </div>
            </CardContent>
          </Card>
        </Draggable>          
      </div>
    )
  );
} // Summary

export default Activity;
