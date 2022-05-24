import Activity from './Activity';
import Logic from './Logic';
import {useEffect} from 'react';

import {useSelector, useDispatch} from 'react-redux';
import {get, set, match, totalRelevantCost, queue} from '../store/store';

const Seedbed = () => {
  console.log('Render: Seedbed');
  const dispatch = useDispatch();
  const current = 'seedbed';
  useSelector(get.current);
  useSelector(get.shown[current]);
  const state = useSelector(get[current]);

  useEffect(() => {
    dispatch(set.current(current));
  }, [dispatch, current]);

  const estimated = totalRelevantCost();

  return (
    <>
      <h1>Economic Decision Aid for Cover Crops: Seedbed Preparation</h1>
      <div id="About">
        Decisions surrounding cover crop decisions require understanding how they will be impacted by the prior cash crop.
        Only activities that are incurred because a cover crop is planted are charged to the cover crop.
        If you were going to do the activity without planting a cover crop, its cost is not considered a cost of growing the cover crop.
      </div>
      <hr/>

      <strong>Cover Crop Establishment</strong>
      <form>
        <table className={current + ' inputs'}>
          <tbody>
            <tr>
              <th colSpan="2">Seedbed preparation</th>
            </tr>
            
            <Logic
              property="q1"
              q="Will you do cover crop seedbed preparation prior to planting the cover crop?"
              a={['Yes', 'No']}
            />

            <Logic
              property="q2"
              q="Would you do this field activity if not planting a cover crop?"
              a={['Yes', 'No']}
              shown={match('q1', 'Yes', current)}
            />

            <Logic
              property="q3"
              q="Who will do this activity?"
              a={['Self', 'Custom Operator']}
              shown={match('q2', 'No', current)}
            />

            <Logic
              property="q4"
              q="What type of seedbed preparation will be done?"
              type="Tillage"
            />

            <Logic question="power" />
            <Logic question="Annual Use (acres on implement)" />
            <Logic question="Annual Use (hours on power)" />
            <Logic question="Acres/hour" />
            <Logic question="Estimated" total={state.total} estimated={estimated} />
          </tbody>
        </table>
      </form>
      <button
        onClick={() => {
          queue(() => dispatch(set.seedbed.q1('Yes')));
          queue(() => dispatch(set.seedbed.q2('No')));
          queue(() => dispatch(set.seedbed.q3('Self')));
          queue(() => dispatch(set.seedbed.q4('Chisel Plow; 15 Ft')));
          queue(() => dispatch(set.seedbed.power('350 HP Tracked Tractor')));
          queue(() => dispatch(set.focus('seedbed.total')));
        }}
      >
        Test data
      </button>
      <Activity type={current} />
    </>
  )
} // Seedbed

Seedbed.menu = 'Seedbed preparation';

export default Seedbed;
