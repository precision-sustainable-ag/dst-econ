import Map from './GoogleMaps';
import Activity from './Activity';
import {Input} from './Inputs';

import {useSelector, useDispatch} from 'react-redux';
import {get, set, test} from '../store/store';

const Field = () => {
  const dispatch  = useDispatch();
  const priorCrop = useSelector(get.priorCrop);
  const cashCrop  = useSelector(get.cashCrop);
  const dev       = useSelector(get.dev);

  return (
    <>
      <form className="Field">
        <h1>Economic Decision Aid for Cover Crops: Field and Farm</h1>
        
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
                <h2>Where is your Field located?</h2>
                <p>
                  Enter your address or zip code to determine your field's location.<br/>
                  You can then zoom in and click to pinpoint it on the map.
                </p>
                <Map autoFocus/>
              </td>
              <td>
                <h2>What is the name of your Farm?</h2>
                <Input id="farm" fullWidth/>

                <h2>How many acres are in your Field?</h2>
                <Input id="acres" />

                <h2>Which of the following options best describes your Field?</h2>

                <Input
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

                <h2>What was the Prior Crop planted on this Field?</h2>
                <Input
                  id="priorCrop"
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
                      'Fallow',
                      'Prevent Plant Acres',
                      'Other',
                    ]
                  }
                />
                {
                  priorCrop === 'Other' &&
                  <>
                    <Input
                      id="otherPriorCrop"
                      placeholder="Enter prior crop here"
                    />
                  </>
                }

                <h2>What is your intended Cash Crop for this Field?</h2>
                <Input
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
                {
                  cashCrop === 'Other' &&
                  <Input
                    id="otherCashCrop"
                    placeholder="Enter cash crop here"
                  />
                }

                <h2>What is your Labor Value for Analysis? ($/hour)</h2>
                <Input id="$labor" />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      {dev && (
        <div>
          <button
            onClick={() => {
              dispatch(set.location('293 Ponderosa Drive, Athens, GA, USA'));
              test('lat', 33.9312);  // TODO
              test('lon', -83.3208);

              dispatch(set.priorCrop('Other'));
              dispatch(set.cashCrop('Other'));
            }}
          >
            Click me
          </button>
        </div>
      )}

      <Activity type="species"/>
    </>
  )
} // Field

Field.menu = 'Field and Farm';

export default Field;