import {Autocomplete, Input} from './Inputs';
import {useContext} from 'react';
import {Context} from './Store';

const Logic = ({q, a, id, cond=true, suffix='', initial='', onInput, value}) => {
  const {state, change} = useContext(Context);

  change('addkey', id, initial);
  
  change('change', 'shown' + id, cond);
  
  if (!cond) {
    change('change', id, initial);
  } else if (value !== undefined) {
    change('change', id, value);
  }

  return (
    cond &&
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
              options={a}
              id={id}
              value={state[id] || initial}
            />
          :
          
          /number|dollar/.test(a) ?
            <Input
              onInput={onInput}
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
    </tr>
  )
} // Logic

export default Logic;