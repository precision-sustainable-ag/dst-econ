import Activity from './Activity';
import {Navigation} from './Navigation';
import Logic from './Logic';

const dollars = (n) => isFinite(n) ? '$' + (+n).toFixed(2) : '';

const Seedbed = ({db, parms, props, set}) => {
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
        <table className="seedbed">
          <tbody>
            <tr>
              <th colSpan="2">Seedbed preparation</th>
            </tr>
            
            <Logic
              id="seedbed1"
              q="Will you do cover crop seedbed preparation prior to planting the cover crop?"
              a={['Yes', 'No']}
              parms={parms}
              props={props}
            />

            <Logic
              id="seedbed2"
              q="Would you do this field activity if not planting a cover crop?"
              a={['Yes', 'No']}
              parms={parms}
              cond={parms.seedbed1 === 'Yes'}
              props={props}
            />

            <Logic
              id="seedbed3"
              q="Who will do this activity?"
              a={['Self', 'Custom Operator']}
              parms={parms}
              cond={parms.seedbed1 === 'Yes' && parms.seedbed2 === 'No'}
              props={props}
            />

            <Logic
              id="seedbed4"
              q="What type of seedbed preparation will be done?"
              a={['', ...Object.keys(db.implements).filter(key => db.implements[key].type === 'Tillage').sort()]}
              parms={parms}
              cond={parms.seedbed1 === 'Yes' && parms.seedbed2 === 'No' && parms.seedbed3 === 'Self'}
              props={props}
            />

            <Logic
              id="seedbedPower"
              q="What power will be used?"
              a={['', ...Object.keys(db.power)]}
              parms={parms}
              props={props}
              cond={parms.seedbed4 && parms.seedbed3 === 'Self'}
            />

            <Logic
              id="seedbedAnnualUseAcres"
              q="Annual Use (acres on implement)"
              a={parms.seedbedAnnualUseAcres.toString()}
              parms={parms}
              props={props}
              cond={parms.seedbed4 && parms.seedbed3 === 'Self'}
            />

            <Logic
              id="seedbedAnnualUseHours"
              q="Annual Use (hours on power)"
              a={parms.seedbedAnnualUseHours.toString()}
              parms={parms}
              props={props}
              cond={parms.seedbed4 && parms.seedbed3 === 'Self'}
            />

            <Logic
              id="seedbedAcresHour"
              q="Acres/hour"
              a={parms.seedbedAcresHour.toString()}
              parms={parms}
              props={props}
              cond={parms.seedbed4 && parms.seedbed3 === 'Self'}
            />

            <Logic
              id="seedbedTotal"
              q={parms.seedbed3 === 'Self' ? `Estimated relevant cost (${dollars(parms.seedbedEstimated)}/acre)` : `Estimated custom cost (${dollars(parms.seedbedTotal)}/acre)`}
              a={'dollar'}
              parms={parms}
              cond={parms.seedbed1 === 'Yes' && parms.seedbed2 === 'No'}
              props={props}
            />
          </tbody>
        </table>
      </div>
      <Navigation set={set} current={Seedbed} />

      <Activity db={db} parms={parms} props={props} set={set} type="seedbed" />
    </>
  )
} // Seedbed

Seedbed.menu = 'Seedbed preparation';

export default Seedbed;