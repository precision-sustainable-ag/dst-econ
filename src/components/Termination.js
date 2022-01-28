import Activity from './Activity';
import {Navigation} from './Navigation';
import Logic from './Logic';

const Termination = ({db, parms, props, set}) => (
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
          a={['Yes', 'No']}
          parms={parms}
          props={props}
        />

        <Logic
          id="termination3"
          q="Who will do this activity?"
          a={['Self', 'Custom Operator']}
          cond={parms.termination2 === 'No'}
          parms={parms}
          props={props}
        />

        <Logic
          id="terminationMethod"
          q="Cover Crop termination method"
          a={['', 'Herbicide application', 'Roller', 'Roller with follow-up chemical', 'Mechanical termination']}
          parms={parms}
          cond={parms.termination2 === 'No' && parms.termination3 === 'Self'}
          props={props}
        />

        <Logic
          id="terminationProduct"
          q="Product"
          a={['', ...Object.keys(db.herbicides).sort()]}
          parms={parms}
          cond={parms.termination2 === 'No' && parms.termination3 === 'Self' && parms.terminationMethod === 'Herbicide application'}
          props={props}
        />

        <Logic
          id="terminationUnitCost"
          q="Cost per unit of product"
          a={'dollar'}
          parms={parms}
          cond={parms.termination2 === 'No' && parms.termination3 === 'Self' && (/Herbicide application|Roller with follow-up chemical/.test(parms.terminationMethod))}
          props={props}
          suffix={parms.terminationUnit}
        />

        <Logic
          id="terminationRate"
          q="Application rate"
          a={'number'}
          parms={parms}
          cond={parms.termination2 === 'No' && parms.termination3 === 'Self' && (/Herbicide application|Roller with follow-up chemical/.test(parms.terminationMethod))}
          props={props}
          suffix={parms.terminationRateUnit}
        />

        <Logic
          id="terminationProductCost"
          q="Product cost"
          a={parms.terminationProductCost}
          parms={parms}
          cond={parms.termination2 === 'No' && parms.termination3 === 'Self' && (/Herbicide application|Roller with follow-up chemical/.test(parms.terminationMethod))}
          props={props}
        />

        <Logic
          id="terminationCustomCost"
          q="Custom operator cost ($/acre)"
          a={'dollar'}
          parms={parms}
          cond={parms.termination3 === 'Custom Operator'}
          props={props}
        />
      </tbody>
    </table>
    <Navigation set={set} current={Termination} />
  </div>
) // Termination

export default Termination;