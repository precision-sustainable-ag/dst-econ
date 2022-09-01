import {Input} from './Inputs';
import {useEffect} from 'react';

import {Icon} from '@mui/material';
import {useSelector, useDispatch} from 'react-redux';
import {get, set, dollars, db} from '../store/store';

const Logic = ({current, question, q, a, property, type, shown=true, suffix='', initial='', onChange, onInput, value, estimated, total, warning, style, custom=['Hire custom operator']}) => {
  // console.log('Render: Logic ' + property);
  const dispatch = useDispatch();
  const holdShown         = useSelector(get.shown);
  const context           = useSelector(get[current]);
  const currentImplement  = useSelector(get[current].implement);
  const acresHour         = useSelector(get[current].acresHour).toString();

  const iscustom = ['Hire custom operator', 'I will not be making an additional application'].includes(currentImplement);

  console.log(currentImplement, custom);
  if (property === 'implement') {
    a = [...custom, ...Object.keys(db.implements).filter(key => db.implements[key].type === type).sort()]
    // shown = /chemical|roller|tillage/.test(current) || context.q3 === 'Self';
    if (shown !== false) {
      shown = true;
    }
  }

  switch (question) {
    case 'Annual Use (acres on implement)':
      property = 'annualUseAcres';
      question = (
        <>
          {question}
          <Icon>
            help
            <p>Costs associated with tractor and implement use are based upon annual use.</p>
            <p>Users can insert the estimated number of hours of annual use to more accurately represent their operation.</p>
          </Icon>
        </>
      );

      q = q || question;
      a = 'number';
      shown = currentImplement && !iscustom;
      break;
    case 'Annual Use (hours on power)':
      property = 'annualUseHours';
      question = (
        <>
          {question}
          <Icon>
            help
            <p>Costs associated with tractor and implement use are based upon annual use.</p>
            <p>Users can insert the estimated number of hours of annual use to more accurately represent their operation.</p>
          </Icon>
        </>
      );
      q = q || question;
      a = 'number';
      shown = currentImplement && !iscustom;
      break;
    case 'Acres/hour':
      q = q || question;
      a = acresHour;
      shown = currentImplement && !iscustom;
      break;
    case 'power':
      property = 'power';
      q = q || 'What power will be used?';
      a = ['', ...Object.keys(db.power).sort((a, b) => a.replace(/^\d+/, '').localeCompare(b.replace(/^\d+/, '')))];
      shown = currentImplement && !iscustom;
      break;
    case 'Estimated':
      property = 'total';
      estimated = context.estimated;
      q = (iscustom ? `Estimated custom cost (${dollars(estimated * 0.75)} - ${dollars(estimated * 1.25)} /acre)` : q || `Estimated relevant cost (${dollars(estimated)}/acre)`) || question;
      a = 'dollar';
      value = total || estimated;
      shown = context.q3 || currentImplement !== 'I will not be making an additional application';
      warning = (
        (iscustom || context.q3 === 'Custom Operator') && (context.total < estimated * 0.75 || context.total > estimated * 1.25) ?
          <div className="warning">
            Warning: {dollars(context.total)} is outside the expected range for this activity.
          </div>
        : null
      );
      break;
    default:
  }

  useEffect(() => {
    if (!current || !property || !set.shown[current][property]) return;

    // if (holdShown[current][property] !== !!shown) { // prevent infinite loop
      dispatch(set.shown[current][property](shown || false));
    // }

    if (!shown) { // TODO
      // console.log(current);
      // console.log(property);
      dispatch(set[current][property](initial));
    } else if (value !== undefined) {
      dispatch(set[current][property](value));
    }
  }, [dispatch, holdShown, current, value, property, shown, initial]);

  return (
    current && shown ?
    <tr className={current}>
      <td style={style}>{q}</td>
      <td style={style}>
        {
          Array.isArray(a) ?
            a.length < 3 || type === "radio" ? 
              <Input
                id={current + '.' + property}
                type="radio"
                options={a}
                onChange={onChange}
              />
            :
              <Input
                id={current + '.' + property}
                onChange={onChange}
                options={a}
              />
          :
          
          /number|dollar/.test(a) ?
            <Input
              id={current + '.' + property}
              onChange={onChange}
              onInput={onInput}
              type={a}
              value={value}
              warning={warning}
            />
          :
          
          isFinite(a) ? 
            '$' + (+a).toFixed(2)
          :
          
          a
        }
        <span className="suffix">{suffix}</span>
      </td>
    </tr> :
    null
  )
} // Logic

export default Logic;