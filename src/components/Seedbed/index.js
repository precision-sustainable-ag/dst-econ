import React from 'react';
import { useSelector } from 'react-redux';

import {
  get, getDefaults, exampleSeedbed, clearInputs,
} from '../../store/Store';
import Logic from '../Logic';
import ClearInputs from '../ClearInputs';

const defaults = getDefaults(Object.keys(get.seedbed).map((parm) => `seedbed.${parm}`));

const Seedbed = () => {
  // console.log('Render: Seedbed');
  const dev = useSelector(get.dev);
  const estimated = useSelector(get.seedbed.estimated);

  const state = useSelector(get.seedbed);

  return (
    <>
      <h1>Seedbed Preparation</h1>
      <div id="About">
        <p>
          In order to accurately evaluate the economic impact of implementing cover crops into
          your rotation, we only want to consider management decisions directly associated with
          the use of cover crops. In this module we will consider only activities that are
          incurred because a cover crop is planted. For example, if you would normally conduct
          tillage (e.g. vertical tillage pass on corn stalks) after harvest this would not be
          considered an additional cost associated with cover crops. Ensure your inputs are
          only those specific to seedbed preparation for cover crops. For example, if you will
          no longer conduct fall tillage (e.g. inline or deep ripping) due to planting cover
          crops you will account for these changes in the Tillage Module.
        </p>

        <p>
          Also, the costs associated with machinery are dependent upon the annual hours of use.
          In this module you can accept the default value (for hours of annual use) or
          customize with the estimated hours associated with your operation. This will more
          accurately represent costs in your operation.
        </p>
      </div>
      <hr />

      <strong>Cover Crop Establishment</strong>
      <form>
        <div className="mobile-table-div">
          <table className="seedbed inputs mobile-table">
            <tbody>
              <tr>
                <th colSpan="2">
                  Seedbed preparation
                  <ClearInputs defaults={defaults} />
                </th>
              </tr>

              <Logic
                current="seedbed"
                property="q1"
                q="Will you do a field activity to prepare for cover crop planting,
                which would not normally be done on this field without cover crops?"
                a={['Yes', 'No']}
                onChange={() => clearInputs(defaults, 'seedbed.q1')}
              />

              {state.q1 === 'Yes' && (
                <>
                  <Logic
                    current="seedbed"
                    property="implement"
                    q="How will seedbed preparation be done?"
                    type="Tillage"
                  />

                  <Logic current="seedbed" question="power" />
                  <Logic current="seedbed" question="Annual Use (acres on implement)" />
                  <Logic current="seedbed" question="Annual Use (hours on power)" />
                  <Logic current="seedbed" question="Acres/hour" />
                  <Logic
                    current="seedbed"
                    question="Estimated"
                    total={Number.isFinite(state.total) ? state.total : estimated}
                    estimated={estimated}
                  />
                </>
              )}
            </tbody>
          </table>
        </div>
      </form>
      {dev && (
        <div className="test-buttons">
          <button type="button" onClick={exampleSeedbed}>
            Test data
          </button>
        </div>
      )}
    </>
  );
}; // Seedbed

Seedbed.menu = (
  <span>
    <u>S</u>
    eedbed Preparation
  </span>
);

export default Seedbed;
