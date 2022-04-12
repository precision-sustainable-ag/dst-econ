import Activity from './Activity';
import {Navigation} from './Navigation';
import Logic from './Logic';
import {Context, db} from './Store';
import {useContext} from 'react';

const Seedbed = () => {
  const {state, change, match, data, powerUnit, power, dollars} = useContext(Context);

  change('change', 'current', 'seedbed');

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
              onInput={(e) => {
                if (e.target.value === 'No') {
                  change('change', 'screen', 'Planting');
                  change('change', 'previousScreen', 'Planting');
                }
              }}
            />

            <Logic
              id="seedbed2"
              q="Would you do this field activity if not planting a cover crop?"
              a={['Yes', 'No']}
              cond={match('seedbed1', 'Yes')}
              initial="No"
              onInput={(e) => {
                if (e.target.value === 'Yes') {
                  change('change', 'screen', 'Planting');
                  change('change', 'screen', 'Planting');
                }
              }}
            />

            <Logic
              id="seedbed3"
              q="Who will do this activity?"
              a={['Self', 'Custom Operator']}
              cond={match('seedbed2', 'No')}
              initial="Self"
            />

            <Logic
              id="seedbed4"
              q="What type of seedbed preparation will be done?"
              a={['', ...Object.keys(db.implements).filter(key => db.implements[key].type === 'Tillage').sort()]}
              cond={match('seedbed3', 'Self')}
              onInput={() => {
                change('change', 'seedbedPower', '');
                change('change', 'seedbedTotal', '');
                change('change', 'seedbedEdited', false);
              }}
            />

            <Logic
              id="seedbedPower"
              q="What power will be used?"
              a={['', ...Object.keys(db.power)]}
              cond={state.seedbed4}
              value={powerUnit}
              onInput={() => {
                change('change', 'seedbedTotal', '');
                change('change', 'seedbedEdited', false);
              }}
            />

            <Logic
              id="seedbedAnnualUseAcres"
              q="Annual Use (acres on implement)"
              a={state.seedbedAnnualUseAcres}
              cond={state.seedbed4}
              value={data('acres/year', 0)}
            />

            <Logic
              id="seedbedAnnualUseHours"
              q="Annual Use (hours on power)"
              a={state.seedbedAnnualUseHours}
              cond={state.seedbed4}
              value={power('expected use (hr/yr)')}              
            />

            <Logic
              id="seedbedAcresHour"
              q="Acres/hour"
              a={data('acres/hour', 1)}
              cond={state.seedbed4}
            />

            <Logic
              id="seedbedTotal"
              q={state.seedbed3 === 'Self' ? `Estimated relevant cost (${dollars(state.seedbedEstimated)}/acre)` : `Estimated custom cost (${dollars(state.seedbedTotal)}/acre)`}
              a={'dollar'}
              onInput={() => {
                change('change', 'seedbedEdited', true);
              }}
            />
          </tbody>
        </table>
      </div>
      
      <Navigation current={Seedbed} />

      <Activity type="seedbed" />
    </>
  )
} // Seedbed

Seedbed.menu = 'Seedbed preparation';

export default Seedbed;
