import Activity from './Activity';
import {Navigation} from './Navigation';
import Logic from './Logic';

const dollars = (n) => isFinite(n) ? '$' + (+n).toFixed(2) : '';

const Planting = ({db, parms, props, set}) => {
  return (
    <>
      <div className="Planting">
        <h1>Economic Decision Aid for Cover Crops: Planting Decisions</h1>
        <div id="About">
          Decisions surrounding cover crop decisions require understanding how they will be impacted by the prior cash crop.
          Only activities that are incurred because a cover crop is planted are charged to the cover crop.
          If you were going to do the activity without planting a cover crop, its cost is not considered a cost of growing the cover crop.
        </div>
        <hr/>

        <strong>Cover Crop Establishment</strong>
        <table className="planting">
          <tbody>
            <tr>
              <th colSpan="2">Planting</th>
            </tr>

            <Logic
              id="planting3"
              q="Who will do this activity?"
              a={['Self', 'Custom Operator']}
              parms={parms}
              props={props}
            />

            <Logic
              id="planting4"
              q="What type of seedbed preparation will be done?"
              a={['', ...Object.keys(db.implements).filter(key => db.implements[key].type === 'Planting').sort()]}
              parms={parms}
              props={props}
              cond={parms.planting3 === 'Self'}
            />

            <Logic
              id="plantingPower"
              q="What power will be used?"
              a={['', ...Object.keys(db.power)]}
              parms={parms}
              props={props}
              cond={parms.planting4 && parms.planting3 === 'Self'}
            />

            <Logic
              id="plantingAnnualUseAcres"
              q="Annual Use (acres on implement)"
              a={parms.plantingAnnualUseAcres.toString()}
              parms={parms}
              props={props}
              cond={parms.planting4 && parms.planting3 === 'Self'}
            />

            <Logic
              id="plantingAnnualUseHours"
              q="Annual Use (hours on power)"
              a={parms.plantingAnnualUseHours.toString()}
              parms={parms}
              props={props}
              cond={parms.planting4 && parms.planting3 === 'Self'}
            />

            <Logic
              id="plantingAcresHour"
              q="Acres/hour"
              a={parms.plantingAcresHour.toString()}
              parms={parms}
              props={props}
              cond={parms.planting4 && parms.planting3 === 'Self'}
            />

            <Logic
              id="plantingTotal"
              q={parms.planting3 === 'Self' ? `Estimated relevant cost (${dollars(parms.plantingEstimated)}/acre)` : `Estimated custom cost (${dollars(parms.plantingTotal)}/acre)`}
              a={'dollar'}
              parms={parms}
              props={props}
            />
          </tbody>
        </table>
      </div>
      <Navigation set={set} current={Planting} />

      <Activity db={db} parms={parms} props={props} set={set} type="planting" />
    </>
  )
} // Planting

Planting.menu = 'Planting decisions';

export default Planting;