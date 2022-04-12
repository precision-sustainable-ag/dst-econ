import Activity from './Activity';
import {Navigation} from './Navigation';
import Logic from './Logic';
import {Context, db} from './Store';
import {useContext} from 'react';

const Planting = () => {
  const {state, change, match, data, powerUnit, power, dollars} = useContext(Context);

  change('change', 'current', 'planting');

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
              initial="Self"
            />

            <Logic
              id="planting4"
              q="What type of seedbed preparation will be done?"
              a={['', ...Object.keys(db.implements).filter(key => db.implements[key].type === 'Planting').sort()]}
              cond={match('planting3', 'Self')}
              onInput={() => {
                change('change', 'plantingPower', '');
                change('change', 'plantingTotal', '');
                change('change', 'plantingEdited', false);
              }}
            />

            <Logic
              id="plantingPower"
              q="What power will be used?"
              a={['', ...Object.keys(db.power)]}
              cond={state.planting4}
              value={powerUnit}
              onInput={() => {
                change('change', 'plantingTotal', '');
                change('change', 'plantingEdited', false);
              }}
            />

            <Logic
              id="plantingAnnualUseAcres"
              q="Annual Use (acres on implement)"
              a={state.plantingAnnualUseAcres}
              cond={state.planting4}
              value={data('acres/year', 0)}
            />

            <Logic
              id="plantingAnnualUseHours"
              q="Annual Use (hours on power)"
              a={state.plantingAnnualUseHours}
              cond={state.planting4}
              value={power('expected use (hr/yr)')}
            />

            <Logic
              id="plantingAcresHour"
              q="Acres/hour"
              a={data('acres/hour', 1)}
              cond={state.planting4}
            />

            <Logic
              id="plantingTotal"
              q={state.planting3 === 'Self' ? `Estimated relevant cost (${dollars(state.plantingEstimated)}/acre)` : `Estimated custom cost (${dollars(state.plantingTotal)}/acre)`}
              a={'dollar'}
              onInput={() => {
                change('change', 'plantingEdited', true);
              }}
            />
          </tbody>
        </table>
      </div>

      <Navigation current={Planting} />

      <Activity type="planting" />
    </>
  )
} // Planting

Planting.menu = 'Planting decisions';

export default Planting;
