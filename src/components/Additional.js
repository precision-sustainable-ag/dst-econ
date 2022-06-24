import Activity from './Activity';
import {Input} from './Inputs';

import {useSelector, useDispatch} from 'react-redux';
import {get, set, test, getDefaults, clearInputs, db} from '../store/store';

const Additional = () => {
  const dispatch = useDispatch();
  const context = useSelector(get.additional);
  const dev = useSelector(get.dev);

  return (
    <div className="Additional">
      <h1>Economic Decision Aid for Cover Crops: Additional Considerations</h1>
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

      <table>
        <tbody>
          <tr>
            <td>
              If you cash rent this field, will the landowner contribute to seed costs or other costs associated with planting cover crops?<br/>
              If yes, please enter the estimated cash contribution ($/acre)
            </td>
            <td>
              <Input id="additional.$landowner" />
            </td>
          </tr>

          <tr>
            <td>
              Do you anticipate participation in a state or federal program that will provide a cost-share payment for using cover crops?<br/>
              If yes, please enter the estimated cash contribution ($/acre)
            </td>
            <td>
              <Input id="additional.$costShare" />
            </td>
          </tr>

          <tr>
            <td>
              Do you anticipate participation in a voluntary carbon offset program that will provide a payment based on carbon reducing practices such as cover crops?<br/>
              If yes, please enter the estimated cash contribution ($/acre)
            </td>
            <td>
              <Input id="additional.$carbonOffset" />
            </td>
          </tr>
        
        </tbody>
      </table>

      <h4>Grazing Cover Crops</h4>
      <p>
        Diversified crop and livestock operators can take advantage of the forage value cover crops provide.
        Growers without livestock may also find potential lease opportunities with livestock operators in their area.
        The following question will help you evaluate the financial impact of grazing livestock.
      </p>

      <table>
        <tbody>
          <tr>
            <td>Do you intend on grazing your cover crops?</td>
            <td><Input id="additional.grazing" options={['Yes', 'No']} type="radio"/></td>
          </tr>

          {
            context.grazing === 'Yes' && (
              <tr>
                <td>Do you intend to lease your cover crop acres to a livestock producer (not graze them with your operation)?</td>
                <td><Input id="additional.lease" options={['Yes', 'No']} type="radio" /></td>
              </tr>
            )
          }

          {
            context.lease === 'Yes' && (
              <tr>
                <td>What is the approximate value (per acre) you will receive for leasing your cover crop acres for grazing?</td>
                <td><Input id="additional.$lease" /></td>
              </tr>
            )
          }

          {
            context.lease === 'No' && (
              <>
                <tr>
                  <td>Do you intend to fall graze?</td>
                  <td><Input id="additional.fallGraze" options={['Yes', 'No']} type="radio" /></td>
                </tr>
                {
                  context.fallGraze === 'Yes' && (
                    <>
                      <tr>
                        <td>How many pounds of dry matter per acre will be harvested (grazed by cows)?</td>
                        <td><Input id="additional.fallDryMatter" /></td>
                      </tr>
                      <tr>
                        <td>What % of the cover crop growth will not be utilized (waste) due to hoof action and/or selective grazing?</td>
                        <td><Input id="additional.fallWaste" type="percent" /></td>
                      </tr>
                    </>
                  )
                }

                <tr>
                  <td>Do you intend to spring graze?</td>
                  <td><Input id="additional.springGraze" options={['Yes', 'No']} type="radio" /></td>
                </tr>
                {
                  context.springGraze === 'Yes' && (
                    <>
                      <tr>
                        <td>How many pounds of dry matter per acre will be harvested (grazed by cows)?</td>
                        <td><Input id="additional.springDryMatter" /></td>
                      </tr>
                      <tr>
                        <td>What % of the cover crop growth will not be utilized (waste) due to hoof action and/or selective grazing?</td>
                        <td><Input id="additional.springWaste" type="percent" /></td>
                      </tr>
                    </>
                  )
                }

                <tr>
                  <td>lbs hay not fed (per ac)</td>
                  <td>{context.lbsNotFed}</td>
                </tr>
                <tr>
                  <td>What is the dry matter percentage (DM%) of the hay you feed?</td>
                  <td><Input id="additional.dryMatter" type="percent" /></td>
                </tr>
                <tr>
                  <td>How much hay is wasted by cows in the feedlot?</td>
                  <td><Input id="additional.wasted" type="percent" /></td>
                </tr>
                <tr>
                  <td>What is the value of the hay you feed?</td>
                  <td><Input id="additional.$hay" /></td>
                </tr>
                <tr>
                  <td>How much additional time (hours per acre) will be required for management of the grazing operation?</td>
                  <td><Input id="additional.hoursAcre" /></td>
                </tr>
                <tr>
                  <td>What is the average size of bales you feed (lbs/bale)?</td>
                  <td><Input id="additional.baleSize" /></td>
                </tr>
                <tr>
                  <td>What is the approximate amount of time it takes you to feed one bale of hay during the winter months?</td>
                  <td><Input id="additional.baleTime" /></td>
                </tr>
                <tr>
                  <td>What tractor do you use for feeding?</td>
                  <td>
                    <Input
                      id="additional.tractor"
                      options={['', ...Object.keys(db.power).sort((a, b) => a.replace(/^\d+/, '').localeCompare(b.replace(/^\d+/, '')))]}
                    />
                  </td>
                </tr>
              </>
            )
          }
        </tbody>
      </table>

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

            }}
          >
            Test data
          </button>
        )
      }
      
    </div>
  );
} // Additional

Additional.menu = 'Additional considerations';

export default Additional;