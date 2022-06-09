import {Input} from './Inputs';
import {useEffect} from 'react';

import {useSelector, useDispatch} from 'react-redux';
import {get, set, match, dollars} from '../store/store';

const Logic = ({current, question, q, a, property, type, shown=true, suffix='', initial='', onChange, onInput, value, estimated, total}) => {
  // console.log('Render: Logic ' + property);
  const dispatch = useDispatch();
  const holdShown         = useSelector(get.shown);
  const currentImplement  = useSelector(get[current].implement);
  const acresHour         = useSelector(get[current].acresHour).toString();
  const dbimplements      = useSelector(get.dbimplements);
  const dbpower           = useSelector(get.dbpower);

  if (property === 'implement') {
    a = ['', ...Object.keys(dbimplements).filter(key => dbimplements[key].type === type).sort()]
    shown = match('q3', 'Self', current);
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
      a = ['', ...Object.keys(dbpower)];
      shown = currentImplement;
      break;
    case 'Estimated':
      property = 'total';
      q = q || question;
      q = (match('q3', 'Self', current) ? `Estimated relevant cost (${dollars(estimated)}/acre)` : `Estimated custom cost (${dollars(total)}/acre)`) || question;
      a = 'dollar';
      value = total || estimated;
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
        {' ' + suffix}
      </td>
    </tr> :
    null
  )
} // Logic

export default Logic;