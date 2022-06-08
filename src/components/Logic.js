import {Input} from './Inputs';
import {useEffect} from 'react';

import {useSelector, useDispatch} from 'react-redux';
import {get, set, implement, power, match, dollars, totalRelevantCost} from '../store/store';

const Logic = ({current, question, q, a, property, type, shown=true, suffix='', initial='', onChange, onInput, value, estimated, total}) => {
  // console.log('Render: Logic ' + property);
  const dispatch = useDispatch();
  const holdShown         = useSelector(get.shown);
  const currentImplement  = useSelector(get[current].implement);
  const annualUseAcres    = useSelector(get[current].annualUseAcres);
  const annualUseHours    = useSelector(get[current].annualUseHours);
  const dbimplements      = useSelector(get.dbimplements);
  const dbpower           = useSelector(get.dbpower);

  if (property === 'implement') {
    a = ['', ...Object.keys(dbimplements).filter(key => dbimplements[key].type === type).sort()]
    shown = match('q3', 'Self', current);
    onChange = () => {
      dispatch(set[current].power(implement('default power unit')));
      setTimeout(() => dispatch(set[current].total(totalRelevantCost())), 100);  // TODO: Why timeout?
      dispatch(set[current].edited(false));
    }
  }

  switch (question) {
    case 'Annual Use (acres on implement)':
      property = 'annualUseAcres';
      q = q || question;
      a = 'number';
      value = Number.isFinite(annualUseAcres) ? annualUseAcres : +implement('acres/year', 0);  // TODO: What causes this to be a string?
      shown = currentImplement;
      break;
    case 'Annual Use (hours on power)':
      property = 'annualUseHours';
      q = q || question;
      a = 'number';
      value = Number.isFinite(annualUseHours) ? annualUseHours : power('expected use (hr/yr)');  // TODO: What causes this to be a string?
      shown = currentImplement;
      onChange = () => {
        dispatch(set[current].total(undefined));
        dispatch(set[current].edited(false));
      }
      break;
    case 'Acres/hour':
      q = q || question;
      a = implement('acres/hour', 1);
      shown = currentImplement;
      break;
    case 'power':
      property = 'power';
      q = q || 'What power will be used?';
      a = ['', ...Object.keys(dbpower)];
      shown = currentImplement;
      onChange = () => {
        dispatch(set[current].total(totalRelevantCost()));
        dispatch(set[current].edited(false));
      };
      break;
    case 'Estimated':
      property = 'total';
      q = q || question;
      q = (match('q3', 'Self', current) ? `Estimated relevant cost (${dollars(estimated)}/acre)` : `Estimated custom cost (${dollars(total)}/acre)`) || question;
      a = 'dollar';
      value = total || estimated;
      onChange = (_, value) => {
        dispatch(set[current].edited(value > ''));
      }
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