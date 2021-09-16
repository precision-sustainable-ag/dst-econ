import Activity from './Activity';
import {Navigation} from './Navigation';

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

const Planting = ({setScreen, db, parms, ps, sets}) => {
  return (
    <div className="Planting">
      <h1>Economic Decision Aid for Cover Crops: Planting Decisions</h1>
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
            <th colSpan="2">Planting</th>
          </tr>

          <Logic
            id="P3"
            q="Who will do this activity?"
            a={['Self', 'Custom Operator']}
            parms={parms}
            ps={ps}
          />

          <Logic
            id="P4"
            q="What type of seedbed preparation will be done?"
            a={['', ...Object.keys(db.planting)]}
            parms={parms}
            ps={ps}
            cond={parms.P3 === 'Self'}
          />

          <Logic
            id="P5"
            q={parms.P3 === 'Self' ? 'Estimated relevant cost ($/acre)' : 'Estimated custom cost ($/acre)'}
            a={parms.P5}
            parms={parms}
            ps={ps}
          />

          <Logic
            id="P6"
            q="Cost override"
            a={'number'}
            parms={parms}
            ps={ps}
          />

          <Logic
            id="P7"
            q="Cost of planting activity necessary for cover cropping."
            a={parms.P7}
            parms={parms}
            ps={ps}
          />

          <Logic
            id="Total"
            q="Total cost of seedbed preparation and planting ($/acre)"
            a={(+parms.T7 + +parms.P7).toFixed(2)}
            parms={parms}
            ps={ps}
          />

        </tbody>
      </table>
      
      <Navigation setScreen={setScreen} current={Planting} />

      <Activity db={db} parms={parms} ps={ps} sets={sets} />
    </div>
  )
} // Planting

Planting.menu = 'Planting decisions';


export default Planting;