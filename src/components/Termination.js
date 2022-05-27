import Activity from './Activity';
import Logic from './Logic';
import {useEffect} from 'react';

import {useSelector, useDispatch} from 'react-redux';
import {get, set, db, dollars, data, match, totalRelevantCost} from '../store/store';

const Termination = () => {
  console.log('Render: Termination');
  const dispatch = useDispatch();
  const current = 'termination';
  useSelector(get.current);
  useSelector(get.shown[current]);  
  const state = useSelector(get[current]);

  useEffect(() => {
    dispatch(set.current(current));
  }, [dispatch, current]);

  const total     = state.total;
  const estimated = totalRelevantCost();

  const dbvalue = (table, key, parm) => {
    return db[table][key] ? db[table][key][parm] : '';
  } // dbvalue

  return (
    <>
      <div className="Termination">
        <h1>Economic Decision Aid for Cover Crops: Termination</h1>
        <strong>Cover Crop Establishment</strong>
        <form>
          <table className={current + ' inputs'}>
            <tbody>
              <tr>
                <th colSpan="2">Termination</th>
              </tr>

              <Logic
                property="q2"
                q="Would you do this field activity if you did not have a cover crop?"
                a={['Yes', 'No']}
                onChange={(value) => {
                  if (value === 'Yes') {
                    dispatch(set.screen('Tillage'));
                  }
                }}
              />

              <Logic
                property="q3"
                q="Who will do this activity?"
                a={['Self', 'Custom Operator']}
                shown={match('q2', 'No', current)}
                onChange={(value) => {  // TODO
                  if (value === 'Self') {
                    dispatch(set.focus('termination.method'));
                  } else {
                    dispatch(set.focus('termination.customCost'));
                  }
                }}
              />

              <Logic
                property="customCost"
                q="Custom operator cost ($/acre)"
                a={'dollar'}
                shown={match('q3', 'Custom Operator', current)}
              />

              <Logic
                property="method"
                q="Cover Crop termination method"
                a={['', 'Herbicide application', 'Roller', 'Roller with follow-up herbicide', 'Tillage']}
                shown={match('q2', 'No', current)}
              />

              <Logic
                property="product"
                q="Product"
                a={['', ...Object.keys(db.herbicides).sort()]}
                shown={match('method', 'Herbicide application', current)}
              />

              {
                (match('method', 'Herbicide application', current) || match('method', 'Roller with follow-up herbicide', current)) && (
                  <>
                    <Logic
                      property="unitCost"
                      q="Cost per unit of product"
                      a={'dollar'}
                      value={dbvalue('herbicides', state.product, 'Cost ($)')}
                      suffix={dbvalue('herbicides', state.product, 'Unit (cost)')}
                    />
          
                    <Logic
                      property="rate"
                      q="Application rate"
                      a={'number'}
                      value={dbvalue('herbicides', state.product, 'Rate')}
                      suffix={dbvalue('herbicides', state.product, 'Unit (rate)')}
                    />
          
                    <Logic
                      property="productCost"
                      q="Product cost"
                      a={state.productCost}
                    />

                    <Logic
                      property="chemical"
                      q="What chemical spray equipment will be used?"
                      a={['', ...Object.keys(db.implements).filter(key => db.implements[key].type === 'Chemical').sort()]}
                    />
            
                    <Logic
                      property="chemicalCost"
                      q="Chemical spray equipment cost ($/acre)"
                      a={'dollar'}
                    />
                  </>
                )
              }

              {
                (match('method', 'Roller', current) || match('method', 'Roller with follow-up herbicide', current)) && (
                  <>
                    <Logic
                      property="roller"
                      q="What roller equipment will be used?"
                      a={['', ...Object.keys(db.implements).filter(key => db.implements[key].type === 'Termination').sort()]}
                    />

                    <Logic
                      property="rollerCost"
                      q="Roller equipment cost ($/acre)"
                      a={'dollar'}
                    />
                  </>
                )
              }

              {
                match('method', 'Tillage', current) && (
                  <>
                    <Logic
                      property="q4"
                      q="What type of seedbed preparation will be done?"
                      a={['', ...Object.keys(db.implements).filter(key => db.implements[key].type === 'Tillage').sort()]}
                      onChange={() => {
                        dispatch(set[current].power(data('default power unit')));
                        dispatch(set[current].total(totalRelevantCost()));
                        dispatch(set[current].edited(false));
                      }}
                    />

                    <Logic question="power" />
                    <Logic question="Annual Use (acres on implement)" />
                    <Logic question="Annual Use (hours on power)" />
                    <Logic question="Acres/hour" />

                    <Logic
                      property="total"
                      q={match('q3', 'Self', current) ? `Estimated relevant cost (${dollars(estimated)}/acre)` : `Estimated custom cost (${dollars(total)}/acre)`}
                      a={'dollar'}
                      onChange={(value) => {
                        dispatch(set[current].edited(value > ''));
                      }}
                    />
                  </>
                )
              }
            </tbody>
          </table>
        </form>
      </div>
      <Activity type="termination" ds="Chemical"/>
      <Activity type="termination" ds="q4"/>
      <Activity type="termination" ds="Product" />
    </>
  )
} // Termination

export default Termination;