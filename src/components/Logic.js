import {Autocomplete, Input} from './Inputs';
import {useEffect} from 'react';

import {useSelector, useDispatch} from 'react-redux';
import {get, set, data, power, match, dollars, db, totalRelevantCost} from '../store/store';

const Logic = ({question, q, a, property, shown=true, suffix='', initial='', onInput, value, estimated, total}) => {
  const dispatch = useDispatch();  
  const id = useSelector(get.current);
  const state = useSelector(id ? get[id] : get.screen);

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
      onInput = () => {
        dispatch(set[id]({property: 'total', value: totalRelevantCost()}));
        dispatch(set[id]({property: 'edited', value: false}));
      };
      break;

    case 'Estimated':
      property = 'total';
      q = q || question;
      q = (match('q3', 'Self', id) ? `Estimated relevant cost (${dollars(estimated)}/acre)` : `Estimated custom cost (${dollars(total)}/acre)`) || question;
      a = 'dollar';
      onInput= (e) => {
        dispatch(set[id]({property: 'edited', value: e.target.value > ''}));
      }
      break;
    default:
  }

  useEffect(() => {
    if (!id) return;

    dispatch(set.shown({
      property: id + property,
      value: shown || false
    }));

    if (!shown) { // TODO
      dispatch(set[id]({property, value: initial}));
    } else if (value !== undefined) {
      dispatch(set[id]({property, value}));
    }
  }, [dispatch, id, value, property, shown, initial]);

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
                      onInput={onInput}
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
              onInput={onInput}
              options={a}
            />
          :
          
          /number|dollar/.test(a) ?
            <Input
              id={id}
              property={property}
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