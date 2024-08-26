import React, { createRef } from 'react';
import { useSelector } from 'react-redux';
import { CardContent, Card } from '@mui/material';
import Draggable from 'react-draggable';
import { goto, get, dollars } from '../../store/Store';
import Input from '../../shared/Inputs';
import './styles.scss';

const Costs = ({ desc, type }) => {
  const selector = goto(get, type);
  const state = useSelector(selector);
  const d = desc?.replace('Storage shed', 'Storage');

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
        <Input
          id={`${type}.${d}`}
          type="checkbox"
          tabIndex={-1}
          label={desc}
        />
      </td>
      <td>{iCost ? `$${iCost.toFixed(2)}` : ''}</td>
      <td>{pCost ? `$${pCost.toFixed(2)}` : ''}</td>
      <td>{total}</td>
    </tr>
  );
}; // Costs

const Activity = ({ type }) => {
  const selector = goto(get, type);
  const state = useSelector(selector) || {};
  const { estimated } = state;
  const tot = state.total;
  const edited = estimated !== tot;
  const imp = state.implement;
  const ImplementsCost = state.implementsCost;
  const PowerCost = state.powerCost;

  const heading = {
    seedbed: 'Seedbed Preparation',
    planting: 'Cover Crop Planting',
    chemical: 'Chemical Spray',
    grazing: 'Grazing',
    roller: 'Roller',
    tillage: 'Tillage',
    termination: 'Termination total',
  }[type];

  let cname = type;
  if (!ImplementsCost) {
    cname += ' noImplementCost';
  }

  if (!PowerCost) {
    cname += ' noPowerCost';
  }

  let style;

  const breakdown = imp && !edited && (
    <div
      className={cname}
      id="Breakdown"
      style={style}
    >
      <table id="Costs">
        <thead>
          <tr>
            <th rowSpan="2" style={{ verticalAlign: 'bottom' }}>
              Cost
              <br />
              Description
            </th>
            <th colSpan="3">{heading}</th>
          </tr>
          <tr>
            <th className="hidden">_</th>
            <th>
              <label>
                Implement
                <br />
                Cost
                <br />
                ($/acre)
                <br />
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
      <tr style={{
        backgroundColor: desc === 'Total'
          ? '#feff97'
          : null,
        fontWeight: desc === 'Total'
          ? 'bold'
          : '',
      }}
      >
        <td>
          {desc}
          {desc === 'Total' ? ` ${type}` : ''}
        </td>
        <td style={style}>{dollars(Math.abs(parm))}</td>
      </tr>
    );
  }
  return null;
}; // SummaryRow

const CostsBenefits = ({ type }) => {
  const coverCropTotal = useSelector(get.coverCropTotal) || 0;
  const seedbedTotal = useSelector(get.seedbed).total || 0;
  const plantingTotal = useSelector(get.planting).total || 0;
  const grazingTotal = useSelector(get.grazing).total || 0;
  const terminationTotal = useSelector(get.termination).total || 0;
  const tillageTotal = useSelector(get.tillage).total || 0;
  const fertilityTotal = -useSelector(get.fertility).total || 0;
  const erosionTotal = -useSelector(get.erosion).total || 0;
  const yieldTotal = -useSelector(get.yield).total || 0;
  const herbicideTotal = useSelector(get.herbicide).total || 0;
  const additionalTotal = -useSelector(get.additional).total || 0;

  const totalsArray = [
    coverCropTotal,
    seedbedTotal,
    plantingTotal,
    grazingTotal,
    terminationTotal,
    tillageTotal,
    fertilityTotal,
    erosionTotal,
    yieldTotal,
    herbicideTotal,
    additionalTotal,
  ];

  const costsTotal = totalsArray.reduce((acc, current) => {
    if (current > 0) {
      return acc + current;
    }
    return acc;
  }, 0);

  const benefitsTotal = totalsArray.reduce((acc, current) => {
    if (current < 0) {
      return acc + current;
    }
    return acc;
  }, 0);

  if (
    (type === 'Costs' && (
      coverCropTotal > 0 || seedbedTotal > 0 || plantingTotal > 0 || grazingTotal > 0 || fertilityTotal > 0 || herbicideTotal > 0 || erosionTotal > 0
      || terminationTotal > 0 || tillageTotal > 0 || yieldTotal > 0)
    )
    || (type === 'Benefits' && (
      coverCropTotal < 0 || seedbedTotal < 0 || plantingTotal < 0 || grazingTotal < 0 || fertilityTotal < 0 || herbicideTotal < 0 || erosionTotal < 0
      || terminationTotal < 0 || tillageTotal < 0 || yieldTotal < 0 || additionalTotal < 0)
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
          <SummaryRow type={type} parm={tillageTotal} desc="Tillage" />
          <SummaryRow type={type} parm={fertilityTotal} desc="Fertility" />
          <SummaryRow type={type} parm={herbicideTotal} desc="Herbicides" />
          <SummaryRow type={type} parm={erosionTotal} desc="Erosion Control" />
          <SummaryRow type={type} parm={grazingTotal} desc="Grazing" />
          <SummaryRow type={type} parm={yieldTotal} desc="Yield impact" />
          <SummaryRow type={type} parm={additionalTotal} desc="Additional considerations" />
          <SummaryRow type={type} parm={type === 'Costs' ? costsTotal : benefitsTotal} desc="Total" />
        </tbody>
      </>
    );
  }
  return null;
}; // CostsBenefits

