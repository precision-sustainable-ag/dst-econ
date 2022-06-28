import Activity from './Activity';
import {Input} from './Inputs';

import {ClearInputs} from './ClearInputs';
import {useSelector, useDispatch} from 'react-redux';
import {get, set, dollars, getDefaults, test, db} from '../store/store';

const defaults = getDefaults('fertN|fertP|fertK|$fertN|$fertP|$fertK|useFertilizer|fertNAdded|fertPAdded|fertKAdded|$fertApplication|$fertCredit|$fertCost|fertility.total');

const Fertility = () => {
  const dispatch = useDispatch();
  const current = 'fertility';
  const dev         = useSelector(get.dev);

  const useFertilizer     = useSelector(get.useFertilizer) === 'Yes';
  const $fertN            = useSelector(get.$fertN);
  const dfertN            = db.rates.Nitrogen.value;
  const $fertCost         = useSelector(get.$fertCost);
  const total             = useSelector(get.fertility.total);
  const $fertApplication  = useSelector(get.$fertApplication);
  const dFertApplication  = db.costDefaults['Custom Fertilizer Appl'].cost;
  const $fertCredit       = useSelector(get.$fertCredit);

  return (
    <div className="Fertility">
      <form>
        <h1>Economic Decision Aid for Cover Crops: Fertility</h1>
        <table>
          <thead>
            <tr><th colSpan={4}><ClearInputs defaults={defaults} /></th></tr>
          </thead>
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
              <td><Input id="$fertN" value={$fertN ?? dfertN} /></td>
              <td><Input id="$fertP" /></td>
              <td><Input id="$fertK" /></td>
            </tr>

            <tr>
              <td>Will you add fertilizer specifically for cover crop production?</td>
              <td>
                <Input
                  id="useFertilizer"
                  options={['Yes', 'No']}
                  type="radio"
                  row
                />
              </td>
            </tr>

            {
              useFertilizer && (
                <tr>
                  <td>Fertilizer added for cover crop production (pounds/acre)</td>
                  <td><Input id="fertNAdded" /></td>
                  <td><Input id="fertPAdded" /></td>
                  <td><Input id="fertKAdded" /></td>
                </tr>
              )
            }

            <tr>
              <td>Cost of fertilizer application</td>
              <td><Input id="$fertApplication" value={$fertApplication ?? dFertApplication}/></td>
            </tr>
            <tr>
              <td>Value of fertilizer credit from cover crops ($/acre)</td>
              <td>{dollars($fertCredit)}</td>
            </tr>
            <tr>
              <td>Total cost of fertilizer for cover crop production ($/acre)</td>
              <td>{dollars($fertCost)}</td>
            </tr>
            <tr>
              <td>Net fertility impact of cover crops ($/acre)</td>
              <td>{dollars(total)}</td>
            </tr>
          </tbody>
        </table>
      </form>
      {
        dev && (
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
              test('fertility.total', 0.5);
            }}
          >
            Test data
          </button>
        )
      }
      <Activity type={current}/>
    </div>
  )
} // Fertility

Fertility.menu = <span><u>F</u>ertility</span>;

export default Fertility;