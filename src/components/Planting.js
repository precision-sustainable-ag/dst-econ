import Activity from './Activity';
import Logic from './Logic';
import {useEffect} from 'react';
import {ClearInputs} from './ClearInputs';

import {useSelector, useDispatch} from 'react-redux';
import {get, set, queue, getDefaults, test} from '../store/store';

const defaults = getDefaults('planting.total|planting.q1|planting.q2|planting.q3|planting.implement|planting.power|planting.implementsCost|planting.powerCost|planting.Labor|planting.Fuel|planting.Depreciation|planting.Interest|planting.Repairs|planting.Taxes|planting.Insurance|planting.Storage');

const Planting = () => {
  // console.log('Render: Planting');
  const dispatch = useDispatch();
  const current = 'planting';
  const dev = useSelector(get.dev);
  const estimated = useSelector(get[current].estimated);

  useSelector(get.current);
  useSelector(get.shown[current]);
  const state = useSelector(get[current]);

  useEffect(() => {
    dispatch(set.current(current));
  }, [dispatch, current]);

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
              <th colSpan="2">
                Planting
                <ClearInputs defaults={defaults} />
              </th>
            </tr>

            <Logic
              current={current}
              property="implement"
              q="How will planting be done?"
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
      {
        dev && (
          <button
            onClick={() => {
              dispatch(set.planting.q3('Self'));
              queue(() => {
                dispatch(set.planting.implement('Presswheel Drill; 16 Ft'));
                test('planting.power', '105 HP MFWD Tractor');
                test('planting.annualUseAcres', 509);
                test('planting.annualUseHours', 450);
                test('planting.acresHour', 6.79);
                test('planting.estimated', 17.60);
                test('planting.total', 17.60);
              });
            }}
          >
            Test data
          </button>
        )
      }
      <Activity type={current}/>
    </>
  )
} // Planting

Planting.menu = <span>P<u>l</u>anting decisions</span>;

export default Planting;
