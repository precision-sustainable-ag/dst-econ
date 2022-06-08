import Activity from './Activity';
import Logic from './Logic';
import {useEffect} from 'react';

import {useSelector, useDispatch} from 'react-redux';
import {get, set, match, totalRelevantCost, queue, getDefaults, clearInputs} from '../store/store';

const defaults = {
  'seedbed.total': 0,
  'seedbed.q1': ''
};

const Seedbed = () => {
  console.log('Render: Seedbed');
  const dispatch = useDispatch();
  const current = 'seedbed';
  const dev = useSelector(get.dev);

  useSelector(get.current);
  useSelector(get.shown[current]);
  const state = useSelector(get[current]);

  useEffect(() => {
    dispatch(set.current(current));
  }, [dispatch, current]);

  useEffect(() => {
    getDefaults(Seedbed, defaults);
    console.log(defaults);
  }, []);

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
              current={current}
              property="q1"
              q="Will you do cover crop seedbed preparation prior to planting the cover crop?"
              a={['Yes', 'No']}
            />

            <Logic
              current={current}
              property="q2"
              q="Would you do this field activity if not planting a cover crop?"
              a={['Yes', 'No']}
              shown={match('q1', 'Yes', current)}
            />

            <Logic
              current={current}
              property="q3"
              q="Who will do this activity?"
              a={['Self', 'Custom Operator']}
              shown={match('q2', 'No', current)}
            />

            <Logic
              current={current}
              property="implement"
              q="What type of seedbed preparation will be done?"
              type="Tillage"
            />

            <Logic current={current} question="power" />
            <Logic current={current} question="Annual Use (acres on implement)" />
            <Logic current={current} question="Annual Use (hours on power)" />
            <Logic current={current} question="Acres/hour" />
            <Logic current={current} question="Estimated" total={state.total} estimated={estimated} />
          </tbody>
        </table>
      </form>
      {
        dev && (
          <button
            onClick={() => {
              queue(() => dispatch(set.seedbed.q1('Yes')));
              queue(() => dispatch(set.seedbed.q2('No')));
              queue(() => dispatch(set.seedbed.q3('Self')));
              queue(() => dispatch(set.seedbed.implement('Chisel Plow; 15 Ft')));
              queue(() => dispatch(set.seedbed.power('350 HP Tracked Tractor')));
              queue(() => dispatch(set.seedbed.edited(true)));
              queue(() => dispatch(set.focus('seedbed.total')));
            }}
          >
            Test data
          </button>
        )
      }
      <button
        onClick={() => clearInputs(defaults)}
      >
        Clear inputs
      </button>

      <Activity type={current} />
    </>
  )
} // Seedbed

Seedbed.menu = 'Seedbed preparation';

export default Seedbed;
