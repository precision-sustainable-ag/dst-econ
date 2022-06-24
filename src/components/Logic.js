import {Input} from './Inputs';
import {useEffect} from 'react';

import {useSelector, useDispatch} from 'react-redux';
import {get, set, dollars, db} from '../store/store';

const Logic = ({current, question, q, a, property, type, shown=true, suffix='', initial='', onChange, onInput, value, estimated, total, warning}) => {
  // console.log('Render: Logic ' + property);
  const dispatch = useDispatch();
  const holdShown         = useSelector(get.shown);
  const context           = useSelector(get[current]);
  const currentImplement  = useSelector(get[current].implement);
  const acresHour         = useSelector(get[current].acresHour).toString();

  if (property === 'implement') {
    a = ['', ...Object.keys(db.implements).filter(key => db.implements[key].type === type).sort()]
    shown = /chemical|roller|tillage/.test(current) || context.q3 === 'Self';
  }

  switch (question) {
    case 'Annual Use (acres on implement)':
      property = 'annualUseAcres';
      q = q || question;
      a = 'number';
      shown = currentImplement;
      break;
    case 'Annual Use (hours on power)':
      property = 'annualUseHours';
      q = q || question;
      a = 'number';
      shown = currentImplement;
      break;
    case 'Acres/hour':
      q = q || question;
      a = acresHour;
      shown = currentImplement;
      break;
    case 'power':
      property = 'power';
      q = q || 'What power will be used?';
      a = ['', ...Object.keys(db.power).sort((a, b) => a.replace(/^\d+/, '').localeCompare(b.replace(/^\d+/, '')))];
      shown = currentImplement;
      break;
    case 'Estimated':
      property = 'total';
      q = q || question;
      q = (context.q3 === 'Self' ? `Estimated relevant cost (${dollars(estimated)}/acre)` : `Estimated custom cost (${dollars(estimated * 0.75)} - ${dollars(estimated * 1.25)} /acre)`) || question;
      a = 'dollar';
      value = total || estimated;
      shown = context.q3;
      warning = (
        context.q3 === 'Custom Operator' && (context.total < estimated * 0.75 || context.total > estimated * 1.25) ?
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
      <td>{q}</td>
      <td>
        {
          Array.isArray(a) ?
            a.length < 3 ? 
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
          
          typeof a === 'string' ? 
            a
          :
          
          isFinite(a) ? 
            '$' + (+a).toFixed(2)
          :
          
          ''
        }
        <span className="suffix">{suffix}</span>
      </td>
    </tr> :
    null
  )
} // Logic

export default Logic;