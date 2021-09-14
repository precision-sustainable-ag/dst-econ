import Activity from './Activity';

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

const Seedbed = ({setScreen, db, parms, ps, sets}) => {
  return (
    <div className="Planting">
      <h1>Economic Decision Aid for Cover Crops: Seedbed Preparation</h1>
      <div id="About">
        Decisions surrounding cover crop decisions require understanding how they will be impacted by the prior cash crop.
        Only activities that are incurred because a cover crop is planted are charged to the cover crop.
        If you were going to do the activity without planting a cover crop, its cost is not considered a cost of growing the cover crop.
      </div>
      <hr/>

      <strong>Cover Crop Establishment</strong>
      <table>
        <tbody>
          <tr>
            <th colSpan="2">Seedbed preparation</th>
          </tr>
          <Logic
            id="T1"
            q="Will you do cover crop seedbed preparation prior to planting the cover crop?"
            a={['Yes', 'No']}
            parms={parms}
            ps={ps}
          />

          <Logic
            id="T2"
            q="Would you do this field activity if not planting a cover crop?"
            a={['Yes', 'No']}
            parms={parms}
            cond={parms.T1 === 'Yes'}
            ps={ps}
          />

          <Logic
            id="T3"
            q="Who will do this activity?"
            a={['Self', 'Custom Operator']}
            parms={parms}
            cond={parms.T1 === 'Yes' && parms.T2 === 'No'}
            ps={ps}
          />

          <Logic
            id="T4"
            q="What type of seedbed preparation will be done?"
            a={['', ...Object.keys(db.tillage)]}
            parms={parms}
            cond={parms.T1 === 'Yes' && parms.T2 === 'No' && parms.T3 === 'Self'}
            ps={ps}
          />

          <Logic
            id="T5"
            q={parms.T3 === 'Self' ? 'Estimated relevant cost ($/acre)' : 'Estimated custom cost ($/acre)'}
            a={parms.T5}
            parms={parms}
            cond={parms.T1 === 'Yes' && parms.T2 === 'No'}
            ps={ps}
          />

          <Logic
            id="T6"
            q="Cost override"
            a={'number'}
            parms={parms}
            cond={parms.T1 === 'Yes' && parms.T2 === 'No'}
            ps={ps}
          />

          {
            parms.T1 === 'Yes' &&
            <Logic
              id="T7"
              q={parms.T2 === 'Yes' ? 'There is no cost associated with cover crop seedbed preparation.' : 'Cost of seedbed preparation necessary for cover cropping.'}
              a={parms.T7}
              parms={parms}
              ps={ps}
            />
          }
        </tbody>
      </table>

      <hr/>
      <div>
        <button onClick={() => setScreen('Planting') }>Next</button>
      </div>
      <hr/>

      <Activity db={db} parms={parms} ps={ps} sets={sets} />
    </div>
  )
} // Seedbed

Seedbed.menu = 'Seedbed preparation';

export default Seedbed;