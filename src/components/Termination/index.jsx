import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  dev,
  get,
  getDefaults,
  db,
  clearInputs,
  dollars,
  exampleTermination1,
  exampleTermination2,
  exampleTermination3,
  exampleTermination4,
  exampleTermination5,
} from '../../store/Store';

import Logic from '../Logic';
import ClearInputs from '../ClearInputs';
import Input from '../../shared/Inputs';

const defaults = getDefaults([
  'termination.additionalHerbicides',
  'termination.additionalPrices',
  'termination.additionalRates',
  'termination.reducedHerbicides',
  'termination.reducedPrices',
  'termination.reducedRates',
  'termination.q2',
  'termination.q3',
  'termination.chemical.implement',
  'termination.chemical.power',
  'termination.chemical.implementsCost',
  'termination.chemical.powerCost',
  'termination.chemical.Labor',
  'termination.chemical.Fuel',
  'termination.chemical.Depreciation',
  'termination.chemical.Interest',
  'termination.chemical.Repairs',
  'termination.chemical.Taxes',
  'termination.chemical.Insurance',
  'termination.chemical.Storage',
  'termination.roller.implement',
  'termination.roller.power',
  'termination.roller.implementsCost',
  'termination.roller.powerCost',
  'termination.roller.Labor',
  'termination.roller.Fuel',
  'termination.roller.Depreciation',
  'termination.roller.Interest',
  'termination.roller.Repairs',
  'termination.roller.Taxes',
  'termination.roller.Insurance',
  'termination.roller.Storage',
  'termination.tillage.implement',
  'termination.tillage.power',
  'termination.tillage.implementsCost',
  'termination.tillage.powerCost',
  'termination.tillage.Labor',
  'termination.tillage.Fuel',
  'termination.tillage.Depreciation',
  'termination.tillage.Interest',
  'termination.tillage.Repairs',
  'termination.tillage.Taxes',
  'termination.tillage.Insurance',
  'termination.tillage.Storage',
  'termination.method',
  'termination.customCost',
  'termination.product',
]);

const HerbicidesRow = ({ n, prop }) => {
  const additional = useSelector(get.termination.additionalHerbicides);
  const reduced = useSelector(get.termination.reducedHerbicides);
  const used = [...additional, ...reduced];
  return (
    <tr>
      <td>
        <Input
          id={`termination.${prop}Herbicides`}
          index={n}
          options={Object.keys(db.herbicides)
            .filter((s) => !used.includes(s))
            .sort()}
        />
      </td>
      <td>
        <Input type="number" id={`termination.${prop}Rates`} index={n} />
      </td>
      <td>
        <Input type="dollar" id={`termination.${prop}Prices`} index={n} />
      </td>
    </tr>
  );
}; // HerbicidesRow

const OtherHerbicides = ({ state, prop, description }) => (
  <table style={{ width: '100%' }}>
    <caption>{description}</caption>
    <thead>
      <tr>
        <th>Herbicide</th>
        <th>Rate (lb/acre)</th>
        <th>Price ($/acre)</th>
      </tr>
    </thead>
    <tbody>
      {state[`${prop}Herbicides`].map(
        (s, n) => s && <HerbicidesRow key={n} n={n} prop={prop} />,
      )}
      <HerbicidesRow
        key={state[`${prop}Herbicides`].length}
        n={state[`${prop}Herbicides`].length}
        prop={prop}
      />
    </tbody>
    <tfoot>
      <tr>
        <td colSpan="3" style={{ textAlign: 'right', background: 'yellow' }}>
          Total
          {' '}
          {prop === 'additional' ? 'Costs' : 'Benefits'}
          :
          {' '}
          {dollars(state[`${prop}Total`])}
        </td>
      </tr>
    </tfoot>
  </table>
); // OtherHerbicides

const Herbicide = () => (
  <>
    <tr>
      <th colSpan="100">Herbicide</th>
    </tr>
    <tr>
      <td>Product</td>
      <td><Input id="termination.product" /></td>
    </tr>

    <tr>
      <td>Product cost ($/acre)</td>
      <td><Input id="termination.productCost" type="dollar" /></td>
    </tr>

    {/*  // Version 2:
        <Logic
          current="termination"
          property="product"
          q="Product"
          a={['', ...Object.keys(db.herbicides).sort()]}
        />

        <Logic
          current="termination"
          property="unitCost"
          q={`Cost per ${db.herbicides[state.product]?.['Unit (cost)']} of product`}
          a="dollar"
        />

        <Logic
          current="termination"
          property="rate"
          q="Application rate"
          a="number"
          suffix={db.herbicides[state.product]?.['Unit (rate)']}
        />

        <Logic
          current="termination"
          property="productCost"
          q="Product cost"
          a={state.productCost}
        />
      */}

    <tr>
      <th colSpan="100">Chemical Spray Equipment</th>
    </tr>
    <Logic
      current="termination.chemical"
      property="implement"
      q="How will this herbicide application be done?"
      type="Chemical"
    />

    <Logic current="termination.chemical" question="power" />

    <Logic current="termination.chemical" question="Annual Use (acres on implement)" />
    <Logic current="termination.chemical" question="Annual Use (hours on power)" />
    <Logic current="termination.chemical" question="Acres/hour" />

    <Logic
      current="termination.chemical"
      question="Estimated"
      q="Chemical spray equipment cost ($/acre)"
      a="dollar"
    />
  </>
); // Herbicide

