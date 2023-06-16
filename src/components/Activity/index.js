import React from 'react';
import { useSelector } from 'react-redux';
import { CardContent, Card } from '@mui/material';
import Draggable from 'react-draggable';
import { get, dollars } from '../../store/Store';
import Input from '../../shared/Inputs';
import './styles.scss';

const Costs = ({ desc, type }) => {
  const state = useSelector(get[type]);

  const d = desc.replace('Storage shed', 'Storage');

  const val = state[d];

  if (!state.$implements) {
    console.log(`${desc} missing $implements`);
    return null;
  }

  const iCost = state.$implements[d];
  const pCost = state.$power[d];
  const total = `$${(iCost + pCost).toFixed(2)}`;

  const style = !val ? { background: '#ddd', color: '#888' } : {};

  return (
    <tr style={style}>
      <td>
        <label htmlFor={`${type}.${d}`}>
          <Input
            id={`${type}.${d}`}
            type="checkbox"
            tabIndex={-1}
          />
          {desc}
        </label>
      </td>
      <td>{iCost ? `$${iCost.toFixed(2)}` : ''}</td>
      <td>{pCost ? `$${pCost.toFixed(2)}` : ''}</td>
      <td>{total}</td>
    </tr>
  );
}; // Costs

const Activity = ({ type }) => {
  const state = useSelector(get[type]) || {};
  const { estimated } = state;
  const tot = state.total;
  const edited = estimated !== tot;
  const imp = state.implement;
  const ImplementsCost = state.implementsCost;
  const PowerCost = state.powerCost;
  const state3 = useSelector(get[type]).q3;

  const heading = {
    seedbed: 'Seedbed Preparation',
    planting: 'Cover Crop Planting',
    chemical: 'Chemical Spray',
    roller: 'Roller',
    tillage: 'Tillage',
    termination: 'Termination total',
    tillageFall: 'Fall tillage',
    tillageElimination: 'Other tillage elimination',
    tillageOther: 'Cover crop tillage',
  }[type];

  let cname = type;
  if (!ImplementsCost) {
    cname += ' noImplementCost';
  }

  if (!PowerCost) {
    cname += ' noPowerCost';
  }

  let style;

  const breakdown = (
    (state3 !== 'Custom Operator' && imp !== 'Hire custom operator')
      && imp
      && !edited
  ) && (
    <div
      className={cname}
      id="Breakdown"
      style={style}
    >
      <table id="Costs">
        <thead>
          <tr>
            <th rowSpan="2" style={{ verticalAlign: 'bottom' }}>
              Cost Description
            </th>
            <th colSpan="3">{heading}</th>
          </tr>
          <tr>
            <th className="hidden">&nbsp;</th>
            <th>
              <label>
                Implement
                <br />
                Cost
                <br />
                ($/acre)
                <Input
                  id={`${type}.implementsCost`}
                  type="checkbox"
                  tabIndex={-1}
                />
              </label>
            </th>
            <th>
              <label>
                Power
                <br />
                Cost
                <br />
                ($/acre)
                <br />
                <Input
                  id={`${type}.powerCost`}
                  type="checkbox"
                  tabIndex={-1}
                />
              </label>
            </th>
            <th>
              Relevant
              <br />
              Cost
              <br />
              ($/acre)
            </th>
          </tr>
        </thead>
        <tbody>
          <Costs type={type} desc="Labor" />
          <Costs type={type} desc="Fuel" />
          <Costs type={type} desc="Depreciation" />
          <Costs type={type} desc="Interest" />
          <Costs type={type} desc="Repairs" />
          <Costs type={type} desc="Taxes" />
          <Costs type={type} desc="Insurance" />
          <Costs type={type} desc="Storage shed" />
          <tr className="total">
            <td>Total</td>
            <td>{`$${state.$implements.total.toFixed(2)}`}</td>
            <td>{`$${state.$power.total.toFixed(2)}`}</td>
            <td>{`$${(state.$implements.total + state.$power.total).toFixed(2)}`}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return breakdown;
}; // Activity

const SummaryRow = ({ parm, desc, type }) => {
  const style = type === 'Costs' ? { color: 'red' } : { color: 'black' };

  if (
    (type === 'Costs' && parm > 0)
    || (type === 'Benefits' && parm < 0)
  ) {
    return (
      <tr>
        <td>{desc}</td>
        <td style={style}>{dollars(Math.abs(parm))}</td>
      </tr>
    );
  }
  return null;
}; // SummaryRow

const CostsBenefits = ({ type }) => {
  const coverCropTotal = useSelector(get.coverCropTotal) || 0;
  const seedbedTotal = useSelector(get.seedbed.total) || 0;
  const plantingTotal = useSelector(get.planting.total) || 0;
  const terminationTotal = useSelector(get.termination.total) || 0;
  const tillageAllTotal = useSelector(get.tillageAll.total) || 0;
  const fertilityTotal = -useSelector(get.fertility.total) || 0;
  const erosionTotal = -useSelector(get.erosion.total) || 0;
  const yieldTotal = -useSelector(get.yield.total) || 0;
  const herbicideTotal = useSelector(get.herbicide.total) || 0;
  // console.log({type, coverCropTotal, seedbedTotal, plantingTotal, fertilityTotal, erosionTotal, terminationTotal, tillageAllTotal, yieldTotal});
  if (
    (type === 'Costs' && (
      coverCropTotal > 0 || seedbedTotal > 0 || plantingTotal > 0 || fertilityTotal > 0 || herbicideTotal > 0 || erosionTotal > 0
      || terminationTotal > 0 || tillageAllTotal > 0 || yieldTotal > 0)
    )
    || (type === 'Benefits' && (
      coverCropTotal < 0 || seedbedTotal < 0 || plantingTotal < 0 || fertilityTotal < 0 || herbicideTotal < 0 || erosionTotal < 0
      || terminationTotal < 0 || tillageAllTotal < 0 || yieldTotal < 0)
    )
  ) {
    return (
      <>
        <thead>
          <tr>
            <th>Description</th>
            <th>{type}</th>
          </tr>
        </thead>
        <tbody>
          <SummaryRow type={type} parm={coverCropTotal} desc="Seed expense" />
          <SummaryRow type={type} parm={seedbedTotal} desc="Seedbed preparation" />
          <SummaryRow type={type} parm={plantingTotal} desc="Planting" />
          <SummaryRow type={type} parm={terminationTotal} desc="Termination" />
          <SummaryRow type={type} parm={tillageAllTotal} desc="Tillage" />
          <SummaryRow type={type} parm={fertilityTotal} desc="Fertility" />
          <SummaryRow type={type} parm={herbicideTotal} desc="Herbicides" />
          <SummaryRow type={type} parm={erosionTotal} desc="Erosion" />
          <SummaryRow type={type} parm={yieldTotal} desc="Yield impact" />
        </tbody>
      </>
    );
  }
  return null;
}; // CostsBenefits

export const Summary = () => {
  const coverCropTotal = useSelector(get.coverCropTotal) || 0;
  const seedbedTotal = useSelector(get.seedbed.total) || 0;
  const plantingTotal = useSelector(get.planting.total) || 0;
  const terminationTotal = useSelector(get.termination.total) || 0;
  const tillageAllTotal = useSelector(get.tillageAll.total) || 0;
  const fertilityTotal = -useSelector(get.fertility.total) || 0;
  const erosionTotal = -useSelector(get.erosion.total) || 0;
  const yieldTotal = -useSelector(get.yield.total) || 0;
  const herbicideTotal = useSelector(get.herbicide.total) || 0;

  const total = +coverCropTotal + +seedbedTotal + +plantingTotal + +fertilityTotal + +erosionTotal + +terminationTotal + +tillageAllTotal
                + +yieldTotal + +herbicideTotal;

  const farm = useSelector(get.farm);
  const field = useSelector(get.field);
  const acres = useSelector(get.mapFeatures.area);
  const cashCrop = useSelector(get.cashCrop);

  const style = total > 0 ? { color: 'red' } : { color: 'black' };
  // const classes = useStyles();

  return (
    (total || farm || field || acres || cashCrop) && (
      <div>
        <Draggable handle="strong">
          <Card id="Summary" variant="outlined" style={{ backgroundColor: '#eee' }}>
            <CardContent>
              <strong className="cursor">Summary</strong>
              <table>
                {(farm || field || acres || cashCrop) && (
                  <>
                    <thead />
                    <tbody>
                      {farm && (
                      <tr>
                        <td>Farm     </td>
                        <td style={{ textAlign: 'left' }}>
                          {farm}
                        </td>
                      </tr>
                      )}
                      {field && (
                      <tr>
                        <td>Field    </td>
                        <td style={{ textAlign: 'left' }}>
                          {field}
                        </td>
                      </tr>
                      )}
                      {acres && (
                      <tr>
                        <td>Acres    </td>
                        <td style={{ textAlign: 'left' }}>
                          {acres}
                        </td>
                      </tr>
                      )}
                      {cashCrop && (
                      <tr>
                        <td>Cash crop</td>
                        <td style={{ textAlign: 'left' }}>
                          {cashCrop}
                        </td>
                      </tr>
                      )}
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
            </CardContent>
          </Card>
        </Draggable>
      </div>
    )
  );
}; // Summary

export default Activity;
