import Activity from './Activity';
import Logic from './Logic';
import {useEffect} from 'react';

import {useSelector, useDispatch} from 'react-redux';
import {get, set, db, dollars, data, power, match, totalRelevantCost} from '../app/store';

const Termination = () => {
  const dispatch = useDispatch();
  const current  = 'termination';
  const state    = useSelector(get[current]);

  useEffect(() => {
    dispatch(set.current(current));
  });

  const total     = state.total;
  const estimated = current ? totalRelevantCost() : 0;

  const dbvalue = (table, key, parm) => {
    return db[table][key] ? db[table][key][parm] : '';
  } // dbvalue

  return (
    <div className="Termination">
      <h1>Economic Decision Aid for Cover Crops: Termination</h1>
      <strong>Cover Crop Establishment</strong>
      <table className={current}>
        <tbody>
          <tr>
            <th colSpan="2">Termination</th>
          </tr>

          <Logic
            id="q2"
            q="Would you do this field activity if you did not have a cover crop?"
            a={['Yes', 'No']}
            onInput={(e) => {
              if (e.target.value === 'Yes') {
                dispatch(set.screen('Tillage'));
              }
            }}
          />

          <Logic
            id="q3"
            q="Who will do this activity?"
            a={['Self', 'Custom Operator']}
            shown={match('q2', 'No', current)}
          />

          <Logic
            id="customCost"
            q="Custom operator cost ($/acre)"
            a={'dollar'}
            shown={match('q3', 'Custom Operator', current)}
          />

          <Logic
            id="method"
            q="Cover Crop termination method"
            a={['', 'Herbicide application', 'Roller', 'Roller with follow-up herbicide', 'Tillage']}
            shown={match('q2', 'No', current)}
          />

          <Logic
            id="product"
            q="Product"
            a={['', ...Object.keys(db.herbicides).sort()]}
            shown={match('method', 'Herbicide application', current)}
          />

          {
            (match('method', 'Herbicide application', current) || match('method', 'Roller with follow-up herbicide', current)) && (
              <>
                <Logic
                  id="unitCost"
                  q="Cost per unit of product"
                  a={'dollar'}
                  value={dbvalue('herbicides', state.product, 'Cost ($)')}
                  suffix={dbvalue('herbicides', state.product, 'Unit (cost)')}
                />
      
                <Logic
                  id="rate"
                  q="Application rate"
                  a={'number'}
                  value={dbvalue('herbicides', state.product, 'Rate')}
                  suffix={dbvalue('herbicides', state.product, 'Unit (rate)')}
                />
      
                <Logic
                  id="productCost"
                  q="Product cost"
                  a={state.productCost}
                />

                <Logic
                  id="chemical"
                  q="What chemical spray equipment will be used?"
                  a={['', ...Object.keys(db.implements).filter(key => db.implements[key].type === 'Chemical').sort()]}
                />
        
                <Logic
                  id="chemicalCost"
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
                  id="roller"
                  q="What roller equipment will be used?"
                  a={['', ...Object.keys(db.implements).filter(key => db.implements[key].type === 'Termination').sort()]}
                />

                <Logic
                  id="rollerCost"
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
                  id="q4"
                  q="What type of seedbed preparation will be done?"
                  a={['', ...Object.keys(db.implements).filter(key => db.implements[key].type === 'Tillage').sort()]}
                  onInput={() => {
                    dispatch(set[current]({key: 'power', value: data('default power unit')}));
                    dispatch(set[current]({key: 'total', value: totalRelevantCost()}));
                    dispatch(set[current]({key: 'edited', value: false}));
                  }}
                />

                <Logic
                  id="power"
                  q="What power will be used?"
                  a={['', ...Object.keys(db.power)]}
                  shown={state.q4}
                  onInput={() => {
                    dispatch(set[current]({key: 'total', value: totalRelevantCost()}));
                    dispatch(set[current]({key: 'edited', value: false}));
                  }}
                />

                <Logic
                  q="Annual Use (acres on implement)"
                  a={data('acres/year', 0)}
                  shown={state.q4}
                />

                <Logic
                  q="Annual Use (hours on power)"
                  a={power('expected use (hr/yr)')}
                  shown={state.q4}
                />

                <Logic
                  q="Acres/hour"
                  a={data('acres/hour', 1)}
                  shown={state.q4}
                />

                <Logic
                  id="total"
                  q={match('q3', 'Self', current) ? `Estimated relevant cost (${dollars(estimated)}/acre)` : `Estimated custom cost (${dollars(total)}/acre)`}
                  a={'dollar'}
                  onInput={(e) => {
                    dispatch(set[current]({key: 'edited', value: e.target.value > ''}));
                  }}
                />
              </>
            )
          }
        </tbody>
      </table>

      <Activity type="termination" ds="Chemical"/>
      <Activity type="termination" ds="q4"/>
      <Activity type="termination" ds="Product" />
    </div>
  )
} // Termination

export default Termination;