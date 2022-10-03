import Logic from './Logic';

import {useSelector, useDispatch} from 'react-redux';
import {get, set, test, getDefaults, dollars} from '../store/Store';
import {ClearInputs} from './ClearInputs';

const defaults = getDefaults('tillage1.q1|tillage1.q2|tillage1.q6|tillage1.q9|tillage1.implement|tillage1.estimated|tillage1.total|tillage2.q2|tillage2.estimated|tillage2.total|tillage3.q2|tillage3.estimated|tillage3.total|tillage2.implement|tillage3.implement');

const Tillage = () => {
  const dispatch  = useDispatch();
  const current = 'tillage1';
  const dev = useSelector(get.dev);

  const state = useSelector(get[current]);
  const tillage1 = useSelector(get.tillage1);
  const tillage3 = useSelector(get.tillage3);
  const tillageAll = useSelector(get.tillageAll);

  const Costs = ({current, q2, q3, q4, shown}) => {
    const state = useSelector(get[current]);
    const estimated = useSelector(get[current].estimated);

    return shown && (
      <>
        <Logic
          current={current}
          property="q2"
          q={q2}
          a={['Yes', 'No']}
          style={{borderTop: '2px solid #444'}}
        />

        <Logic
          current={current}
          property="implement"
          q={q3}
          type="Tillage"
          shown={state.q2 === 'Yes'}
        />

        <Logic current={current} question="power" />
        <Logic current={current} question="Annual Use (acres on implement)" />
        <Logic current={current} question="Annual Use (hours on power)" />
        <Logic current={current} question="Acres/hour" />

        {state.q2 === 'Yes' && (
          <Logic 
            current={current}
            question="Estimated"
            q={q4}
            total={Number.isFinite(state.total) ? state.total : estimated}
            estimated={estimated}
            shown={state.q2 === 'Yes'}
          />
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
              />

              <Costs 
                current="tillage1"
                q2="Do you typically conduct fall tillage on this field?"
                q3="How is fall tillage on this field typically done?"
                q4="Estimated cost of fall tillage"
                shown={state.q1 === 'No'}
              />

              <Logic
                current="tillage1"
                property="q5"
                q="Are you planning to forgo fall tillage on this field because of planting a cover crop?"
                a={['Yes', 'No']}
                shown={state.q2 === 'Yes'}
                style={{borderTop: '2px solid #444'}}
              />

              <Costs
                current="tillage2"
                q2="Will you be eliminating any other tillage than fall tillage, because of planting a cover crop?"
                q3="What other tillage activity will be eliminated because of planting a cover crop?"
                q4="Estimated cost of eliminated tillage activity"
                shown={state.q2 === 'Yes'}
              />

              <Costs
                current="tillage3"
                q2="Will you be adding any tillage activities because of planting a cover crop?"
                q3="What other tillage activity will be added because of planting a cover crop?"
                q4="Estimated cost of added tillage activity"
                shown={true}
              />

              <Logic
                current={current}
                q="Tillage cost reductions due to adopting cover crop"
                a={dollars(tillage1.costReductions)}
                shown={state.q2 === 'Yes'}
                style={{background: 'lightyellow', borderTop: '2px solid #444'}}
              />              

              <Logic
                current={current}
                q="Tillage cost increases due to adopting cover crop"
                a={dollars(tillage3.total)}
                shown={state.q2 === 'Yes'}
                style={{background: 'lightyellow'}}
              />              

              <Logic
                current={current}
                q="Net impact of adopting cover crop on tillage costs"
                a={dollars(tillageAll.total)}
                shown={state.q2 === 'Yes'}
                style={{background: 'lightyellow'}}
              />              
            </tbody>
          </table>
        </form>
      </div>
      {
        dev && (
          <>
            <button
              onClick={() => {
                dispatch(set.tillage1.q1('No'));
                dispatch(set.tillage1.q2('Yes'));
                dispatch(set.tillage1.implement('Chisel Plow; 23 Ft'));
                dispatch(set.tillage1.q5('Yes'));
                dispatch(set.tillage2.q2('No'));
                dispatch(set.tillage3.q2('Yes'));
                dispatch(set.tillage3.implement('Chisel Plow, Front Dsk; 16.3 Ft'));
              }}
            >
              Test data #1
            </button>
            <button
              onClick={() => {
                dispatch(set.tillage1.q1('No'));
                dispatch(set.tillage1.q2('No'));
                dispatch(set.tillage2.q2('No'));
                dispatch(set.tillage3.q2('No'));
              }}
            >
              Test data #2
            </button>
            <button
              onClick={() => {
                dispatch(set.tillage1.q1('No'));
                dispatch(set.tillage1.q2('Yes'));
                dispatch(set.tillage1.implement('Chisel Plow; 23 Ft'));
                dispatch(set.tillage1.q5('Yes'));
                dispatch(set.tillage2.q2('No'));
                dispatch(set.tillage3.q2('No'));
              }}
            >
              Test data #3
            </button>
            <button
              onClick={() => {
                dispatch(set.tillage1.q1('No'));
                dispatch(set.tillage1.q2('Yes'));
                dispatch(set.tillage1.implement('Chisel Plow; 23 Ft'));
                dispatch(set.tillage1.q5('Yes'));
                dispatch(set.tillage2.q2('Yes'));
                dispatch(set.tillage2.implement('Chisel Plow; 23 Ft'));
                dispatch(set.tillage3.q2('No'));
              }}
            >
              Test data #4
            </button>
            <button
              onClick={() => {
                dispatch(set.tillage1.q1('No'));
                dispatch(set.tillage1.q2('No'));
                dispatch(set.tillage2.q2('No'));
                dispatch(set.tillage3.q2('Yes'));
                dispatch(set.tillage3.implement('Chisel Plow; 23 Ft'));
              }}
            >
              Test data #5
            </button>
            <hr/>
          </>
        )
      }

    </>
  )
} // Tillage

Tillage.menu = <span>T<u>i</u>llage</span>;

export default Tillage;