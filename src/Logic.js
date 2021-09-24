const Logic = ({q, a, id, cond=true, ps, parms}) => {
  return (
    <>
      {cond && 
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
                        <input key={a} type="radio" name={id} id={id} value={a} checked={a === parms[id]}/>{a}
                        <br/>
                      </label>
                    ))
                  }
                </>
                :
                <select {...ps(id)} >
                  {a.map(a => <option key={a}>{a}</option>)}
                </select>
              :
              a === 'number' ?
                <input {...ps(id)} /> :
              isFinite(a) ? 
                '$' + (+a).toFixed(2)
              :
                ''
            }
          </td>
        </tr>
      }
    </>
  )
} // Logic

export default Logic;