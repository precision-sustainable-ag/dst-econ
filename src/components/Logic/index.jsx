import React from 'react';
import { useSelector } from 'react-redux';
import Input from '../../shared/Inputs';
import Activity from '../Activity';

import {
  goto, get, dollars, db,
} from '../../store/Store';

const Logic = ({
  current, intro, question, q, a, property, type, suffix = '',
  onChange, onInput, value, estimated, total, warning, style, custom = ['Hire custom operator'],
}) => {
  const sortCosts = () => {
    const cd = db.costDefaults;
    return Object.keys(cd)
      .filter((key) => cd[key].screen === type)
      .sort((k1, k2) => {
        if (cd[k1].order) {
          return cd[k1].order - cd[k2].order;
        }
        return cd[k1].key.localeCompare(cd[k2].key);
      })
      .map((s) => `HIRE ${s}`);
  }; // sortCosts

  const sortPower = () => {
    let result = Object.keys(db.power)
      .sort((k1, k2) => {
        const key1 = k1.match(/(^\d+) (.+)/);
        const key2 = k2.match(/(^\d+) (.+)/);

        if (key1[2] === key2[2] || /seedbed/.test(current)) {
          return key1[1] - key2[1];
        }

        return key1[2].localeCompare(key2[2]);
      });

    if (current === 'seedbed') {
      result = result.filter((power) => power.includes('Tractor'));
    }

    return ['', ...result];
  }; // sortPower

  const sortRollerTerminationOptions = (options) => options.map((op) => {
    if (op === 'Hire custom operator') {
      return { id: 0, text: op };
    }
    const calculatedId = op.split('; ')[1].split(' ')[0];
    return { id: calculatedId, text: op };
  }).sort(
    (a1, a2) => a1.id - a2.id,
  ).map(
    (op) => op.text,
  ); // sortRollerTerminationOptions

  const selector = goto(get, current);
  const context = useSelector(selector);
  const currentImplement = useSelector(selector.implement);
  const acresHour = useSelector(selector.acresHour).toString();

  if (!style && property === 'implement') {
    style = { borderTop: '1px solid black' };
  }

  const iscustom = [
    'Hire custom operator',
    'No additional application activity.',
    ...Object.keys(db.costDefaults),
  ].includes(currentImplement.replace('HIRE ', ''));
  console.log('checking: ', currentImplement);

  let info = '';
  let shown = true;
  let td = true;

  if (property === 'implement') {
    a = [
      ...custom,
      ...sortCosts(),
      ...Object.keys(db.implements)
        .filter((key) => db.implements[key].type === type)
        .sort(),
    ];
  }

  switch (question) {
    case 'Annual Use (acres on implement)':
      td = false;
      property = 'annualUseAcres';
      info = (
        <>
          <p>Costs associated with tractor and implement use are based upon annual use.</p>
          <p>Users can insert the estimated number of acres of annual use to more accurately represent their operation.</p>
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
      a = sortPower();
      shown = currentImplement && !iscustom;
      break;
    case 'Estimated':
      td = false;
      property = 'total';
      estimated = context.estimated;
      q = (
        iscustom ? `Estimated cost (${dollars(estimated * 0.75)} - ${dollars(estimated * 1.25)} /acre)`
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
        currentImplement && currentImplement !== 'No additional application activity.'
      );
      warning = (
        iscustom && (context.total < estimated * 0.75 || context.total > estimated * 1.25)
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
          options={
            current === 'termination.roller' && property === 'implement'
              ? sortRollerTerminationOptions(a)
              : a
          }
          suffix={suffix}
          groupBy={(option) => {
            if (option.includes('I will not')) {
              return '';
            }
            if (option.includes('HIRE ')) {
              return 'Hire custom operator';
            }
            if (a.filter((s) => s.includes('HIRE ')).length) {
              return 'Equipment';
            }
            return null;
          }}
          getOptionLabel={(o) => o?.split('|')[0].replace(/HIRE |Equipment: /, '')}
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
              property === 'implement' && !iscustom ? (
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
