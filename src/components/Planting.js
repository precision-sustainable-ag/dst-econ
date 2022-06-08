import Activity from './Activity';
import Logic from './Logic';
import {useEffect} from 'react';

import {useSelector, useDispatch} from 'react-redux';
import {get, set, totalRelevantCost} from '../store/store';

const Planting = () => {
  console.log('Render: Planting');
  const dispatch = useDispatch();
  const current = 'planting';
  useSelector(get.current);
  useSelector(get.shown[current]);
  const state = useSelector(get[current]);

  useEffect(() => {
    dispatch(set.current(current));
  }, [dispatch, current]);

  const estimated = totalRelevantCost();

  return (
    <>
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
              current={current}
              property="q3"
              q="Who will do this activity?"
              a={['Self', 'Custom Operator']}
            />

            <Logic
              current={current}
              property="implement"
              q="What type of seedbed preparation will be done?"
              type="Planting"
            />

            <Logic current={current} question="power" />
            <Logic current={current} question="Annual Use (acres on implement)" />
            <Logic current={current} question="Annual Use (hours on power)" />
            <Logic current={current} question="Acres/hour" />
            <Logic current={current} question="Estimated" total={state.total} estimated={estimated} />
          </tbody>
        </table>
      </form>

      <Activity type={current}/>
    </>
  )
} // Planting

Planting.menu = 'Planting decisions';

export default Planting;
