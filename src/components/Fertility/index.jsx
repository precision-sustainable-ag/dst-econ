import React from 'react';
import { useSelector } from 'react-redux';
import Input from '../../shared/Inputs';
import ClearInputs from '../ClearInputs';
import Help from '../../shared/Help';
import {
  dev,
  get,
  dollars,
  getDefaults,
  db,
  exampleFertilityBenefit,
  exampleFertilityCost,
} from '../../store/Store';

import './styles.scss';

const defaults = getDefaults([
  'fertN',
  'fertP',
  'fertK',
  '$fertN',
  '$fertP',
  '$fertK',
  'useFertilizer',
  'fertNAdded',
  'fertPAdded',
  'fertKAdded',
  '$fertApplication',
  '$fertCredit',
  '$fertCost',
  'fertility.total',
]);

const Fertility = () => {
  const useFertilizer = useSelector(get.useFertilizer) === 'Yes';
  const mobile = useSelector(get.mobile);
  const $fertN = useSelector(get.$fertN);
  const dfertN = db.rates.Nitrogen.value;
  const $fertCost = useSelector(get.$fertCost);
  const total = useSelector(get.fertility.total);
  const $fertApplication = useSelector(get.$fertApplication) || 0;
  const dFertApplication = 0; // db.costDefaults['Custom Fertilizer Appl'].cost;
  const $fertCredit = useSelector(get.$fertCredit);

  return (
    <div id="Fertility">
      <form>
        <h1>Fertility</h1>
        <p>
          Integrating cover crops into your rotation can affect fertility in multiple ways.
          One of the most commonly cited impacts is incorporating a legume into your cover crop mix.
          Depending upon the species selected and maturity at termination the legume cover crop can provide a nitrogen credit for your rotation.
          Many cover crops have also demonstrated an ability to reduce the export of subsurface drainage water and dissolved nutrients
          such as nitrogen and phosphorous.
          In this module you can input your estimates of macronutrients saved (or not applied) and the value of those macronutrients.
          Alternatively, if you intend to apply additional nutrients with the integration of cover crops you can also provide those values.
        </p>
        <div className="mobile-table-div">
          <table className="mobile-table">
            <caption>
              <ClearInputs defaults={defaults} />
            </caption>
            <tbody>
              <tr>
                <td />
                <th>N</th>
                <th>
                  P
                  <sub>2</sub>
                  O
                  <sub>5</sub>
                </th>
                <th>
                  K
                  <sub>2</sub>
                  O
                </th>
              </tr>

              <tr>
                <td>Fertilizer value ($/pound of nutrient)</td>
                <td>
                  <Input id="$fertN" value={$fertN ?? dfertN} />
                </td>
                <td>
                  <Input id="$fertP" />
                </td>
                <td>
                  <Input id="$fertK" />
                </td>
              </tr>

              <tr>
                <td>Expected fertilizer credit from your cover crop species (pounds/acre).</td>
                <td>
                  <Input id="fertN" autoFocus={!mobile} />
                </td>
                <td>
                  <Input id="fertP" />
                </td>
                <td>
                  <Input id="fertK" />
                </td>
              </tr>

              <tr>
                <td>Will you add fertilizer specifically for cover crop production?</td>
                <td colSpan={3}>
                  <Input id="useFertilizer" options={['Yes', 'No']} type="radio" row />
                </td>
              </tr>

              {useFertilizer && (
                <>
                  <tr>
                    <td>Fertilizer added for cover crop production (pounds/acre)</td>
                    <td>
                      <Input id="fertNAdded" />
                    </td>
                    <td>
                      <Input id="fertPAdded" />
                    </td>
                    <td>
                      <Input id="fertKAdded" />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Cost of fertilizer application ($/acre)
                      {' '}
                      <Help>
                        <p>
                          If additional fertilizer requires an additional trip or trips through the field, enter your expected application cost.
                          If additional fertilizer will be added, even to a cover crop, with an activity that would be done
                          even if you did not plant a cover crop, enter a zero value.
                        </p>
                      </Help>
                    </td>
                    <td colSpan={3}>
                      <Input id="$fertApplication" value={$fertApplication ?? dFertApplication} />
                    </td>
                  </tr>
                </>
              )}

              <tr>
                <td>Value of fertilizer credit from cover crops ($/acre)</td>
                <td colSpan={3}>{dollars($fertCredit)}</td>
              </tr>
              <tr>
                <td>Total cost of fertilizer for cover crop production ($/acre)</td>
                <td colSpan={3}>{dollars($fertCost)}</td>
              </tr>
              <tr>
                <td>Net fertility impact of cover crops ($/acre)</td>
                <td colSpan={3}>{dollars(total)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </form>
      {dev && (
        <div className="test-buttons">
          <button type="button" onClick={exampleFertilityBenefit}>
            Test data: Benefit
          </button>
          <button type="button" onClick={exampleFertilityCost}>
            Test data: Cost
          </button>
        </div>
      )}
    </div>
  );
}; // Fertility

Fertility.menu = (
  <span>
    <u>F</u>
    ertility
  </span>
);

export default Fertility;
