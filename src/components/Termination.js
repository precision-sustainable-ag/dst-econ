import Activity from './Activity';
import Logic from './Logic';
import {useEffect} from 'react';
import {ClearInputs} from './ClearInputs';

import {useSelector, useDispatch} from 'react-redux';
import {get, set, test, getDefaults, db} from '../store/store';

const defaults = getDefaults('termination.q2|chemical.q3|chemical.implement|chemical.power|chemical.implementsCost|chemical.powerCost|chemical.Labor|chemical.Fuel|chemical.Depreciation|chemical.Interest|chemical.Repairs|chemical.Taxes|chemical.Insurance|chemical.Storage|roller.q3|roller.implement|roller.power|roller.implementsCost|roller.powerCost|roller.Labor|roller.Fuel|roller.Depreciation|roller.Interest|roller.Repairs|roller.Taxes|roller.Insurance|roller.Storage|tillage.q3|tillage.implement|tillage.power|tillage.implementsCost|tillage.powerCost|tillage.Labor|tillage.Fuel|tillage.Depreciation|tillage.Interest|tillage.Repairs|tillage.Taxes|tillage.Insurance|tillage.Storage|termination.method');

const Termination = () => {
  // console.log('Render: Termination');
  const Herbicide = () => (
    <>
      <tr><th colSpan="100">Product</th></tr>
      <Logic
        current={current}
        property="unitCost"
        q="Cost per unit of product"
        a={'dollar'}
        suffix={db.herbicides[state.product]?.['Unit (cost)']}
      />

      <Logic
        current={current}
        property="rate"
        q="Application rate"
        a={'number'}
        suffix={db.herbicides[state.product]?.['Unit (rate)']}
      />

      <Logic
        current={current}
        property="productCost"
        q="Product cost"
        a={state.productCost}
      />

      <tr><th colSpan="100">Chemical Spray Equipment</th></tr>
      <Logic
        current="chemical"
        property="implement"
        q="What chemical spray equipment will be used?"
        type="Chemical"
      />

      <Logic current="chemical" question="power" />

      <Logic current="chemical" question="Annual Use (acres on implement)" />
      <Logic current="chemical" question="Annual Use (hours on power)" />
      <Logic current="chemical" question="Acres/hour" />

      <Logic
        current="chemical"
        property="total"
        q="Chemical spray equipment cost ($/acre)"
        a={'dollar'}
      />
    </>
  ); // Herbicide

  const Roller = () => (
    <>
      <tr><th colSpan="100">Roller Equipment</th></tr>
      <Logic
        current="roller"
        property="implement"
        q="What roller equipment will be used?"
        type="Termination"
      />

      <Logic current="roller" question="power" />

      <Logic current="roller" question="Annual Use (acres on implement)" />
      <Logic current="roller" question="Annual Use (hours on power)" />
      <Logic current="roller" question="Acres/hour" />

      <Logic
        current="roller"
        property="total"
        q="Roller equipment cost ($/acre)"
        a={'dollar'}
      />
    </>
  ); // Roller

  const Tillage = () => (
    <>
      <tr><th colSpan="100">Tillage Equipment</th></tr>
      <Logic
        current="tillage"
        property="implement"
        q="What tillage equipment will be used?"
        type="Tillage"
      />

      <Logic current="tillage" question="power" />

      <Logic current="tillage" question="Annual Use (acres on implement)" />
      <Logic current="tillage" question="Annual Use (hours on power)" />
      <Logic current="tillage" question="Acres/hour" />

      <Logic
        current="tillage"
        property="total"
        q="Tillage equipment cost ($/acre)"
        a={'dollar'}
      />
    </>
  ); // Tillage

  const dispatch = useDispatch();
  const current = 'termination';

  const dev = useSelector(get.dev);

  useSelector(get.current);
  useSelector(get.shown[current]);
  const method = useSelector(get.termination.method);

  const state = useSelector(get[current]);

  useEffect(() => {
    dispatch(set.current(current));
  }, [dispatch, current]);

  return (
    <>
      <div className="Termination">
        <h1>Economic Decision Aid for Cover Crops: Termination</h1>
        <strong>Cover Crop Establishment</strong>
        <form>
          <table className={current + ' inputs'}>
            <thead>
              <tr>
                <th colSpan="2">
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
                a={['', 'Herbicide application', 'Roller', 'Roller with follow-up herbicide', 'Tillage']}
              />

              <Logic
                current={current}
                property="q2"
                q="Would you do this field activity if you did not have a cover crop?"
                a={['Yes', 'No']}
                shown={state.method}
              />

              {
                state.q2 === 'No' && (
                  <>
                    <Logic
                      current={current}
                      property="q3"
                      q="Who will do this activity?"
                      a={['Self', 'Custom Operator']}
                    />

                    <Logic
                      current={current}
                      property="customCost"
                      q="Custom operator cost ($/acre)"
                      a={'dollar'}
                      shown={state.q3 === 'Custom Operator'}
                    />

                    <Logic
                      current={current}
                      property="product"
                      q="Product"
                      a={['', ...Object.keys(db.herbicides).sort()]}
                      shown={state.method === 'Herbicide application'}
                    />

                    {/herbicide/i.test(method) && <Herbicide/>}
                    {/Roller/.test(method) && <Roller/>}
                    {/Tillage/.test(method) && <Tillage/>}
                  </>
                )
              }
            </tbody>
          </table>
        </form>
      </div>
      {
        dev && (
          <>
            <button
              onClick={() => {
                dispatch(set.termination.q2('Yes'));
                test('screen', 'Tillage');
                dispatch(set.screen('Termination'));

                dispatch(set.termination.q2('No'));
                dispatch(set.termination.q3('Self'));
                test('focus', 'termination.method');

                dispatch(set.termination.method('Herbicide application'));
                
                  dispatch(set.termination.product('2,4-D'));
                  test('termination.unitCost', 5);
                  test('termination.rate', 1);

                  dispatch(set.termination.product('atrazine'));
                  test('termination.unitCost', 4);
                  test('termination.rate', 2);

                  dispatch(set.termination.unitCost(333));

                  dispatch(set.termination.product('dicamba'));
                  test('termination.unitCost', 3);
                  test('termination.rate', 3);
                  test('termination.productCost', 9);

                  dispatch(set.chemical.implement('Boom Sprayer, Pull-Type; 90 Ft'));
                  test('chemical.power', '130 HP MFWD Tractor');
                  test('chemical.total', 6.62);

                  dispatch(set.chemical.implement('Boom Sprayer, Self-Propelled; 90 Ft'));
                  test('chemical.power', '130 Self Propelled');
                  test('chemical.total', 6.75);
              }}
            >
              Test Herbicide
            </button>

            <button
              onClick={() => {
                dispatch(set.termination.q2('Yes'));
                test('screen', 'Tillage');
                dispatch(set.screen('Termination'));

                dispatch(set.termination.q2('No'));
                dispatch(set.termination.q3('Self'));
                test('focus', 'termination.method');

                dispatch(set.termination.method('Roller'));
                
                test('chemical.total', 0);
                dispatch(set.roller.implement('Cover Crop Roller; 10.5 Ft'));

              }}
            >
              Test Roller
            </button>

            <button
              onClick={() => {
                dispatch(set.termination.q2('Yes'));
                test('screen', 'Tillage');
                dispatch(set.screen('Termination'));

                dispatch(set.termination.q2('No'));
                dispatch(set.termination.q3('Self'));
                test('focus', 'termination.method');

                dispatch(set.termination.method('Tillage'));
                
                test('chemical.total', 0);
                test('roller.total', 0);
                
                dispatch(set.tillage.implement('Chisel Plow; 23 Ft'));
                test('tillage.total', 16.41);
              }}
            >
              Test Tillage
            </button>

            <button
              onClick={() => {
                dispatch(set.termination.q2('Yes'));
                test('screen', 'Tillage');
                dispatch(set.screen('Termination'));

                dispatch(set.termination.q2('No'));
                dispatch(set.termination.q3('Self'));
                test('focus', 'termination.method');

                dispatch(set.termination.method('Roller with follow-up herbicide'));
                
                test('chemical.total', 0);
                test('roller.total', 0);
                test('tillage.total', 0);
                
                dispatch(set.chemical.implement('Boom Sprayer, Pull-Type; 90 Ft'));
                dispatch(set.roller.implement('Cover Crop Roller; 10.5 Ft'));
              }}
            >
              Test Roller with follow-up herbicide
            </button>
          </>
        )
      }

      {/herbicide/i.test(method) && <Activity type="chemical" />}
      {/roller/i.test(method)    && <Activity type="roller"   instructions={method !== 'Roller with follow-up herbicide'} />}
      {method === 'Tillage'      && <Activity type="tillage"  />}
    </>
  )
} // Termination

Termination.menu = <span><u>T</u>ermination</span>;

export default Termination;