const Roller = () => (
  <>
    <tr>
      <th colSpan="100">Roller Equipment</th>
    </tr>
    <Logic
      current="termination.roller"
      property="implement"
      q="How will this roller termination be done?"
      type="Termination"
    />

    <Logic current="termination.roller" question="power" />

    <Logic current="termination.roller" question="Annual Use (acres on implement)" />
    <Logic current="termination.roller" question="Annual Use (hours on power)" />
    <Logic current="termination.roller" question="Acres/hour" />

    <Logic
      current="termination.roller"
      question="Estimated"
      q="Roller equipment cost ($/acre)"
      a="dollar"
    />
  </>
); // Roller

const Tillage = () => (
  <>
    <tr>
      <th colSpan="100">Tillage Equipment</th>
    </tr>
    <Logic
      current="tillage"
      property="implement"
      q="How will this tillage be done?"
      type="Tillage"
    />

    <Logic current="tillage" question="power" />

    <Logic current="tillage" question="Annual Use (acres on implement)" />
    <Logic current="tillage" question="Annual Use (hours on power)" />
    <Logic current="tillage" question="Acres/hour" />

    <Logic
      current="tillage"
      question="Estimated"
      q="Tillage equipment cost ($/acre)"
      a="dollar"
    />
  </>
); // Tillage

const Termination = () => {
  const current = 'termination';
  const method = useSelector(get.termination.method);
  const state = useSelector(get[current]);
  const navigate = useNavigate();

  return (
    <>
      <div className="Termination">
        <h1>Termination</h1>
        <p>
          In order to accurately evaluate the economic impact of implementing cover crops into your rotation,
          we only want to consider management decisions directly associated with the use of cover crops.
          In this module we will consider any activity associated with termination of the cover crop,
          but only activities that are incurred specific to the cover crop.
          For example, if you plan to use tillage to terminate the cover crop but would normally conduct the same tillage pass
          if no cover crop had been planted then the costs associated with tillage will not be considered in this evaluation.
          This module has four methods of termination; herbicide, tillage, using a crop roller, and using a crop roller combined with herbicide.
        </p>
        <p>
          Also, the costs associated with machinery are dependent upon the annual hours of use.
          In this module you can accept the default value (for hours of annual use)
          or customize with the estimated hours associated with your operation.
          This will more accurately represent costs in your operation.
        </p>
        <form>
          <div className="mobile-table-div">
            <table className={`${current} inputs mobile-table power`}>
              <thead>
                <tr>
                  <th colSpan="3">
                    Termination
                    <ClearInputs defaults={defaults} />
                  </th>
                </tr>
              </thead>
              <tbody>
                <Logic
                  current={current}
                  property="method"
                  q="Cover Crop termination method"
                  a={[
                    '',
                    'Herbicide application',
                    'Roller',
                    'Roller with follow-up herbicide',
                    'Tillage',
                  ]}
                  onChange={() => {
                    clearInputs(defaults, ['termination.method']);
                  }}
                />

                {state.method && !/Roller/.test(state.method) && (
                  <Logic
                    current={current}
                    property="q2"
                    q="Would you do this field activity if you did not have a cover crop?"
                    a={['Yes', 'No']}
                    onChange={(_, value) => {
                      // clearInputs(defaults, ['termination.method', 'termination.q2']);
                      if (value === 'Yes' && state.method !== 'Herbicide application') {
                        navigate('/Tillage');
                      }
                    }}
                  />
                )}

                {state.method === 'Herbicide application' && state.q2 === 'Yes' && (
                  <Logic
                    current={current}
                    intro="
                    Even if you would normally spray a burn-down application, you may elect to add/remove an herbicide or change the rate applied.
                    For example, if clover is part of your cover crop mix you may wish to include 2, 4-D to help sure adequate termination.
                    Alternatively, some growers have found that use of cover crops (e.g. cereal rye which has an allelopathic effect)
                    allows them to reduce herbicides used in their tank mix.
                  "
                    property="q3"
                    q="Will you change the herbicides use in your tank mix?"
                    a={['Yes', 'No']}
                    onChange={(_, value) => {
                      // clearInputs(defaults);
                      if (value === 'No') {
                        navigate('/Tillage');
                      }
                    }}
                  />
                )}

                {state.q3 === 'Yes' && (
                  <tr>
                    <td colSpan="3">
                      <OtherHerbicides
                        state={state}
                        description="Additional Herbicides"
                        prop="additional"
                      />
                      <OtherHerbicides
                        state={state}
                        description="Reduced Herbicides"
                        prop="reduced"
                      />
                    </td>
                  </tr>
                )}

                {/Roller/.test(method) && <Roller />}

                {(state.q2 === 'No' || /Roller/.test(method)) && (
                  <>
                    {/herbicide/i.test(method) && <Herbicide />}
                    {/Tillage/.test(method) && <Tillage />}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </form>
      </div>
      {dev && (
        <div className="test-buttons">
          <button type="button" onClick={exampleTermination1}>
            Test Herbicide 1
          </button>
          <button type="button" onClick={exampleTermination2}>
            Test Herbicide 2
          </button>
          <button type="button" onClick={exampleTermination3}>
            Test Roller
          </button>
          <button type="button" onClick={exampleTermination4}>
            Test Tillage
          </button>
          <button type="button" onClick={exampleTermination5}>
            Test Roller with follow-up herbicide
          </button>
        </div>
      )}
    </>
  );
}; // Termination

Termination.menu = (
  <span>
    <u>T</u>
    ermination
  </span>
);

export default Termination;
