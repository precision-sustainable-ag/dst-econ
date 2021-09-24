import Activity from './Activity';
import {Navigation} from './Navigation';
import Logic from './Logic';

const dollars = (n) => isFinite(n) ? '$' + (+n).toFixed(2) : '';

const Seedbed = ({setScreen, db, parms, ps, sets}) => {
  return (
    <>
      <div>
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
              id="seedbed1"
              q="Will you do cover crop seedbed preparation prior to planting the cover crop?"
              a={['Yes', 'No']}
              parms={parms}
              ps={ps}
            />

            <Logic
              id="seedbed2"
              q="Would you do this field activity if not planting a cover crop?"
              a={['Yes', 'No']}
              parms={parms}
              cond={parms.seedbed1 === 'Yes'}
              ps={ps}
            />

            <Logic
              id="seedbed3"
              q="Who will do this activity?"
              a={['Self', 'Custom Operator']}
              parms={parms}
              cond={parms.seedbed1 === 'Yes' && parms.seedbed2 === 'No'}
              ps={ps}
            />

            <Logic
              id="seedbed4"
              q="What type of seedbed preparation will be done?"
              a={['', ...Object.keys(db.seedbed)]}
              parms={parms}
              cond={parms.seedbed1 === 'Yes' && parms.seedbed2 === 'No' && parms.seedbed3 === 'Self'}
              ps={ps}
            />

            <Logic
              id="seedbed6"
              q={parms.seedbed3 === 'Self' ? `Estimated relevant cost (${dollars(parms.seedbed5)}/acre)` : `Estimated custom cost (${dollars(parms.seedbed5)}/acre)`}
              a={'number'}
              parms={parms}
              cond={parms.seedbed1 === 'Yes' && parms.seedbed2 === 'No'}
              ps={ps}
            />
            {/*
              <Logic
                id="seedbed6"
                q="Cost override"
                a={'number'}
                parms={parms}
                cond={parms.seedbed1 === 'Yes' && parms.seedbed2 === 'No'}
                ps={ps}
              />

              {
                parms.seedbed1 === 'Yes' &&
                <Logic
                  id="seedbed7"
                  q={parms.seedbed2 === 'Yes' ? 'There is no cost associated with cover crop seedbed preparation.' : 'Cost of seedbed preparation necessary for cover cropping.'}
                  a={parms.seedbed7}
                  parms={parms}
                  ps={ps}
                />
              }
            */}
          </tbody>
        </table>
      </div>
      <Navigation setScreen={setScreen} current={Seedbed} />

      <Activity db={db} parms={parms} ps={ps} sets={sets} type="seedbed" />
    </>
  )
} // Seedbed

Seedbed.menu = 'Seedbed preparation';

export default Seedbed;