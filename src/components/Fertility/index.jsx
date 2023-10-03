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
  'fertility.N',
  'fertility.P',
  'fertility.K',
  'fertility.$N',
  'fertility.$P',
  'fertility.$K',
  'fertility.useFertilizer',
  'fertility.NAdded',
  'fertility.PAdded',
  'fertility.KAdded',
  'fertility.$application',
  'fertility.$credit',
  'fertility.$cost',
  'fertility.total',
]);

const Fertility = () => {
  const useFertilizer = useSelector(get.fertility.useFertilizer) === 'Yes';
  const mobile = useSelector(get.mobile);
  const $N = useSelector(get.fertility.$N);
  const dfertN = db.rates.Nitrogen.value;
  const $cost = useSelector(get.fertility.$cost);
  const total = useSelector(get.fertility.total);
  const $application = useSelector(get.fertility.$application) || 0;
  const dFertApplication = 0; // db.costDefaults['Custom Fertilizer Appl'].cost;
  const $credit = useSelector(get.fertility.$credit);

  return (
    <div id="Fertility">
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
              <td style={{ background: '#dfd' }}>
                <Input id="fertility.$N" value={$N ?? dfertN} />
              </td>
              <td style={{ background: '#dfd' }}>
                <Input id="fertility.$P" />
              </td>
              <td style={{ background: '#dfd' }}>
                <Input id="fertility.$K" />
              </td>
            </tr>

            <tr>
              <td>Expected fertilizer credit from your cover crop species (pounds/acre).</td>
              <td>
                <Input id="fertility.N" autoFocus={!mobile} />
              </td>
              <td>
                <Input id="fertility.P" />
              </td>
              <td>
                <Input id="fertility.K" />
              </td>
            </tr>

            <tr>
              <td>Will you add fertilizer specifically for cover crop production?</td>
              <td colSpan={3}>
                <Input id="fertility.useFertilizer" options={['Yes', 'No']} type="radio" row />
              </td>
            </tr>

            {useFertilizer && (
              <>
                <tr>
                  <td>Fertilizer added for cover crop production (pounds/acre)</td>
                  <td>
                    <Input id="fertility.NAdded" />
                  </td>
                  <td>
                    <Input id="fertility.PAdded" />
                  </td>
                  <td>
                    <Input id="fertility.KAdded" />
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
                    <Input id="fertility.$application" value={$application ?? dFertApplication} />
                  </td>
                </tr>
              </>
            )}

            <tr style={{ background: 'lightyellow' }}>
              <td>Value of fertilizer credit from cover crops ($/acre)</td>
              <td colSpan={3}>{dollars($credit)}</td>
            </tr>
            <tr style={{ background: 'lightyellow' }}>
              <td>Total cost of fertilizer for cover crop production ($/acre)</td>
              <td colSpan={3}>{dollars($cost)}</td>
            </tr>
            <tr style={{ background: 'lightyellow' }}>
              <td>Net fertility impact of cover crops ($/acre)</td>
              <td colSpan={3}>{dollars(total)}</td>
            </tr>
          </tbody>
        </table>
      </div>
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
