import Activity from './Activity';
import {useEffect} from 'react';
import {Input} from './Inputs';

import {useSelector, useDispatch} from 'react-redux';
import {get, set, db, dollars} from '../store/store';

const Fertility = () => {
  const dispatch = useDispatch();
  const current  = 'fertility';
  const useFertilizer = useSelector(get.useFertilizer) === 'Yes';

  const fertN       = useSelector(get.fertN) || 0;
  const fertP       = useSelector(get.fertP) || 0;
  const fertK       = useSelector(get.fertK) || 0;
  const $fertN      = useSelector(get.$fertN) || 0;
  const $fertP      = useSelector(get.$fertP) || 0;
  const $fertK      = useSelector(get.$fertK) || 0;
  const fertNAdded  = useSelector(get.fertNAdded) || 0;
  const fertPAdded  = useSelector(get.fertPAdded) || 0;
  const fertKAdded  = useSelector(get.fertKAdded) || 0;
  const $fertApplication = useSelector(get.$fertApplication) || 0;

  const $fertCredit = fertN * $fertN + fertP * $fertP + fertK * $fertK;
  const $totalCost = -(fertNAdded * $fertN + fertPAdded * $fertP + fertKAdded * $fertK) - $fertApplication;
  const $fertNet = $fertCredit + $totalCost;

  useEffect(() => {
    dispatch(set.current(current));
    dispatch(set.fertility({property: 'total', value: $fertNet}));
  }, [dispatch, current, $fertNet]);

  useEffect(() => {
    if (!$fertN) {
      dispatch(set.$fertN(db.rates.Nitrogen.value));
    }
    if (!$fertApplication) {
      dispatch(set.$fertApplication(db.costDefaults['Custom Fertilizer Appl'].cost));
    }
    if (!useFertilizer) {
      dispatch(set.fertNAdded(0));
      dispatch(set.fertPAdded(0));
      dispatch(set.fertKAdded(0));
    }
  }, [dispatch, $fertN, $fertApplication, useFertilizer]);

  return (
    <div className="Fertility">
      <form>
        <h1>Economic Decision Aid for Cover Crops: Fertility</h1>
        <table>
          <tbody>
            <tr>
              <td/>
              <th>N<br/>(pounds/acre)</th>
              <th>P<sub>2</sub>O<sub>5</sub><br/>(pounds/acre)</th>
              <th>K<sub>2</sub>O<br/>(pounds/acre)</th>
            </tr>
            <tr>
              <td>Expected fertilizer credit from your cover crop species (pounds/acre).</td>
              <td><Input id="fertN" autoFocus /></td>
              <td><Input id="fertP"           /></td>
              <td><Input id="fertK"           /></td>
            </tr>
            <tr>
              <td>Fertilizer value ($/pound of nutrient)</td>
              <td><Input id="$fertN" /></td>
              <td><Input id="$fertP" /></td>
              <td><Input id="$fertK" /></td>
            </tr>

            <tr>
              <td>Will you add fertilizer specifically for cover crop production?</td>
              <Input
                id="useFertilizer"
                options={['Yes', 'No']}
                type="radio"
                row
                onChange={(e) => {
                  if (e.target.value === 'Yes') {
                    dispatch(set.focus('fertNAdded'));
                  } else {
                    dispatch(set.focus('$fertApplication'));
                  }
                }}
              />
            </tr>

            {
              !useFertilizer ? null :
              (
                <>
                  <tr>
                    <td>Fertilizer added for cover crop production (pounds/acre)</td>
                    <td><Input id="fertNAdded" /></td>
                    <td><Input id="fertPAdded" /></td>
                    <td><Input id="fertKAdded" /></td>
                  </tr>
                </>
              )
            }

            <tr>
              <td>Cost of fertilizer application</td>
              <td><Input id="$fertApplication"/></td>
            </tr>
            <tr>
              <td>Value of fertilizer credit from cover crops ($/acre)</td>
              <td>{dollars($fertCredit)}</td>
            </tr>
            <tr>
              <td>Total cost of fertilizer for cover crop production ($/acre)</td>
              <td>{dollars($totalCost)}</td>
            </tr>
            <tr>
              <td>Net fertility impact of cover crops ($/acre)</td>
              <td>{dollars($fertNet)}</td>
            </tr>
          </tbody>
        </table>
      </form>
      <button
        onClick={() => {
          dispatch(set.fertN(30));
          dispatch(set.fertP(0));
          dispatch(set.fertK(0));
          dispatch(set.$fertN(.75));
          dispatch(set.$fertP(.60));
          dispatch(set.$fertK(.50));
          dispatch(set.fertNAdded(0));
          dispatch(set.fertPAdded(15));
          dispatch(set.fertKAdded(10));
          dispatch(set.$fertApplication(8));
          dispatch(set.useFertilizer('Yes'));
        }}
      >
        Test data
      </button>
      <Activity type={current}/>
    </div>
  )
} // Fertility

export default Fertility;