import React from 'react';
import { useSelector } from 'react-redux';
import Input from '../../shared/Inputs';
import Activity from '../Activity';

import { get, dollars, db } from '../../store/Store';

const Logic = ({
  current, intro, question, q, a, property, type, suffix = '',
  onChange, onInput, value, estimated, total, warning, style, custom = ['Hire custom operator'],
}) => {
  // console.log('Render: Logic ' + property);
  const context = useSelector(get[current]);
  const currentImplement = useSelector(get[current].implement);
  const acresHour = useSelector(get[current].acresHour).toString();

  const iscustom = [
    'Hire custom operator', 'I will not reduce my post emerge spray applications',
  ].includes(currentImplement);

  let info = '';
  let shown = true;
  let td = true;

  if (property === 'implement') {
    a = [...custom, ...Object.keys(db.implements).filter((key) => db.implements[key].type === type).sort()];
  }

  switch (question) {
    case 'Annual Use (acres on implement)':
      td = false;
      property = 'annualUseAcres';
      info = (
        <>
          <p>Costs associated with tractor and implement use are based upon annual use.</p>
          <p>Users can insert the estimated number of hours of annual use to more accurately represent their operation.</p>
        </>
      );

      q = q || question;
      a = 'number';
      shown = currentImplement && !iscustom;
      break;
    case 'Annual Use (hours on power)':
      td = false;
      property = 'annualUseHours';
      q = q || question;

      info = (
        <>
          <p>Costs associated with tractor and implement use are based upon annual use.</p>
          <p>Users can insert the estimated number of hours of annual use to more accurately represent their operation.</p>
        </>
      );

      a = 'number';
      shown = currentImplement && !iscustom;
      break;
    case 'Acres/hour':
      td = false;
      q = q || question;
      a = acresHour;
      shown = currentImplement && !iscustom;
      break;
    case 'power':
      td = false;
      property = 'power';
      q = q || 'What power will be used?';
      a = ['', ...Object.keys(db.power).sort((a2, b) => a2.replace(/^\d+/, '').localeCompare(b.replace(/^\d+/, '')))];
      shown = currentImplement && !iscustom;
      break;
    case 'Estimated':
      td = false;
      property = 'total';
      estimated = context.estimated;
      q = (
        iscustom ? `Estimated custom cost (${dollars(estimated * 0.75)} - ${dollars(estimated * 1.25)} /acre)`
          : q || (
          <div>
            Estimated relevant cost (
            {dollars(estimated)}
            /acre)
          </div>
          )
      ) || question;
      a = 'dollar';
      value = total || estimated;
      shown = context.q3 || (
        currentImplement && currentImplement !== 'I will not reduce my post emerge spray applications'
      );
      warning = (
        (iscustom || context.q3 === 'Custom Operator') && (context.total < estimated * 0.75 || context.total > estimated * 1.25)
          ? (
            <div className="warning">
              Warning:
              {' '}
              {dollars(context.total)}
              {' '}
              is outside the expected range for this activity.
            </div>
          )
          : null
      );
      info = iscustom ? '' : (
        <>
          <p>
            Farmers view costs differently, so the table to the right allows you to customize the cost estimation to fit their needs.
            The default cost estimation assumes all ownership and variable costs are relevant.
            However, some farmers will want to focus on the cash costs of fuel and labor.
            Removing the check from the box would allow such an analysis.
            Others would want to ignore all costs that definitely do not change with use
            so they would uncheck the boxes for interest, taxes, insurance and shed.
          </p>
          <p>
            Basically, the costs you want to count toward the cost of cover crops should have a checkmark beside it.
            If you are not concerned with certain costs, remove the checkmark.
          </p>
        </>
      );
      break;
    default:
  }

  let result;

  if (Array.isArray(a)) {
    if (a.length < 3 || type === 'radio') {
      result = (
        <Input
          id={`${current}.${property}`}
          type="radio"
          options={a}
          onChange={onChange}
          suffix={suffix}
        />
      );
    } else {
      result = (
        <Input
          id={`${current}.${property}`}
          onChange={onChange}
          options={a}
          suffix={suffix}
        />
      );
    }
  } else if (/number|dollar/.test(a)) {
    result = (
      <Input
        id={`${current}.${property}`}
        onChange={onChange}
        onInput={onInput}
        type={a}
        value={value}
        warning={warning}
        info={info}
        suffix={suffix}
      />
    );
  } else if (Number.isFinite(a)) {
    result = (
      <span
        className="input"
        id={property ? `${current}.${property}` : ''}
      >
        {`$${(+a).toFixed(2)}`}
      </span>
    );
  } else {
    result = a;
  }

  return (
    current && shown
      ? (
        <>
          {intro && <tr><td colSpan={2}>{intro}</td></tr>}
          <tr className={current}>
            <td style={style}>{q}</td>
            <td style={style}>{result}</td>
            {
              property === 'implement' ? (
                <td
                  style={{ padding: 0, border: '1px solid black' }}
                  rowSpan="6"
                >
                  <Activity type={current} />
                </td>
              )
                : (
                  td && <td />
                )
            }
          </tr>
        </>
      )
      : null
  );
}; // Logic

export default Logic;
