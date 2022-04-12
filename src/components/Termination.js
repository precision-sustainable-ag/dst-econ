import Activity from './Activity';
import {Navigation} from './Navigation';
import Logic from './Logic';
import {Context} from './Store';
import {useContext} from 'react';

const dollars = (n) => isFinite(n) ? '$' + (+n).toFixed(2) : '';

const Termination = ({db, parms, props, set}) => {
  const {state, change, match} = useContext(Context);

  const dbvalue = (table, key, parm) => {
    return db[table][key] ? db[table][key][parm] : '';
  } // dbvalue
  
  console.log(Object.keys(Context));
  console.log(JSON.stringify(state));
  console.log(JSON.stringify(change));

  return (
    <div className="Termination">
      <h1>Economic Decision Aid for Cover Crops: Termination</h1>
      <strong>Cover Crop Establishment</strong>
      <table className="termination">
        <tbody>
          <tr>
            <th colSpan="2">Termination</th>
          </tr>

          <Logic
            id="termination2"
            q="Would you do this field activity if you did not have a cover crop?"
            zinitial="z"
            initial="No"
            a={['Yes', 'No']}
            onInput={(e) => {
              if (e.target.value === 'Yes') {
                set.screen('Tillage');
                set.previousScreen('Tillage');
              }
            }}
          />

          <Logic
            id="termination3"
            q="Who will do this activity?"
            zinitial="z"
            initial="Self"
            a={['Self', 'Custom Operator']}
            cond={match('termination2', 'No')}
          />

          <Logic
            id="terminationCustomCost"
            q="Custom operator cost ($/acre)"
            a={'dollar'}
            cond={match('termination3', 'Custom Operator')}
          />

          <Logic
            id="terminationMethod"
            q="Cover Crop termination method"
            a={['', 'Herbicide application', 'Roller', 'Roller with follow-up herbicide', 'Tillage']}
            initial="Herbicide application"
            cond={match('termination2', 'No')}
          />

          <Logic
            id="terminationProduct"
            q="Product"
            a={['', ...Object.keys(db.herbicides).sort()]}
            initial="atrazine"
            cond={match('terminationMethod', 'Herbicide application')}
          />

          {
            (match('terminationMethod', 'Herbicide application') || match('terminationMethod', 'Roller with follow-up herbicide')) && (
              <>
                <Logic
                  id="terminationUnitCost"
                  q="Cost per unit of product"
                  a={'dollar'}
                  value={dbvalue('herbicides', state.terminationProduct, 'Cost ($)')}
                  suffix={dbvalue('herbicides', state.terminationProduct, 'Unit (cost)')}
                />
      
                <Logic
                  id="terminationRate"
                  q="Application rate"
                  a={'number'}
                  value={dbvalue('herbicides', state.terminationProduct, 'Rate')}
                  suffix={dbvalue('herbicides', state.terminationProduct, 'Unit (rate)')}
                />
      
                <Logic
                  id="terminationProductCost"
                  q="Product cost"
                  a={state.terminationProductCost}
                />

                <Logic
                  id="terminationChemical"
                  q="What chemical spray equipment will be used?"
                  a={['', ...Object.keys(db.implements).filter(key => db.implements[key].type === 'Chemical').sort()]}
                />
        
                <Logic
                  id="terminationChemicalCost"
                  q="Chemical spray equipment cost ($/acre)"
                  a={'dollar'}
                />
              </>
            )
          }

          {
            (match('terminationMethod', 'Roller') || match('terminationMethod', 'Roller with follow-up herbicide')) && (
              <>
                <Logic
                  id="terminationRoller"
                  q="What roller equipment will be used?"
                  a={['', ...Object.keys(db.implements).filter(key => db.implements[key].type === 'Termination').sort()]}
                />

                <Logic
                  id="terminationRollerCost"
                  q="Roller equipment cost ($/acre)"
                  a={'dollar'}
                />
              </>
            )
          }

          {
            match('terminationMethod', 'Tillage') && (
              <>
                <Logic
                  id="terminationTillage4"
                  q="What type of seedbed preparation will be done?"
                  a={['', ...Object.keys(db.implements).filter(key => db.implements[key].type === 'Tillage').sort()]}
                />

                <Logic
                  id="terminationTillagePower"
                  q="What power will be used?"
                  a={['', ...Object.keys(db.power)]}
                  cond={state.terminationTillage4}
                />

                <Logic
                  id="terminationTillageAnnualUseAcres"
                  q="Annual Use (acres on implement)"
                  a={state.seedbedAnnualUseAcres.toString()}
                  cond={state.terminationTillage4}
                />

                <Logic
                  id="terminationTillageAnnualUseHours"
                  q="Annual Use (hours on power)"
                  a={state.seedbedAnnualUseHours.toString()}
                  cond={state.terminationTillage4}
                />

                <Logic
                  id="terminationTillageAcresHour"
                  q="Acres/hour"
                  a={state.seedbedAcresHour.toString()}
                  cond={state.terminationTillage4}
                />

                <Logic
                  id="terminationTillageTotal"
                  q={state.seedbed3 === 'Self' ? `Estimated relevant cost (${dollars(state.seedbedEstimated)}/acre)` : `Estimated custom cost (${dollars(state.seedbedTotal)}/acre)`}
                  a={'dollar'}
                />
              </>
            )
          }
        </tbody>
      </table>
      <Navigation set={set} current={Termination} />

      <Activity db={db} parms={parms} props={props} set={set} type="termination" ds="Chemical"/>
      <Activity db={db} parms={parms} props={props} set={set} type="termination" ds="Tillage4"/>
      <Activity db={db} parms={parms} props={props} set={set} type="termination" ds="Product"/>
    </div>
  )
} // Termination

export default Termination;