import {Autocomplete, Input} from './NewInputs';
import {useEffect} from 'react';

import {useSelector, useDispatch} from 'react-redux';
import {get, set} from '../app/store';

const Logic = ({q, a, id, shown=true, suffix='', initial='', onInput, value}) => {
  const dispatch = useDispatch();  
  const context = useSelector(get.current);

  useEffect(() => {
    if (!context) return;
    
    dispatch(set.shown({
      key: context + id,
      value: shown || false
    }));

    if (!shown) { // TODO
      dispatch(set[context]({key: id, value: initial}));
    } else if (value !== undefined) {
      dispatch(set[context]({key: id, value}));
    }
  });

  return (
    context && shown ?
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
                      onInput={onInput}
                      context={context}
                      type="radio"
                      id={id}
                      value={a}
                    />{a}
                    <br/>
                  </label>
                ))
              }
            </>
            :
            <Autocomplete
              onInput={onInput}
              context={context}
              options={a}
              id={id}
            />
          :
          
          /number|dollar/.test(a) ?
            <Input
              onInput={onInput}
              context={context}
              type={a}
              id={id}
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