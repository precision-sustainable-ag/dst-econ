import {useSelector, useDispatch} from 'react-redux';

import {
  get,
  set,
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
import {ClearInputs} from '../ClearInputs';

const tillageDefaults     = getDefaults(Object.keys(get.tillage1).map(parm => 'tillage1.' + parm));
const fallDefaults        = getDefaults(Object.keys(get.tillageFall).map(parm => 'tillageFall.' + parm));
const eliminationDefaults = getDefaults(Object.keys(get.tillageElimination).map(parm => 'tillageElimination.' + parm));
const otherDefaults       = getDefaults(Object.keys(get.tillageOther).map(parm => 'tillageOther.' + parm));

const defaults = {...tillageDefaults, ...fallDefaults, ...eliminationDefaults, ...otherDefaults};

const Tillage = () => {
  const dispatch  = useDispatch();
  const current = 'tillage1';
  const dev = useSelector(get.dev);

  const state = useSelector(get[current]);
  const tillage1 = useSelector(get.tillage1);
  const tillageFall = useSelector(get.tillageFall);
  const tillageOther = useSelector(get.tillageOther);
  const tillageAll = useSelector(get.tillageAll);

  const Costs = ({current, q2, q3, q4, onChange}) => {
    const state = useSelector(get[current]);
    const estimated = useSelector(get[current].estimated);

    return (
      <>
        <Logic
          current={current}
          property="q2"
          q={q2}
          a={['Yes', 'No']}
          style={{borderTop: '2px solid #444'}}
          onChange={onChange}
        />

        {state.q2 === 'Yes' && (
          <>
            <Logic
              current={current}
              property="implement"
              q={q3}
              type="Tillage"
            />

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
  } // Costs

  return (
    <>
      <div className="Tillage">
        <h1>Tillage</h1>
        <p>
          As a reminder to the user, the <strong>Cover Crop Economic DST (Decision Support Tool)</strong> considers changes to your crop management system specific to the inclusion of cover crops into your rotation.
          Therefore, this module will consider any reduction or addition of tillage that may result from utilizing cover crops.
          For example, many growers have discovered that utilizing cover crops will reduce or eliminate the need for deep tillage in the fall.
          Other growers have switched from conventional tillage to no-til planting after making a switch to extensive use of cover crops.
          Review the <span className="link" onClick={() => dispatch(set.screen('Resources'))}>Resources page</span> for additional information.
        </p>

        <form>
          <table className={current + ' inputs'}>
            <tbody>
              <tr>
                <th colSpan="2">
                  Tillage
                  <ClearInputs defaults={defaults} />
                </th>
              </tr>
              
              <Logic
                current={current}
                property="q1"
                q="Do you typically use no-till on this field?"
                a={['Yes', 'No']}
                onChange={() => clearInputs(fallDefaults)}
              />

              {state.q1 === 'No' && (
                <>
                  <tr><th colSpan="2">Fall Tillage</th></tr>
                  <Costs
                    current="tillageFall"
                    q2="Do you typically conduct fall tillage on this field?"
                    q3="How is fall tillage on this field typically done?"
                    q4="Estimated cost of fall tillage"
                    onChange={() => clearInputs(fallDefaults, 'tillageFall.q2')}
                  />

                  {tillageFall.q2 === 'Yes' && (
                    <>
                      <Logic
                        current="tillage1"
                        property="q5"
                        q="Are you planning to forgo fall tillage on this field because of planting a cover crop?"
                        a={['Yes', 'No']}
                        style={{borderTop: '2px solid #444'}}
                      />

                      <tr><th colSpan="2">Tillage Elimination</th></tr>
                      <Costs
                        current="tillageElimination"
                        q2="Will you be eliminating any other tillage than fall tillage, because of planting a cover crop?"
                        q3="What other tillage activity will be eliminated because of planting a cover crop?"
                        q4="Estimated cost of eliminated tillage activity"
                        onChange={() => clearInputs(eliminationDefaults, 'tillageElimination.q2')}
                      />
                    </>
                  )}
                </>
              )}

              <tr><th colSpan="2">Other Tillage</th></tr>
              <Costs
                current="tillageOther"
                q2="Will you be adding any tillage activities because of planting a cover crop?"
                q3="What other tillage activity will be added because of planting a cover crop?"
                q4="Estimated cost of added tillage activity"
                onChange={() => clearInputs(otherDefaults, 'tillageOther.q2')}
              />

              <Logic
                current={current}
                q="Tillage cost reductions due to adopting cover crop"
                a={dollars(tillage1.costReductions)}
                style={{background: 'lightyellow', borderTop: '2px solid #444'}}
              />              

              <Logic
                current={current}
                q="Tillage cost increases due to adopting cover crop"
                a={dollars(tillageOther.total)}
                style={{background: 'lightyellow'}}
              />              

              <Logic
                current={current}
                q="Net impact of adopting cover crop on tillage costs"
                a={dollars(tillageAll.total)}
                style={{background: 'lightyellow'}}
              />
            </tbody>
          </table>
        </form>
      </div>
      {
        dev && (
          <>
            <button onClick={exampleTillage1}>Test 1</button>
            <button onClick={exampleTillage2}>Test 2</button>
            <button onClick={exampleTillage3}>Test 3</button>
            <button onClick={exampleTillage4}>Test 4</button>
            <button onClick={exampleTillage5}>Test 5</button>
            <hr />
          </>
        )
      }

    </>
  )
} // Tillage

Tillage.menu = <span>T<u>i</u>llage</span>;

export default Tillage;