import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Map from '../../shared/Map';
import { Input } from '../../shared/Inputs';
import { ClearInputs } from '../ClearInputs';
import {
  get, set, test, getDefaults,
} from '../../store/Store';

const defaults = getDefaults(
  'lat|lon|location|farm|field|acres|$labor|priorCrop|otherPriorCrop|cashCrop|otherCashCrop|description',
);

const Field = () => {
  const dispatch = useDispatch();
  const priorCrop = useSelector(get.priorCrop);
  const cashCrop = useSelector(get.cashCrop);
  const dev = useSelector(get.dev);
  const width = useSelector(get.screenWidth);
  const height = useSelector(get.screenHeight);

  return (
    <>
      <form className="Field">
        <h1>Field and Farm</h1>

        <p>
          Our first step with the
          {' '}
          <strong>
            <em>Cover Crop Economic DST (Decision Support Tool)</em>
          </strong>
          {' '}
          is to provide basic information on the field you wish to examine.
        </p>
        <p>
          If you are a registered user, this information will be saved to your
          account but not utilized for any other purpose.
          <br />
          If you are a guest user, the information will not be saved and cannot
          be accessed by you again if you close out of the DST.
        </p>

        <p>Please answer all of the following:</p>

        <table className="field-table">
          <thead>
            <tr>
              <td colSpan={2} style={{ position: 'relative' }}>
                &nbsp;
                <ClearInputs defaults={defaults} />
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              {(width <= 91600 || height <= 650) && (
                <td rowSpan="6">
                  <Map initWidth="100%" initHeight="400px" />
                </td>
              )}
              <td>
                <h2>What is the name of your Farm?</h2>
                <Input id="farm" fullWidth />

                <h2>What is the name of your Field?</h2>
                <Input id="field" fullWidth />

                <h2>How many acres are in your Field?</h2>
                <Input id="acres" />

                <h2>
                  Which of the following options best describes your Field?
                </h2>

                <Input
                  id="description"
                  options={[
                    { label: 'Hill ground; well-drained', value: 'hw' },
                    { label: 'Hill ground; poorly-drained', value: 'hp' },
                    { label: 'Bottom land; well-drained', value: 'bw' },
                    { label: 'Bottom land; poorly-drained', value: 'bp' },
                  ]}
                />

                <h2>What was the Prior Crop planted on this Field?</h2>
                <Input
                  id="priorCrop"
                  options={[
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
                  ]}
                />
                {priorCrop === 'Other' && (
                  <Input
                    id="otherPriorCrop"
                    placeholder="Enter prior crop here"
                  />
                )}

                <h2>What is your intended Cash Crop for this Field?</h2>
                <Input
                  id="cashCrop"
                  options={[
                    'Corn',
                    'Soybeans',
                    'Wheat',
                    'Grain Sorghum (milo)',
                    'Cotton',
                    'Rice',
                    'Sunflowers',
                    'Canola',
                    'Other',
                  ]}
                />
                {cashCrop === 'Other' && (
                  <Input
                    id="otherCashCrop"
                    placeholder="Enter cash crop here"
                  />
                )}

                <h2>What is your Labor Value for Analysis? ($/hour)</h2>
                <Input id="$labor" />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="field-mobile">
          <div>
            <ClearInputs defaults={defaults} />
          </div>
          <Map initWidth="100%" initHeight="400px" />
          <h2>What is the name of your Farm?</h2>
          <Input id="farm" fullWidth />

          <h2>What is the name of your Field?</h2>
          <Input id="field" fullWidth />

          <h2>How many acres are in your Field?</h2>
          <Input id="acres" />

          <h2>Which of the following options best describes your Field?</h2>

          <Input
            id="description"
            options={[
              { label: 'Hill ground; well-drained', value: 'hw' },
              { label: 'Hill ground; poorly-drained', value: 'hp' },
              { label: 'Bottom land; well-drained', value: 'bw' },
              { label: 'Bottom land; poorly-drained', value: 'bp' },
            ]}
          />

          <h2>What was the Prior Crop planted on this Field?</h2>
          <Input
            id="priorCrop"
            options={[
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
            ]}
          />
          {priorCrop === 'Other' && (
            <Input id="otherPriorCrop" placeholder="Enter prior crop here" />
          )}

          <h2>What is your intended Cash Crop for this Field?</h2>
          <Input
            id="cashCrop"
            options={[
              'Corn',
              'Soybeans',
              'Wheat',
              'Grain Sorghum (milo)',
              'Cotton',
              'Rice',
              'Sunflowers',
              'Canola',
              'Other',
            ]}
          />
          {cashCrop === 'Other' && (
            <Input id="otherCashCrop" placeholder="Enter cash crop here" />
          )}

          <h2>What is your Labor Value for Analysis? ($/hour)</h2>
          <Input id="$labor" />
        </div>
      </form>
      {dev && (
        <button
          type="button"
          onClick={() => {
            dispatch(set.location('293 Ponderosa Drive, Athens, GA, USA'));
            dispatch(set.farm('My farm'));
            dispatch(set.field('My field'));
            dispatch(set.acres(123));
            dispatch(set.field('My field'));
            dispatch(set.description('Bottom land; poorly-drained'));
            dispatch(set.priorCrop('Other'));
            dispatch(set.otherPriorCrop('Wheat'));
            dispatch(set.cashCrop('Other'));
            dispatch(set.otherCashCrop('Barley'));
            dispatch(set.$labor(999));

            test('lat', 33.9312); // TODO
            test('lon', -83.3208);
          }}
        >
          Test data
        </button>
      )}
    </>
  );
}; // Field

Field.menu = (
  <span>
    Field &amp; Far
    <u>m</u>
  </span>
);

export default Field;
