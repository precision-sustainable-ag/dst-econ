import Activity from './Activity';
import Logic from './Logic';
import {useEffect} from 'react';

import {useSelector, useDispatch} from 'react-redux';
import {get, set, db, data, match, totalRelevantCost} from '../store/store';

const Planting = () => {
  console.log('Render: Planting');
  const dispatch = useDispatch();
  const current  = 'planting';
  useSelector(get.current);
  const state = useSelector(get[current]);

  useEffect(() => {
    dispatch(set.current(current));
  }, [dispatch, current]);

  const total     = state.total;
  const estimated = current ? totalRelevantCost() : 0;

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
        <form>
          <table className={current + ' inputs'}>
            <tbody>
              <tr>
                <th colSpan="2">Planting</th>
              </tr>

              <Logic
                property="q3"
                q="Who will do this activity?"
                a={['Self', 'Custom Operator']}
              />

              <Logic
                property="q4"
                q="What type of seedbed preparation will be done?"
                a={['', ...Object.keys(db.implements).filter(key => db.implements[key].type === 'Planting').sort()]}
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
      </div>

      <Activity type={current}/>
    </>
  )
} // Planting

Planting.menu = 'Planting decisions';

export default Planting;
