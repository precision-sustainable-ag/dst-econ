import {Autocomplete, Input} from './Inputs';

const Logic = ({q, a, id, cond=true, props, parms}) => {
  return (
    cond && 
    <tr className={id}>
      <td>{q}</td>
      <td>
        {
          a instanceof Array ?
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
          
          a === 'number' ?
            <Input 
              type="number"
              {...props(id)} 
            /> 
          :
          a === 'dollar' ?
            <Input
              type="dollar"
              {...props(id)}
            /> 
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