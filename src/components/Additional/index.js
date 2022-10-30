import {Input} from '../../shared/Inputs';
import {Help} from '../../shared/Help';
import {ClearInputs} from '../ClearInputs';
import {useSelector, useDispatch} from 'react-redux';
import {get, set, test, getDefaults} from '../../store/Store';

const Additional = () => {
  const Stop = () => <div className="stop"></div>;

  const Considerations = () => (
    <>
      <div className="grid2">
        <header>
          Additional considerations
          <ClearInputs defaults={defaults} />
        </header>

        <div>
          <p>
            If you cash rent this field, will the landowner contribute to seed costs or other costs associated with planting cover crops?
          </p>
          <p>If yes, please enter the estimated cash contribution ($/acre)</p>
        </div>
        <div><Input id="additional.$landowner" /></div>

        <div>
          <p>
            Do you plan to participate in a state or federal program (e.g. USDA EQIP or USDA CSP) that provides financial assistance for using cover crops?
          </p>
          <p>
            If you click yes, an estimate of the NRCS EQIP state program (Practice 340) rate for your location and seeding mix is shown in the input box.
            You can change this financial assistance estimate to represent your specific opportunities.
            <Help>
              <p>
                The USDA NRCS provides financial assistance to some farms planting cover crops under Practice 340.
                The amount of financial assistance varies by state, cover crop practice and specific priorities.
              </p>
              <p>
                Priority programs include helping historically underserved audiences and water source protection.
                Financial assistance for planting multiple species is often greater than when planting a single species.
              </p>
              <p>
                The number of years that farms can receive cover crop financial assistance is usually limited.
              </p>
            </Help>
          </p>
        </div>
        <div><Input id="additional.nrcs" options={['Yes', 'No']} type="radio" /></div>

        <div hidden={context.nrcs !== 'Yes'}>
          Please enter the estimated cash contribution ($/acre)
        </div>
        <div><Input id="additional.$costShare" /></div>

        <div>
          <p>
            Do you anticipate participation in a voluntary carbon offset program that will provide a payment based on carbon reducing practices such as cover crops?
          </p>
          <p>
            If yes, please enter the estimated cash contribution ($/acre)
          </p>
        </div>
        <div><Input id="additional.$carbonOffset" /></div>

        <div>
          <p>
            Will you participate in a cover crop insurance discount program?
          </p>
          <p>
            If yes, please enter the estimated cash savings on your crop insurance premium ($/acre).
            <Help>
              <p>
                Growers may be eligible for discounts on their crop insurance premiums by planting cover crops.
              </p>
              <p>
                For example, the State of Iowa has offered a $5 per acre crop insurance discount program administered by the Iowa Department of Agriculture and Land Stewardship and the USDA Risk Management Agency (RMA) when growers planted a fall seeded cover crop.
                Similar programs have been available in Illinois.
                Note that some insurance policies may be excluded (e.g. Whole-Farm Revenue Protection or written agreements).
              </p>
            </Help>
          </p>
        </div>
        <div>
          <Input id="additional.$insuranceDiscount" />
        </div>
      </div>
    </>
  ) // Considerations

  const Grazing = () => {
    /*
      const Graze = (({type}) => (
        <>
          <div>Do you intend to {type} graze?</div>
          <div><Input id={`additional.${type}Graze`} options={['Yes', 'No']} type="radio" /></div>

          {
            context[type + 'Graze'] === 'Yes' && (
              <>
                <div>How many pounds of dry matter per acre will be harvested (grazed by cows)?</div>
                <div><Input id={`additional.${type}DryMatter`} /></div>

                <div>What % of the cover crop growth will not be utilized (waste) due to hoof action and/or selective grazing?</div>
                <div><Input id={`additional.${type}Waste`} type="percent" /></div>
              </>
            )
          }
        </>
      )) // Graze
    */

    const Graze = (({type}) => (
      <>
        <div>Do you intend to {type} graze?</div>
        <div><Input id={`additional.${type}Graze`} options={['Yes', 'No']} type="radio" /></div>

        <div hidden={context[type + 'Graze'] !== 'Yes'}>
          Amount of forage for {type} grazing
        </div>
        <div>
          <Input
            id={`additional.${type}Grazing`}
            options={['Low', 'Medium', 'High']}
            type="radio"
          />
        </div>
      </>
    )) // Graze

    return (
      <>
        <br/>
        <div className="grid2">
          <header>Grazing Cover Crops</header>

          <div className="colspan">
            Diversified crop and livestock operators can take advantage of the forage value cover crops provide.
            Growers without livestock may also find potential lease opportunities with livestock operators in their area.
            The following question will help you evaluate the financial impact of grazing livestock.
          </div>

          <div>Do you intend on grazing your cover crops?</div>
          <div><Input id="additional.grazing" options={['Yes', 'No']} type="radio" /></div>
          {context.grazing !== 'Yes' && <Stop />}
          
          <div>Do you intend to lease your cover crop acres to a livestock producer (not graze them with your operation)?</div>
          <div><Input id="additional.lease" options={['Yes', 'No']} type="radio" /></div>

          {context.lease === '' && <Stop />}

          {
            context.lease === 'Yes' && (
              <>
                <div>
                  What is the approximate value (per acre) you will receive for leasing your cover crop acres for grazing?
                </div>
                <div><Input id="additional.$lease" /></div>
                <Stop />
              </>
            )
          }

          <Graze type="fall" />
          <Graze type="spring" />

          {
            /* Removed per Sep 6 DST Review:
              <div>pounds hay not fed (per acre)</div>
              <div>{context.lbsNotFed}</div>

              <div>What is the dry matter percentage (DM%) of the hay you feed?</div>
              <div><Input id="additional.dryMatter" type="percent" /></div>
              
              <div>How much hay is wasted by cows in the feedlot?</div>
              <div><Input id="additional.wasted" type="percent" /></div>

              <div>What is the average size of bales you feed (pounds/bale)?</div>
              <div><Input id="additional.baleSize" /></div>
              
              <div>What is the approximate amount of time it takes you to feed one bale of hay during the winter months?</div>
              <div><Input id="additional.baleTime" /></div>

              <div>What tractor do you use for feeding?</div>
              <div>
                <Input
                  id="additional.tractor"
                  options={['', ...Object.keys(db.power).sort((a, b) => a.replace(/^\d+/, '').localeCompare(b.replace(/^\d+/, '')))]}
                />
              </div>
            */
          }
          
          <div>What is the value of the hay you feed? ($/ton)</div>
          <div><Input id="additional.$hay" /></div>
          
          <div>How much additional time (hours per acre) will be required for management of the grazing operation?</div>
          <div><Input id="additional.hoursAcre" /></div>
        </div>
      </>
    );
  } // Grazing

  const dispatch = useDispatch();
  const context = useSelector(get.additional);
  const dev = useSelector(get.dev);

  const defaults = getDefaults(Object.keys(context).map(key => `additional.${key}`));

  return (
    <div className="Additional">
      <h1>Additional Considerations</h1>
      <p>
        This portion of the <strong>Cover Crop Economic DST (Decision Support Tool)</strong> will address additional considerations that may impact the profitability of using cover crops in your operation.
        Please respond to questions for each of the sections below.
      </p>

      <h4>Cost-Share or Other Financial Incentives</h4>
      <p>
        As you consider the financial impacts of using cover crops in your operation, there are a number of programs that may provide cost share or financial support for your farm.
        Types of support could include cost-sharing of seed expense from landowners (if you cash rent), state program such as Soil &amp; Water Conservation Programs, federal programs such as EQIP (Environmental Quality Incentives Program) or CSP (Conservation Stewardship Program), or payments from companies aggregated voluntary carbon offsets.
        If you are not familiar with these types of programs, please refer to the <span className="link" onClick={() => dispatch(set.screen('Resources'))}>Resources page</span>.
        You will find a number of resources links to explore potential programs for your operation.
      </p>

      <Considerations />

      <Grazing />

      {
        dev && (
          <button
            onClick={() => {
              dispatch(set.additional.grazing('Yes'));
              dispatch(set.additional.lease('No'));
              dispatch(set.additional.fallGraze('Yes'));
              dispatch(set.additional.springGraze('Yes'));
              dispatch(set.additional.fallDryMatter(500));
              dispatch(set.additional.fallWaste(0.40));
              test('additional.fallDryMatter', 500);
              test('additional.fallWaste', 0.40);
              dispatch(set.additional.fallGraze('No'));
              test('additional.fallWaste', 0.50);

              dispatch(set.additional.fallGraze('Yes'));

              dispatch(set.additional.fallDryMatter(500));
              dispatch(set.additional.fallWaste(0.50));
              dispatch(set.additional.springDryMatter(1000));
              dispatch(set.additional.springWaste(0.50));
              dispatch(set.additional.dryMatter(0.88));
              dispatch(set.additional.wasted(0.22));
              dispatch(set.additional.$hay(80));
              dispatch(set.additional.baleSize(1800))
            }}
          >
            Test data
          </button>
        )
      }
    </div>
  );
} // Additional

Additional.menu = <span>Ot<u>h</u>er</span>;
// Additional.menu = <span>Additional Considerationss</span> ;

export default Additional;