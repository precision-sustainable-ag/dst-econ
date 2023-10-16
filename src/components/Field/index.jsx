import React from 'react';
import { useSelector } from 'react-redux';
import Map from '../../shared/Map';
import Input from '../../shared/Inputs';
import ClearInputs from '../ClearInputs';
import {
  dev,
  get,
  getDefaults,
  db,
  exampleField,
} from '../../store/Store';

import './styles.scss';

const defaults = getDefaults([
  'location',
  'farm',
  'field',
  'mapFeatures.area',
  '$labor',
  '$diesel',
  'cashCrop',
  'otherCashCrop',
]);

const Field = () => {
  const cashCrop = useSelector(get.cashCrop);

  return (
    <div id="Field">
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
      <p style={{ display: 'none' }}>
        If you are a registered user, this information will be saved to your account but not utilized for any other purpose.
        <br />
        If you are a guest user, the information will not be saved and cannot be accessed by you again if you close out of the DST.
      </p>

      <p>Please answer all of the following:</p>

      <div className="inputs">
        {dev && (
          <div className="test-buttons">
            <button
              type="button"
              onClick={exampleField}
            >
              Test data
            </button>
          </div>
        )}

        <div className="clear">
          <span style={{ marginLeft: '40%' }}><b>Field and Farm</b></span>
          <ClearInputs defaults={defaults} />
        </div>
        <div className="field-grid">
          <div className="field-details">
            <h2>Farm name (or FSA farm number)</h2>
            <Input id="farm" fullWidth />

            <h2>Field name (or FSA field number)</h2>
            <Input id="field" fullWidth />

            <h2>How many acres are in your Field?</h2>
            <Input id="mapFeatures.area" type="number" />

            <h2>What is your intended Cash Crop for this Field?</h2>
            <Input
              id="cashCrop"
              options={[...Object.keys(db.commodities), 'Other']}
            />
            {cashCrop === 'Other' && (
              <Input id="otherCashCrop" placeholder="Enter cash crop here" />
            )}

            <h2>What is your Labor Value for Analysis? ($/hour)</h2>
            <Input id="$labor" />

            <h2>What is your diesel cost? ($/gal)</h2>
            <Input id="$diesel" />
          </div>
          <Map />
        </div>
      </div>
    </div>
  );
}; // Field

Field.menu = (
  <span>
    Field &amp; Far
    <u>m</u>
  </span>
);

export default Field;
