import Logic from '../Logic';
import {useEffect} from 'react';
import {ClearInputs} from '../ClearInputs';

import {useSelector, useDispatch} from 'react-redux';
import {get, set, queue, getDefaults, test} from '../../store/Store';

const defaults = getDefaults('planting.total|planting.q1|planting.q2|planting.implement|planting.power|planting.implementsCost|planting.powerCost|planting.Labor|planting.Fuel|planting.Depreciation|planting.Interest|planting.Repairs|planting.Taxes|planting.Insurance|planting.Storage');

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
      <h1>Planting Decisions</h1>
      <div id="About">
        <p>
          In order to accurately evaluate the economic impact of implementing cover crops into your rotation, we only want to consider management decisions directly associated with the use of cover crops.
          In this module we will consider any activity associated with planting cover crops, but only new activity.
          There are many potential options for planting cover crops; including aerial application.
          Input per acre costs associated with using an airplane by selecting "hire custom operator" on the drop-down menu.
          As another example, if utilizing a no-til drill to plant cover crops select the appropriate equipment on the drop-down menu and proceed to answer questions on tractor horsepower.
        </p>
        <p>
          Also, the costs associated with machinery are dependent upon the annual hours of use.
          In this module you can accept the default value (for hours of annual use) or customize with the estimated hours associated with your operation.
          This will more accurately represent costs in your operation.
        </p>
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
    </>
  )
} // Planting

Planting.menu = <span>P<u>l</u>anting Decisions</span>;

export default Planting;
