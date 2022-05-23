import {Autocomplete, Input} from './Inputs';
import {useEffect} from 'react';

import {useSelector, useDispatch} from 'react-redux';
import {get, set, data, power, match, dollars, db, totalRelevantCost} from '../store/store';

const Logic = ({question, q, a, property, shown=true, suffix='', initial='', onChange, onInput, value, estimated, total}) => {
  console.log('Render: Logic ' + property);
  const dispatch = useDispatch();
  const holdShown = useSelector(get.shown);
  console.log(holdShown);
  const id = useSelector(get.current);
  const state = useSelector(id ? get[id] : get.screen);

  if (property === 'q4') {
    console.log('_'.repeat(40));
    console.log(shown);
    console.log(match('q3', 'Self', 'seedbed'));
    console.log('_'.repeat(40));
  }
  switch (question) {
    case 'Annual Use (acres on implement)':
      q = q || question;
      a = data('acres/year', 0);
      shown = state.q4;
      break;
    case 'Annual Use (hours on power)':
      q = q || question;
      a= power('expected use (hr/yr)');
      shown = state.q4;
      break;
    case 'Acres/hour':
      q = q || question;
      a = data('acres/hour', 1);
      shown = state.q4;
      break;
    case 'power':
      property = 'power';
      q = q || 'What power will be used?';
      a = ['', ...Object.keys(db.power)];
      shown = state.q4;
      onChange = () => {
        dispatch(set[id].total(totalRelevantCost()));
        dispatch(set[id].edited(false));
      };
      break;

    case 'Estimated':
      property = 'total';
      q = q || question;
      q = (match('q3', 'Self', id) ? `Estimated relevant cost (${dollars(estimated)}/acre)` : `Estimated custom cost (${dollars(total)}/acre)`) || question;
      a = 'dollar';
      onChange = (e) => {
        dispatch(set[id].edited(e.target.value > ''));
      }
      break;
    default:
  }

  // if (property === 'q2') alert(shown)

  useEffect(() => {
    if (!id || !property) return;

    // if (holdShown[id][property] !== !!shown) { // prevent infinite loop
      dispatch(set.shown[id][property](shown || false));
    // }

    if (!shown) { // TODO
      console.log(id);
      console.log(property);
      dispatch(set[id][property](initial));
    } else if (value !== undefined) {
      dispatch(set[id][property](value));
    }
  }, [dispatch, holdShown, id, value, property, shown, initial]);

  return (
    id && shown ?
    <tr className={id}>
      <td>{q}</td>
      <td>
        {
          Array.isArray(a) ?
            a.length < 3 ? 
            <>
              {
                a.map(a => (
                  <label key={a}>
                    <Input
                      id={id}
                      property={property}
                      onChange={onChange}
                      type="radio"
                      value={a}
                    />{a}
                    <br/>
                  </label>
                ))
              }
            </>
            :
            <Autocomplete
              id={id}
              property={property}
              onChange={onChange}
              options={a}
            />
          :
          
          /number|dollar/.test(a) ?
            <Input
              id={id}
              property={property}
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