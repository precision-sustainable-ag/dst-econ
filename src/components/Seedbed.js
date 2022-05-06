import Activity from './Activity';
import Logic from './Logic';
import {useEffect} from 'react';

import {useSelector, useDispatch} from 'react-redux';
import {get, set, db, dollars, data, power, match, totalRelevantCost} from '../app/store';

const Seedbed = () => {
  const dispatch = useDispatch();
  const current  = 'seedbed';
  const state    = useSelector(get[current]);

  useEffect(() => {
    dispatch(set.current(current));
  });

  const total     = state.total;
  const estimated = current ? totalRelevantCost() : 0;

  return (
    <>
      <form>
        <h1>Economic Decision Aid for Cover Crops: Seedbed Preparation</h1>
        <div id="About">
          Decisions surrounding cover crop decisions require understanding how they will be impacted by the prior cash crop.
          Only activities that are incurred because a cover crop is planted are charged to the cover crop.
          If you were going to do the activity without planting a cover crop, its cost is not considered a cost of growing the cover crop.
        </div>
        <hr/>

        <strong>Cover Crop Establishment</strong>
        <table className={current}>
          <tbody>
            <tr>
              <th colSpan="2">Seedbed preparation</th>
            </tr>
            
            <Logic
              id="q1"
              q="Will you do cover crop seedbed preparation prior to planting the cover crop?"
              a={['Yes', 'No']}
              onInput={(e) => {
                if (e.target.value === 'No') {
                  dispatch(set.screen('Planting'));
                }
              }}
            />

            <Logic
              id="q2"
              q="Would you do this field activity if not planting a cover crop?"
              a={['Yes', 'No']}
              shown={match('q1', 'Yes', current)}
              onInput={(e) => {
                if (e.target.value === 'Yes') {
                  dispatch(set.screen('Planting'));
                }
              }}
            />

            <Logic
              id="q3"
              q="Who will do this activity?"
              a={['Self', 'Custom Operator']}
              shown={match('q2', 'No', current)}
            />

            <Logic
              id="q4"
              q="What type of seedbed preparation will be done?"
              a={['', ...Object.keys(db.implements).filter(key => db.implements[key].type === 'Tillage').sort()]}
              shown={match('q3', 'Self', current)}
              onInput={() => {
                dispatch(set[current]({key: 'power', value: data('default power unit')}));
                dispatch(set[current]({key: 'total', value: totalRelevantCost()}));
                dispatch(set[current]({key: 'edited', value: false}));
              }}
            />

            <Logic
              id="power"
              q="What power will be used?"
              a={['', ...Object.keys(db.power)]}
              shown={state.q4}
              onInput={() => {
                dispatch(set[current]({key: 'total', value: totalRelevantCost()}));
                dispatch(set[current]({key: 'edited', value: false}));
              }}
            />

            <Logic
              q="Annual Use (acres on implement)"
              a={data('acres/year', 0)}
              shown={state.q4}
            />

            <Logic
              q="Annual Use (hours on power)"
              a={power('expected use (hr/yr)')}
              shown={state.q4}
            />

            <Logic
              q="Acres/hour"
              a={data('acres/hour', 1)}
              shown={state.q4}
            />

            <Logic
              id="total"
              q={match('q3', 'Self', current) ? `Estimated relevant cost (${dollars(estimated)}/acre)` : `Estimated custom cost (${dollars(total)}/acre)`}
              a={'dollar'}
              onInput={(e) => {
                dispatch(set[current]({key: 'edited', value: e.target.value > ''}));
              }}
            />
          </tbody>
        </table>
      </form>

      <Activity type={current}/>
    </>
  )
} // Seedbed

Seedbed.menu = 'Seedbed preparation';

export default Seedbed;
