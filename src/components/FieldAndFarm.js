import Map from './GoogleMaps';
import {Navigation} from './Navigation';
import {Autocomplete, Input} from './Inputs';
import {Context} from './Store';
import {useContext} from 'react';

const FieldAndFarm = () => {
  const {state} = useContext(Context);

  return (
    <div className="fieldAndFarm">
      <h1 id="H1">Economic Decision Aid for Cover Crops: Field and Farm</h1>
      
      <p>
        Our first step with the <strong><em>Cover Crop Economic DST (Decision Support Tool)</em></strong> is to provide basic information on the field you wish to examine.
      </p>
      <p>
        If you are a registered user, this information will be saved to your account but not utilized for any other purpose.
        <br/>
        If you are a guest user, the information will not be saved and cannot be accessed by you again if you close out of the DST.
      </p>

      <p>
        Please answer all of the following:
      </p>

      <table className="fullWidth">
        <tbody>
          <tr>
            <td rowSpan="6">
              <strong>Where is your Field located?</strong>
              <p>
                Enter your address or zip code to determine your field's location.<br/>
                You can then zoom in and click to pinpoint it on the map.
              </p>
              <Map autofocus/>
            </td>
            <td>
              <strong>What is the name of your Farm?</strong>
              <br/>
              <Input id="farm" />
            </td>
          </tr>

          <tr>
            <td className="hidden" />
            <td>
              <strong>How many acres are in your Field?</strong>
              <br/>
              <Input id="acres" type="number" />
            </td>
          </tr>

          <tr>
            <td className="hidden" />
            <td>
              <strong>Which of the following options best describes your Field?</strong>
              <br/>
              <Autocomplete
                id="description"
                options={
                  [
                    {label: 'Hill ground; well-drained'  , value: 'hw'},
                    {label: 'Hill ground; poorly-drained', value: 'hp'},
                    {label: 'Bottom land; well-drained'  , value: 'bw'},
                    {label: 'Bottom land; poorly-drained', value: 'bp'},
                  ]
                }
              />
            </td>
          </tr>

          <tr>
            <td className="hidden" />
            <td>
              <strong>What was the Prior Crop planted on this Field?</strong>
              <br/>
              <Autocomplete
                id="priorCrop"
                options={
                  [
                    {label: 'Corn'},
                    {label: 'Soybeans'},
                    {label: 'Wheat'},
                    {label: 'Grain Sorghum (milo)'},
                    {label: 'Cotton'},
                    {label: 'Rice'},
                    {label: 'Sunflowers'},
                    {label: 'Canola'},
                    {label: 'Fallow'},
                    {label: 'Prevent Plant Acres'},
                    {label: 'Other'},
                  ]
                }
              />
              <br/>
              {
                state.priorCrop.label === 'Other' && 
                <Input id="otherPriorCrop" placeholder="Enter crop here" />
              }
            </td>
          </tr>

          <tr>
            <td className="hidden" />
            <td>
              <strong>What is your intended Cash Crop for this Field?</strong>
              <br/>
              <Autocomplete
                id="cashCrop"
                options={
                  [
                    'Corn',
                    'Soybeans',
                    'Wheat',
                    'Grain Sorghum (milo)',
                    'Cotton',
                    'Rice',
                    'Sunflowers',
                    'Canola',
                    'Other',
                  ]
                }
              />
              <br/>
              {
                state.cashCrop === 'other' && 
                <Input id="otherCashCrop" placeholder="Enter crop here" />
              }
            </td>
          </tr>
          
          <tr>
            <td className="hidden" />
            <td>
              <strong>What is your Labor Value for Analysis? ($/hour)</strong>
              <br/>
              <Input 
                id="labor"
                type="dollar"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <Navigation current={FieldAndFarm} />
    </div>
  )
} // FieldAndFarm

FieldAndFarm.menu = 'Field and Farm';

export default FieldAndFarm;