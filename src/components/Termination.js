import Activity from './Activity';
import Logic from './Logic';
import {useStore} from '../store/Store';

const Termination = ({setScreen}) => {
  const {state, match, dollars, db} = useStore();

  const dbvalue = (table, key, parm) => {
    return db[table][key] ? db[table][key][parm] : '';
  } // dbvalue

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
            initial="No"
            zzinitial="No"
            a={['Yes', 'No']}
            onInput={(e) => {
              if (e.target.value === 'Yes') {
                setScreen('Tillage');
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

      <Activity type="termination" ds="Chemical"/>
      <Activity type="termination" ds="Tillage4"/>
      <Activity type="termination" ds="Product" />
    </div>
  )
} // Termination

export default Termination;