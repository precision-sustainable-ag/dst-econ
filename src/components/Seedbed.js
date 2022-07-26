import Activity from './Activity';
import Logic from './Logic';
import {useEffect} from 'react';
import {ClearInputs} from './ClearInputs';

import {useSelector, useDispatch} from 'react-redux';
import {get, set, queue, getDefaults, test} from '../store/store';

const defaults = getDefaults('seedbed.total|seedbed.q1|seedbed.implement|seedbed.power|seedbed.implementsCost|seedbed.powerCost|seedbed.Labor|seedbed.Fuel|seedbed.Depreciation|seedbed.Interest|seedbed.Repairs|seedbed.Taxes|seedbed.Insurance|seedbed.Storage|seedbed.annualUseAcres|seedbed.acresHour|seedbed.annualUseHours');

const Seedbed = () => {
  // console.log('Render: Seedbed');
  const dispatch = useDispatch();
  const current = 'seedbed';
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
              <th colSpan="2">
                Seedbed preparation
                <ClearInputs defaults={defaults} />
              </th>
            </tr>
            
            <Logic
              current={current}
              property="q1"
              q="Will you do a field activity to prepare for cover crop planting, which would not normally be done on this field without cover crops?"
              a={['Yes', 'No']}
            />

            <Logic
              current={current}
              property="implement"
              q="What type of seedbed preparation will be done?"
              type="Tillage"
              shown={state.q1 === 'Yes'}
            />

            <Logic current={current} question="power" />
            <Logic current={current} question="Annual Use (acres on implement)" />
            <Logic current={current} question="Annual Use (hours on power)" />
            <Logic current={current} question="Acres/hour" />
            <Logic 
              current={current}
              question="Estimated"
              total={Number.isFinite(state.total) ? state.total : estimated}
              estimated={estimated} 
            />
          </tbody>
        </table>
      </form>
      {
        dev && (
          <button
            onClick={() => {
              dispatch(set.seedbed.q1('Yes'));
              queue(() => {
                dispatch(set.seedbed.implement('Chisel Plow, Front Dsk; 16.3 Ft'));
                test('seedbed.power', '200 HP MFWD Tractor');
                test('seedbed.annualUseAcres', 670);
                test('seedbed.annualUseHours', 500);
                test('seedbed.acresHour', 8.37);
                test('seedbed.estimated', 18.34);
                test('seedbed.total', 18.34);
              });
            }}
          >
            Test data
          </button>
        )
      }
      <Activity type={current} />
    </>
  )
} // Seedbed

Seedbed.menu = <span><u>S</u>eedbed preparation</span>;

export default Seedbed;
