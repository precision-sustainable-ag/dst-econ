import React from 'react';
import { useSelector } from 'react-redux';
import Input from '../../shared/Inputs';
import Activity from '../Activity';

import {
  goto, get, dollars, db,
} from '../../store/Store';

const Logic = ({
  current, intro, question, q, a, property, type, suffix = '',
  onChange, onInput, value, estimated, total, warning, style = {}, custom = [],
}) => {
  const style2 = {};
  const cd = db.costDefaults;
  const sortCosts = Object.keys(cd)
    .filter((key) => cd[key].screen === current || cd[key].screen === current.split('.')[0])
    .sort((k1, k2) => {
      if (cd[k1].order) {
        return cd[k1].order - cd[k2].order;
      }
      return cd[k1].key.localeCompare(cd[k2].key);
    });

  const sortAndFilterPower = () => {
    const filteredPowerOptions = Object.values(db.power).filter((power) => power.screen === '' || power.screen === current);
    let result = filteredPowerOptions.map((power) => power.key)
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
  }; // sortAndFilterPower

  const sortRollerTerminationOptions = (options) => options.map((op) => {
    if (op === 'Hire custom operator') {
      return { id: 0, text: op };
    }
    const calculatedId = op.includes('; ') ? op.split('; ')[1].split(' ')[0] : 0;
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

  const getDefaultEstimatedCostText = () => {
    switch (current) {
      case 'seedbed':
        return 'Seedbed preparation equipment costs';
      case 'planting':
        return 'Planting equipment costs';
      default: return 'Estimated relevant cost';
    }
  };

  if (!style && property === 'implement') {
    style = { borderTop: '1px solid black' };
  }

  let iscustom = [
    'Hire custom operator',
    current === 'herbicide.reduced'
      ? 'No reduced application activity'
      : 'No additional application activity',
    ...Object.keys(db.costDefaults),
  ].includes(currentImplement?.replace(/hire (?!custom operator)/i, ''));

  iscustom = currentImplement === 'Incorporate planting with fertilizing. No CC planting cost.' ? true : iscustom;

  if (currentImplement === 'Incorporate planting with fertilizing. No CC planting cost.') {
    style2.width = '100%';
  }

  let info = '';
  let shown = true;
  let td = true;

  if (property === 'implement') {
    a = [
      ...custom,
      ...sortCosts,
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
      q = q || 'What tractor will be used?';
      a = sortAndFilterPower();
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
            {getDefaultEstimatedCostText()}
            {' '}
            (
            {dollars(estimated)}
            /acre)
          </div>
          )
      ) || question;
      a = 'dollar';
      value = total || estimated;
      shown = context.q3 || (
        currentImplement && !(
          currentImplement === 'No additional application activity'
          || currentImplement === 'No reduced application activity'
          || currentImplement === 'Incorporate planting with fertilizing. No CC planting cost.'
        )
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
            Farmers view costs differently.
            The table to the right allows you to customize the cost estimation to fit your needs.
            Three ways exist to estimate cost of this activity.
          </p>
          <ol>
            <li>
              Accept the default cost estimation.
              This assumes all ownership and variable costs are relevant.
            </li>
            <li>
              Select relevant costs.
              Some farmers will want to focus on costs that change with cover crop use.
              Removing the check from the box beside particular costs removes that cost from the estimated cost of doing that activity.
              The costs you want to count toward the cost of cover crops should have a checkmark beside it.
              Remove all others.
            </li>
            <li>Overwrite any estimated cost in this box by typing the cost you think appropriate.</li>
          </ol>

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
      if (current === 'termination.roller' && property === 'implement') {
        a = sortRollerTerminationOptions(a);
      } else if (current === 'termination.chemical' && property === 'implement') {
        a = a.filter(
          (aValue) => aValue !== 'Hire custom operator',
        );
      }
      result = (
        <Input
          id={`${current}.${property}`}
          onChange={onChange}
          options={a}
          suffix={suffix}
          groupBy={(option) => {
            if (option.includes('I will not')) {
              return '';
            }
            if (sortCosts.includes(option)) {
              return 'Hire custom operator';
            }
            if (
              option === 'No additional application activity'
              || option === 'No reduced application activity'
              || option === 'Incorporate planting with fertilizing. No CC planting cost.'
            ) {
              return 'None';
            }
            if (sortCosts.length) {
              return 'Equipment';
            }
            return null;
          }}
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

  const displayRow = (currentValue, propertyValue) => !(
    (
      [
        'herbicide.additional',
        'herbicide.reduced',
      ].includes(currentValue)
      && propertyValue === 'total'
      && (
        context.implement === 'No additional application activity'
        || context.implement === 'No reduced application activity'
      )
    )
    || (
      currentValue === 'planting'
      && propertyValue === 'total'
      && context.implement === 'Incorporate planting with fertilizing. No CC planting cost.'
    )
  );

  return (
    current && shown
      ? (
        <>
          {intro && <tr><td colSpan={2}>{intro}</td></tr>}
          {
            displayRow(current, property)
              && (
              <tr className={current}>
                <td style={style}>
                  {q}
                </td>
                <td style={{ ...style, ...style2 }}>
                  {result}
                </td>
                {
                  property === 'implement'
                    && !iscustom
                    && !([
                      'herbicide.additional',
                      'herbicide.reduced',
                      'herbicide.fall',
                      'tillage.elimination',
                      'tillage.fall',
                      'tillage.other',
                    ].includes(current) && context.implement === '')
                    ? (
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
              )
          }
        </>
      )
      : null
  );
}; // Logic

export default Logic;
