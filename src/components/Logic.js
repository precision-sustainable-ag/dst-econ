import {Autocomplete, Input} from './Inputs';

const Logic = ({q, a, id, cond=true, props, parms}) => {
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
                    <input
                      {...props(id)}
                      key={a} type="radio" name={id} value={a} checked={a === parms[id]}
                    />{a}
                    <br/>
                  </label>
                ))
              }
            </>
            :
            <Autocomplete
              {...props(id)}
              options={a}
            />
          :
          
          /number|dollar/.test(a) ?
            <Input 
              type={a}
              {...props(id)} 
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
      </td>
    </tr>
  )
} // Logic

export default Logic;