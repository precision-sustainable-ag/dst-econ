import Logic from '../Logic';
import {ClearInputs} from '../ClearInputs';

import {useSelector} from 'react-redux';
import {get, db, getDefaults, clearInputs, exampleHerbicides} from '../../store/Store';

const herbicideDefaults   = getDefaults(Object.keys(get.herbicide).map(parm => 'herbicide.' + parm));
const fallDefaults        = getDefaults(Object.keys(get.herbicideFall).map(parm => 'herbicideFall.' + parm));
const additionalDefaults  = getDefaults(Object.keys(get.herbicideAdditional).map(parm => 'herbicideAdditional.' + parm));
const reducedDefaults     = getDefaults(Object.keys(get.herbicideReduced).map(parm => 'herbicideReduced.' + parm));

const defaults = {...herbicideDefaults, ...fallDefaults, ...additionalDefaults, ...reducedDefaults};

const Herbicide = () => {
  const current = 'herbicide';
  const state = useSelector(get[current]);
  const additionalProduct = useSelector(get.herbicideAdditional.product);
  const additionalCost = useSelector(get.herbicideAdditional.cost);
  const reducedProject = useSelector(get.herbicideReduced.product);
  const reducedCost = useSelector(get.herbicideReduced.cost);

  const dev = useSelector(get.dev);

  return (
    <div className="Herbicide">
      <h1>Herbicide</h1>
      <p>
        This module will address reductions or additional herbicide costs associated with integrating cover crops into your rotation.
        As a reminder, the <strong>Cover Crop Economic DST (Decision Support Tool)</strong> considers changes to your crop management system specific to the inclusion of cover crops.
        Therefore, this module only considers changes to your herbicide program specific to post emerge or fall herbicide applications.
        For example, some users have found the allelopathic effects of using cereal rye have enabled them to reduce the amount of herbicide used in their spray program.
        Some growers that have historically used multiple post emerge spray applications have found they can eliminate a herbicide pass when using cover crops.
        You can also read case studies linked to the right to gain more insight of how cover crops have changed management practices for growers.
      </p>

      <form>
        <table className={current + ' inputs'}>
          <tbody>
            <tr>
              <th colSpan="2">
                Herbicides
                <ClearInputs defaults={defaults} />
              </th>
            </tr>
            <Logic
              current={current}
              property="q1"
              q="Will you modify your post emerge spray program when using cover crops (either the herbicides used or the number of applications)?"
              a={['Yes', 'No']}
            />

            {
              state.q1 === 'Yes' && (
                <>
                  <tr><th colSpan="100">Additional Herbicides</th></tr>
                  <Logic
                    current={current}
                    property="q2"
                    q="Do you plan on adding additional herbicides or making additional spray applications when adding cover crops to your rotation?"
                    a={['Yes', 'No']}
                    onChange={() => {
                      clearInputs(additionalDefaults);
                    }}
                  />
                </>
              )
            }

            {
              state.q2 === 'Yes' && (
                <>
                  <tr><th colSpan="100">What is the estimated cost of the additional herbicide?</th></tr>
                  <Logic
                    current="herbicideAdditional"
                    property="product"
                    q="Product"
                    a={['', ...Object.keys(db.herbicides).sort()]}
                  />

                  <Logic
                    current="herbicideAdditional"
                    property="unitCost"
                    q="Cost per unit of product"
                    a={'dollar'}
                    suffix={db.herbicides[additionalProduct]?.['Unit (cost)']}
                  />

                  <Logic
                    current="herbicideAdditional"
                    property="rate"
                    q="Application rate"
                    a={'number'}
                    suffix={db.herbicides[additionalProduct]?.['Unit (rate)']}
                  />

                  <Logic
                    current="herbicideAdditional"
                    property="cost"
                    q="Product cost"
                    a={additionalCost}
                  />
      
                  <Logic
                    current="herbicideAdditional"
                    property="implement"
                    q="What method will be used for the additional post emerge application?"
                    type="Chemical"
                    shown={state.q1}
                    custom={['I will not be making an additional application', 'Hire custom operator']}
                  />
      
                  <Logic current="herbicideAdditional" question="power" />
      
                  <Logic current="herbicideAdditional" question="Annual Use (acres on implement)" />
                  <Logic current="herbicideAdditional" question="Annual Use (hours on power)" />
                  <Logic current="herbicideAdditional" question="Acres/hour" />
      
                  <Logic
                    current="herbicideAdditional"
                    question="Estimated"
                    q="Chemical spray equipment cost ($/acre)"
                    a={'dollar'}
                  />
                </>
              )
            }

            {
              state.q1 === 'Yes' && state.q2 && (
                <>
                  <tr><th colSpan="100">Reduced Herbicides</th></tr>
                  <Logic
                    current={current}
                    property="q5"
                    q="Do you plan on reducing the amount of herbicides used or eliminating a post-emerge spray application with the use of cover crops?"
                    a={['Yes', 'No']}
                    onChange={() => {
                      clearInputs(reducedDefaults);
                    }}
                  />
                </>
              )
            }

            {
              state.q5 === 'Yes' && (
                <>
                  <tr><th colSpan="100">What is the estimated savings from reduced herbicides (cost per acre)?</th></tr>

                  <Logic
                    current="herbicideReduced"
                    property="product"
                    q="Product"
                    a={['', ...Object.keys(db.herbicides).sort()]}
                  />

                  <Logic
                    current="herbicideReduced"
                    property="unitCost"
                    q="Cost per unit of product"
                    a={'dollar'}
                    suffix={db.herbicides[reducedProject]?.['Unit (cost)']}
                  />

                  <Logic
                    current="herbicideReduced"
                    property="rate"
                    q="Application rate"
                    a={'number'}
                    suffix={db.herbicides[reducedProject]?.['Unit (rate)']}
                  />

                  <Logic
                    current="herbicideReduced"
                    property="cost"
                    q="Product cost"
                    a={reducedCost}
                  />

                  <Logic
                    current="herbicideReduced"
                    property="implement"
                    q="How would you have conducted the post emerge application?"
                    type="Chemical"
                    shown={state.q1}
                    custom={['I will not be making an additional application', 'Hire custom operator']}
                  />

                  <Logic current="herbicideReduced" question="power" />

                  <Logic current="herbicideReduced" question="Annual Use (acres on implement)" />
                  <Logic current="herbicideReduced" question="Annual Use (hours on power)" />
                  <Logic current="herbicideReduced" question="Acres/hour" />

                  <Logic
                    current="herbicideReduced"
                    question="Estimated"
                    q="Chemical spray equipment cost ($/acre)"
                    a={'dollar'}
                  />
                </>
              )
            }

            {
              state.q1 && (
                <>
                  <tr><th colSpan="100">Fall Herbicides</th></tr>
                  <Logic
                    current={current}
                    property="q8"
                    q="Historically, have you implemented a fall herbicide program on this field?"
                    a={['Yes', 'No']}
                    onChange={() => clearInputs(fallDefaults)}
                  />
                </>
              )
            }

            {
              state.q8 === 'Yes' && (
                <>
                  <Logic
                    current="herbicideFall"
                    property="savings"
                    q="Implementing cover crops will allow you to forgo a fall herbicide application. What is the estimated reduction (savings) of herbicide cost on a per acre basis?"
                    a="dollar"
                    shown={state.q1}
                  />
      
                  <Logic
                    current="herbicideFall"
                    property="implement"
                    q="How would you have conducted your fall herbicide program?"
                    type="Chemical"
                    shown={state.q1}
                  />
      
                  <Logic current="herbicideFall" question="power" />
      
                  <Logic current="herbicideFall" question="Annual Use (acres on implement)" />
                  <Logic current="herbicideFall" question="Annual Use (hours on power)" />
                  <Logic current="herbicideFall" question="Acres/hour" />
      
                  <Logic
                    current="herbicideFall"
                    question="Estimated"
                    q="Chemical spray equipment cost ($/acre)"
                    a={'dollar'}
                  />
                </>  
              )
            }

          </tbody>
        </table>
      </form>
      
      {
        dev && <button onClick={exampleHerbicides}>Test</button>
      }
    </div>
  )
} // Herbicide

Herbicide.menu = <span>He<u>r</u>bicide</span>;

export default Herbicide;