export const SummaryDetails = ({ view }) => {
  const coverCropTotal = useSelector(get.coverCropTotal) || 0;
  const seedbedTotal = useSelector(get.seedbed).total || 0;
  const plantingTotal = useSelector(get.planting).total || 0;
  const grazingTotal = useSelector(get.grazing).total || 0;
  const terminationTotal = useSelector(get.termination).total || 0;
  const tillageTotal = useSelector(get.tillage).total || 0;
  const fertilityTotal = -useSelector(get.fertility).total || 0;
  const erosionTotal = -useSelector(get.erosion).total || 0;
  const yieldTotal = -useSelector(get.yield).total || 0;
  const herbicideTotal = useSelector(get.herbicide).total || 0;
  const additionalTotal = -useSelector(get.additional).total || 0;

  const total = +coverCropTotal + +seedbedTotal + +plantingTotal + +grazingTotal + +fertilityTotal + +erosionTotal
                + +terminationTotal + +tillageTotal + +yieldTotal + +herbicideTotal + +additionalTotal;

  const farm = useSelector(get.farm);
  const field = useSelector(get.field);
  const acres = useSelector(get.mapFeatures.area);
  const cashCrop = useSelector(get.cashCrop);

  const style = total > 0 ? { color: 'red' } : { color: 'black' };

  const componentRef = createRef();

  return (
    (total || farm || field || acres || cashCrop) && (
    <Draggable handle="strong" disabled={view !== 'DESKTOP'}>
      <Card
        id="Summary"
        variant="outlined"
        style={{
          backgroundColor: '#eee',
          position: view === 'DESKTOP' ? 'absolute' : '',
          marginTop: view === 'DESKTOP' ? '' : '5%',
          margin: view === 'DESKTOP' ? '' : 'auto',
        }}
        ref={view === 'DESKTOP' ? componentRef : null}
      >
        <CardContent>
          <div ref={view === 'DESKTOP' ? componentRef : null}>
            <strong className="cursor" style={{ cursor: view === 'DESKTOP' ? '' : 'auto' }}>
              Budget Table
            </strong>

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
                  <tr style={{ fontWeight: 'bold' }}>
                    <td>
                      Total Economic
                      {' '}
                      {total < 0 ? 'Benefit' : 'Cost'}
                    </td>
                    <td style={style}>{dollars(Math.abs(total))}</td>
                  </tr>
                </tfoot>
              ) : null}
            </table>
          </div>
        </CardContent>
      </Card>
    </Draggable>
    )
  );
};

export const Summary = () => {
  const coverCropTotal = useSelector(get.coverCropTotal) || 0;
  const seedbedTotal = useSelector(get.seedbed).total || 0;
  const plantingTotal = useSelector(get.planting).total || 0;
  const grazingTotal = useSelector(get.grazing).total || 0;
  const terminationTotal = useSelector(get.termination).total || 0;
  const tillageTotal = useSelector(get.tillage).total || 0;
  const fertilityTotal = -useSelector(get.fertility).total || 0;
  const erosionTotal = -useSelector(get.erosion).total || 0;
  const yieldTotal = -useSelector(get.yield).total || 0;
  const herbicideTotal = useSelector(get.herbicide).total || 0;
  const additionalTotal = -useSelector(get.additional).total || 0;

  const total = +coverCropTotal + +seedbedTotal + +plantingTotal + +grazingTotal + +fertilityTotal + +erosionTotal
                + +terminationTotal + +tillageTotal + +yieldTotal + +herbicideTotal + +additionalTotal;

  const farm = useSelector(get.farm);
  const field = useSelector(get.field);
  const acres = useSelector(get.mapFeatures.area);
  const cashCrop = useSelector(get.cashCrop);

  return (
    (total || farm || field || acres || cashCrop) && (
    <div className="desktop2">
      <Draggable handle="strong">
        <SummaryDetails view="DESKTOP" />
      </Draggable>
    </div>
    )
  );
}; // Summary

export default Activity;
