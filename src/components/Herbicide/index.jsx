import React from 'react';
import { useSelector } from 'react-redux';
import Logic from '../Logic';
import ClearInputs from '../ClearInputs';
import Input from '../../shared/Inputs';

import {
  dev, get, getDefaults, clearInputs, exampleHerbicides,
} from '../../store/Store';

const herbicideDefaults = getDefaults(
  Object.keys(get.herbicide).map((parm) => `herbicide.${parm}`),
);
const fallDefaults = getDefaults(
  Object.keys(get.herbicide.fall).map((parm) => `herbicide.fall.${parm}`),
);
const additionalDefaults = getDefaults(
  Object.keys(get.herbicide.additional).map((parm) => `herbicide.additional.${parm}`),
);
const reducedDefaults = getDefaults(
  Object.keys(get.herbicide.reduced).map((parm) => `herbicide.reduced.${parm}`),
);

const defaults = {
  ...herbicideDefaults,
  ...fallDefaults,
  ...additionalDefaults,
  ...reducedDefaults,
};

const Herbicide = () => {
  const state = useSelector(get.herbicide);

  return (
    <div className="Herbicide">
      <h1>Herbicide</h1>
      <p>
        This module will address reductions or additional herbicide costs associated with integrating cover crops into your rotation.
        As a reminder, the
        {' '}
        <strong>Cover Crop Economic DST (Decision Support Tool)</strong>
        {' '}
        considers changes to your crop management system specific to the inclusion of cover crops.
        Therefore, this module only considers changes to your herbicide program specific to post emerge or fall herbicide applications.
        For example, some users have found the allelopathic effects of using cereal rye have enabled them
        to reduce the amount of herbicide used in their spray program.
        Some growers that have historically used multiple post emerge spray applications have found
        they can eliminate a herbicide pass when using cover crops.
        {/*
          You can also read case studies linked to the right to gain more insight of how cover crops have changed management practices for growers.
        */}
      </p>

      <div className="mobile-table-div">
        <table className="herbicide inputs mobile-table power">
          <tbody>
            <tr>
              <th colSpan="3">
                Post-emerge Herbicides
                <ClearInputs defaults={defaults} />
              </th>
            </tr>
            <Logic
              current="herbicide"
              property="q1"
              q="Will you modify your post emerge spray program when using cover crops (either the herbicides used or the number of applications)?"
              a={['Yes', 'No']}
            />

            {state.q1 === 'Yes' && (
              <>
                <tr>
                  <th colSpan="100">Additional Post-emerge Herbicides</th>
                </tr>
                <Logic
                  current="herbicide"
                  property="q2"
                  q="Do you plan on adding additional herbicides or making additional spray applications when adding cover crops to your rotation?"
                  a={['Yes', 'No']}
                />

                {state.q2 === 'Yes' && (
                <>
                  <tr>
                    <th colSpan="100">
                      What is the estimated cost of the additional herbicide?
                    </th>
                  </tr>

                  <tr>
                    <td>Product</td>
                    <td><Input id="herbicide.additional.product" /></td>
                  </tr>

                  <tr>
                    <td>Product cost</td>
                    <td><Input id="herbicide.additional.cost" type="dollar" /></td>
                  </tr>

                  {/* // Version 2:
                  <Logic
                    current="herbicide.additional"
                    property="product"
                    q="Product"
                    a={[...Object.keys(db.herbicides).sort(), 'Other']}
                  />

                  {additionalProduct === 'Other' && (
                    <tr>
                      <td>Product Name</td>
                      <td>
                        <input
                          type="text"
                          style={{
                            height: '38px',
                            width: '100%',
                            borderColor: '#BBBBBB',
                            borderRadius: '5px',
                            outline: 'none',
                            borderWidth: '1px',
                            fontSize: '1rem',
                            padding: '7.5px 4px 7.5px 6px',
                          }}
                          onChange={(e) => {
                            dispatch(set.herbicide.additional.product(e.target.value));
                          }}
                        />
                      </td>
                    </tr>
                  )}

                <Logic
                  current="herbicide.additional"
                  property="unitCost"
                  q={`Cost per ${db.herbicides[additionalProduct]?.['Unit (cost)']} of product`}
                  a="dollar"
                />

                <Logic
                  current="herbicide.additional"
                  property="rate"
                  q="Application rate"
                  a="number"
                  suffix={db.herbicides[additionalProduct]?.['Unit (rate)']}
                />

                <Logic
                  current="herbicide.additional"
                  property="cost"
                  q="Product cost"
                  a={additionalCost}
                /> */}

                  <Logic
                    current="herbicide.additional"
                    property="implement"
                    q="What method will be used for the additional post emerge application?"
                    type="Chemical"
                    custom={[
                      'No additional application activity',
                    ]}
                  />

                  <Logic current="herbicide.additional" question="power" />

                  <Logic
                    current="herbicide.additional"
                    question="Annual Use (acres on implement)"
                  />
                  <Logic
                    current="herbicide.additional"
                    question="Annual Use (hours on power)"
                  />
                  <Logic current="herbicide.additional" question="Acres/hour" />

                  <Logic
                    current="herbicide.additional"
                    question="Estimated"
                    q="Chemical spray equipment cost ($/acre)"
                    a="dollar"
                  />
                </>
                )}

                <>
                  <tr>
                    <th colSpan="100">Reduced Post-emerge Herbicides</th>
                  </tr>
                  <Logic
                    current="herbicide"
                    property="q5"
                    q="Do you plan on reducing the amount of herbicides used
                      or eliminating a post-emerge spray application with the use of cover crops?"
                    a={['Yes', 'No']}
                    onChange={() => clearInputs(reducedDefaults)}
                  />
                </>

                {state.q5 === 'Yes' && (
                <>
                  <tr>
                    <th colSpan="100">
                      What is the estimated savings from reduced herbicides (cost per
                      acre)?
                    </th>
                  </tr>

                  <tr>
                    <td>Product</td>
                    <td><Input id="herbicide.reduced.product" /></td>
                  </tr>

                  <tr>
                    <td>Product cost</td>
                    <td><Input id="herbicide.reduced.cost" type="dollar" /></td>
                  </tr>

                  <Logic
                    current="herbicide.reduced"
                    property="implement"
                    q="What post emerge application activity is eliminated?"
                    type="Chemical"
                    custom={[
                      'No reduced application activity',
                    ]}
                  />

                  <Logic current="herbicide.reduced" question="power" />

                  <Logic
                    current="herbicide.reduced"
                    question="Annual Use (acres on implement)"
                  />
                  <Logic
                    current="herbicide.reduced"
                    question="Annual Use (hours on power)"
                  />
                  <Logic current="herbicide.reduced" question="Acres/hour" />

                  <Logic
                    current="herbicide.reduced"
                    question="Estimated"
                    q="Chemical spray equipment cost ($/acre)"
                    a="dollar"
                  />
                </>
                )}
              </>
            )}

            {state.q5 && (
              <>
                <tr>
                  <th colSpan="100">Fall Herbicides</th>
                </tr>
                <Logic
                  current="herbicide"
                  property="q8"
                  q="Historically, have you implemented a fall herbicide program on this field?"
                  a={['Yes', 'No']}
                  onChange={() => clearInputs(fallDefaults)}
                />

                {state.q8 === 'Yes' && (
                <>
                  <Logic
                    current="herbicide.fall"
                    property="savings"
                    q="Implementing cover crops will allow you to forgo a fall herbicide application.
                      What is the estimated reduction (savings) of herbicide cost on a per acre basis?"
                    a="dollar"
                  />

                  <Logic
                    current="herbicide.fall"
                    property="implement"
                    q="How would you have conducted your fall herbicide program?"
                    type="Chemical"
                  />

                  <Logic current="herbicide.fall" question="power" />

                  <Logic
                    current="herbicide.fall"
                    question="Annual Use (acres on implement)"
                  />
                  <Logic current="herbicide.fall" question="Annual Use (hours on power)" />
                  <Logic current="herbicide.fall" question="Acres/hour" />

                  <Logic
                    current="herbicide.fall"
                    question="Estimated"
                    q="Chemical spray equipment cost ($/acre)"
                    a="dollar"
                  />
                </>
                )}
              </>
            )}

          </tbody>
        </table>
      </div>

      {dev && (
        <div className="test-buttons">
          <button type="button" onClick={exampleHerbicides}>
            Test data
          </button>
        </div>
      )}
    </div>
  );
}; // Herbicide

Herbicide.menu = (
  <span>
    He
    <u>r</u>
    bicide
  </span>
);

export default Herbicide;
