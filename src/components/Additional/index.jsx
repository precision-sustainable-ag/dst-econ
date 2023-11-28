import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Input from '../../shared/Inputs';
import Help from '../../shared/Help';
import ClearInputs from '../ClearInputs';

import {
  dev, get, getDefaults, exampleAdditional,
} from '../../store/Store';
import './styles.scss';

const Considerations = () => {
  const context = useSelector(get.additional);
  const defaults = getDefaults(Object.keys(context).map((key) => `additional.${key}`));

  return (
    <div className="mobile-table-div">
      <div className="grid2">
        <header>
          Financial assistance or incentives
          <ClearInputs defaults={defaults} />
        </header>

        <div>
          If you rent this field and the landowner contributes to costs associated with planting cover crops,
          please enter the estimated cash contribution ($/acre).
        </div>
        <div>
          <Input id="additional.$landowner" />
        </div>

        <div style={{ borderTop: '2px solid black' }}>
          <p>
            Do you plan to participate in a state or federal program (e.g. USDA EQIP or USDA CSP)
            that provides financial assistance for using cover crops?
          </p>
          <p>
            If you click yes, an estimate of the NRCS EQIP state program (Practice 340) rate for your location and seeding mix
            is shown in the input box.
            You can change this financial assistance estimate to represent your specific opportunities.
            <Help>
              <p>
                The USDA NRCS provides financial assistance to some farms planting cover crops under Practice 340.
                The amount of financial assistance varies by state, cover crop practice and specific priorities.
              </p>
              <p>
                Priority programs include helping historically underserved audiences and water source protection.
                Financial assistance for planting multiple species is often greater than when planting a single species.
              </p>
              <p>
                The number of years that farms can receive cover crop financial assistance is usually limited.
              </p>
            </Help>
          </p>
        </div>
        <div style={{ borderTop: '2px solid black' }}>
          <Input id="additional.nrcs" options={['Yes', 'No']} type="radio" />
        </div>

        <div hidden={context.nrcs !== 'Yes'} style={{ borderBottom: '2px solid black' }}>
          Please enter the estimated cash contribution from the state or federal proagram ($/acre)
        </div>
        <div style={{ borderBottom: '2px solid black' }}>
          <Input id="additional.$costShare" />
        </div>

        <div>
          <p>
            If you anticipate participation in a voluntary carbon offset program that will
            provide a payment based on carbon reducing practices such as cover crops, please enter the estimated cash contribution ($/acre).
          </p>
        </div>
        <div>
          <Input id="additional.$carbonOffset" />
        </div>

        <div>
          <p>
            If you participate in a cover crop insurance premium discount program, enter the discount here.
            <Help>
              <p>
                Growers may be eligible for discounts on their crop insurance premiums by planting cover crops.
              </p>
              <p>
                For example, the State of Iowa has offered a $5 per acre crop insurance discount program administered
                by the Iowa Department of Agriculture and Land Stewardship and the USDA Risk Management Agency (RMA) when growers
                planted a fall seeded cover crop.
                Similar programs have been available in Illinois.
                Note that some insurance policies may be excluded (e.g. Whole-Farm Revenue Protection or written agreements).
              </p>
            </Help>
          </p>
        </div>
        <div>
          <Input id="additional.$insuranceDiscount" />
        </div>
      </div>
    </div>
  );
}; // Considerations

const Additional = () => (
  <div id="Additional">
    <h1>Additional Considerations</h1>
    <p>
      This portion of the
      {' '}
      <strong>Cover Crop Economic DST (Decision Support Tool)</strong>
      {' '}
      will address additional considerations that may impact the profitability of using cover crops in your operation.
      Please respond to questions for each of the sections below.
    </p>

    <h4>Cost-Share or Other Financial Incentives</h4>
    <p>
      As you consider the financial impacts of using cover crops in your operation,
      there are a number of programs that may provide cost share or financial support for your farm.
      Types of support could include cost-sharing of seed expense from landowners (if you cash rent),
      state program such as Soil &amp; Water Conservation Programs,
      federal programs such as EQIP (Environmental Quality Incentives Program)
      or CSP (Conservation Stewardship Program),
      or payments from companies aggregated voluntary carbon offsets.
      If you are not familiar with these types of programs, please refer to the
      {' '}
      <NavLink className="link" to="/Resources">
        Resources page
      </NavLink>
      .
      You will find a number of resources links to explore potential programs for your operation.
    </p>

    <Considerations />

    {dev && (
      <div className="test-buttons">
        <button
          type="button"
          onClick={exampleAdditional}
        >
          Test data
        </button>
      </div>
    )}

  </div>
); // Additional

Additional.menu = (
  <span>
    <u>A</u>
    dditional Considerations
  </span>
);

export default Additional;
