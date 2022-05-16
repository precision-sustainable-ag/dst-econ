import Activity from './Activity';
import Logic from './Logic';
import {useEffect} from 'react';

import {useSelector, useDispatch} from 'react-redux';
import {get, set, db, data, match, totalRelevantCost} from '../store/store';

const Seedbed = () => {
  const dispatch = useDispatch();
  const current = 'seedbed';
  useSelector(get.current);
  const state = useSelector(get[current]);
  
  useEffect(() => {
    dispatch(set.current(current));
  }, [dispatch, current]);

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
        <table className={current + ' inputs'}>
          <tbody>
            <tr>
              <th colSpan="2">Seedbed preparation</th>
            </tr>
            
            <Logic
              property="q1"
              q="Will you do cover crop seedbed preparation prior to planting the cover crop?"
              a={['Yes', 'No']}
              onInput={(e) => {
                if (e.target.value === 'No') {
                  dispatch(set.screen('Planting'));
                }
              }}
            />

            <Logic
              property="q2"
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
              property="q3"
              q="Who will do this activity?"
              a={['Self', 'Custom Operator']}
              shown={match('q2', 'No', current)}
            />

            <Logic
              property="q4"
              q="What type of seedbed preparation will be done?"
              a={['', ...Object.keys(db.implements).filter(key => db.implements[key].type === 'Tillage').sort()]}
              shown={match('q3', 'Self', current)}
              onInput={() => {
                dispatch(set[current]({property: 'power', value: data('default power unit')}));
                dispatch(set[current]({property: 'total', value: totalRelevantCost()}));
                dispatch(set[current]({property: 'edited', value: false}));
              }}
            />

            <Logic question="power" />
            <Logic question="Annual Use (acres on implement)" />
            <Logic question="Annual Use (hours on power)" />
            <Logic question="Acres/hour" />
            <Logic question="Estimated" total={total} estimated={estimated} />
          </tbody>
        </table>
      </form>
      <button
        onClick={() => {
          dispatch(set.seedbed({property: 'q1', value: 'Yes'}));
          dispatch(set.seedbed({property: 'q2', value: 'No'}));
          dispatch(set.seedbed({property: 'q3', value: 'Self'}));
          dispatch(set.seedbed({property: 'q4', value: 'Chisel Plow; 15 Ft'}));
          dispatch(set.seedbed({property: 'power', value: '350 HP Tracked Tractor'}));

          // TODO:
            dispatch(set.screen('Home'));
            setTimeout(() => {dispatch(set.screen('Seedbed'))}, 10);
            setTimeout(() => {dispatch(set.screen('Home'))}, 20);
            setTimeout(() => {dispatch(set.screen('Seedbed'))}, 30);
            setTimeout(() => {dispatch(set.screen('Home'))}, 40);
            setTimeout(() => {dispatch(set.screen('Seedbed'))}, 50);
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
