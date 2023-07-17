import React from 'react';
import { useSelector } from 'react-redux';

import {
  dev,
  goto,
  get,
  getDefaults,
  dollars,
  clearInputs,
  exampleTillage1,
  exampleTillage2,
  exampleTillage3,
  exampleTillage4,
  exampleTillage5,
} from '../../store/Store';

import Logic from '../Logic';
import ClearInputs from '../ClearInputs';

const tillageDefaults = getDefaults(
  Object.keys(get.tillage).map((parm) => `tillage.${parm}`),
);
const fallDefaults = getDefaults(
  Object.keys(get.tillage.fall).map((parm) => `tillage.fall.${parm}`),
);
const eliminationDefaults = getDefaults(
  Object.keys(get.tillage.elimination).map((parm) => `tillage.elimination.${parm}`),
);
const otherDefaults = getDefaults(
  Object.keys(get.tillage.other).map((parm) => `tillage.other.${parm}`),
);

const defaults = {
  ...tillageDefaults,
  ...fallDefaults,
  ...eliminationDefaults,
  ...otherDefaults,
};

const Costs = ({
  current, q2, q3, q4, onChange,
}) => {
  const state = useSelector(goto(get, current));
  const estimated = { state };

  return (
    <>
      <Logic
        current={current}
        property="q2"
        q={q2}
        a={['Yes', 'No']}
        onChange={onChange}
      />

      {state.q2 === 'Yes' && (
        <>
          <Logic current={current} property="implement" q={q3} type="Tillage" />

          <Logic current={current} question="power" />
          <Logic current={current} question="Annual Use (acres on implement)" />
          <Logic current={current} question="Annual Use (hours on power)" />
          <Logic current={current} question="Acres/hour" />

          <Logic
            current={current}
            question="Estimated"
            q={q4}
            total={Number.isFinite(state.total) ? state.total : estimated}
            estimated={estimated}
          />
        </>
      )}
    </>
  );
}; // Costs

const Tillage = () => {
  const state = useSelector(get.tillage);
  const tillage = useSelector(get.tillage);

  return (
    <>
      <div className="Tillage">
        <h1>Tillage</h1>
        <p>
          As a reminder to the user, the
          {' '}
          <strong>Cover Crop Economic DST (Decision Support Tool)</strong>
          {' '}
          considers changes to your crop management system specific to the inclusion of cover crops into your rotation.
          Therefore, this module will consider any reduction or addition of tillage that may result from utilizing cover crops.
          For example, many growers have discovered that utilizing cover crops will reduce or eliminate the need for deep tillage in the fall.
          Other growers have switched from conventional tillage to no-till planting after making a switch to extensive use of cover crops.
        </p>

        {/* <p>
          Review the
          {' '}
          <NavLink className="link" to="/Resources">
            Resources page
          </NavLink>
          {' '}
          for additional information.
        </p> */}

        <form>
          <div className="mobile-table-div">
            <table className="tillage inputs mobile-table power">
              <tbody>
                <tr>
                  <th colSpan="3">
                    Tillage
                    <ClearInputs defaults={defaults} />
                  </th>
                </tr>

                <Logic
                  current="tillage"
                  property="q1"
                  q="Do you typically use no-till on this field?"
                  a={['Yes', 'No']}
                  onChange={() => clearInputs(fallDefaults)}
                />

                {state.q1 === 'No' && (
                  <>
                    <tr>
                      <th colSpan="3">Fall Tillage</th>
                    </tr>
                    <Costs
                      current="tillage.fall"
                      q2="Do you typically conduct fall tillage on this field?"
                      q3="How is fall tillage on this field typically done?"
                      q4="Estimated cost of fall tillage"
                      onChange={() => clearInputs(fallDefaults, 'tillage.fall.q2')}
                    />

                    {tillage.fall.q2 === 'Yes' && (
                      <>
                        <Logic
                          current="tillage"
                          property="q5"
                          q="Are you planning to forgo fall tillage on this field because of planting a cover crop?"
                          a={['Yes', 'No']}
                        />

                        <tr>
                          <th colSpan="3">Tillage Elimination</th>
                        </tr>
                        <Costs
                          current="tillage.elimination"
                          q2="Will you be eliminating any other tillage than fall tillage, because of planting a cover crop?"
                          q3="What other tillage activity will be eliminated because of planting a cover crop?"
                          q4="Estimated cost of eliminated tillage activity"
                          onChange={() => clearInputs(eliminationDefaults, 'tillage.elimination.q2')}
                        />
                      </>
                    )}
                  </>
                )}

                <tr>
                  <th colSpan="3">Other Tillage</th>
                </tr>
                <Costs
                  current="tillage.other"
                  q2="Will you be adding any tillage activities because of planting a cover crop?"
                  q3="What other tillage activity will be added because of planting a cover crop?"
                  q4="Estimated cost of added tillage activity"
                  onChange={() => clearInputs(otherDefaults, 'tillage.other.q2')}
                />

                <Logic
                  current="tillage"
                  q="Tillage cost reductions due to adopting cover crop"
                  a={dollars(tillage.costReductions)}
                  style={{ background: 'lightyellow' }}
                />

                <Logic
                  current="tillage"
                  q="Tillage cost increases due to adopting cover crop"
                  a={dollars(tillage.other.total)}
                  style={{ background: 'lightyellow' }}
                />

                <Logic
                  current="tillage"
                  q="Net impact of adopting cover crop on tillage costs"
                  a={dollars(tillage.total)}
                  style={{ background: 'lightyellow' }}
                />
              </tbody>
            </table>
          </div>
        </form>
      </div>
      {dev && (
        <div className="test-buttons">
          <button type="button" onClick={exampleTillage1}>
            Test 1
          </button>
          <button type="button" onClick={exampleTillage2}>
            Test 2
          </button>
          <button type="button" onClick={exampleTillage3}>
            Test 3
          </button>
          <button type="button" onClick={exampleTillage4}>
            Test 4
          </button>
          <button type="button" onClick={exampleTillage5}>
            Test 5
          </button>
          <hr />
        </div>
      )}
    </>
  );
}; // Tillage

Tillage.menu = (
  <span>
    T
    <u>i</u>
    llage
  </span>
);

export default Tillage;
