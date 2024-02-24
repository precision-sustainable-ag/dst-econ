import React from 'react';
import { useSelector } from 'react-redux';
import Input from '../../shared/Inputs';
import ClearInputs from '../ClearInputs';
import {
  dev,
  get,
  getDefaults,
  exampleGrazing,
  dollars,
} from '../../store/Store';

import './styles.scss';

const Stop = () => <span className="stop" />;

const GrazingHelper = () => {
  const grazing = useSelector(get.grazing);
  const defaults = getDefaults(Object.keys(grazing).map((key) => `grazing.${key}`));

  return (
    <div className="mobile-table-div">
      <div className="grid2">
        <header>
          Grazing Cover Crops
          <ClearInputs defaults={defaults} />
        </header>

        <div>Do you intend on grazing your cover crops?</div>
        <div>
          <Input id="grazing.grazing" options={['Yes', 'No']} type="radio" />
        </div>
        {grazing.grazing !== 'Yes' && <Stop />}

        <div>
          Do you intend to lease your cover crop acres to a livestock producer (not graze them with your own cattle)?
        </div>
        <div>
          <Input id="grazing.lease" options={['Yes', 'No']} type="radio" />
        </div>

        {grazing.lease === '' && <Stop />}

        {grazing.lease === 'Yes' && (
          <>
            <div>What is the approximate value (per acre) you will receive for leasing your cover crop acres for grazing?</div>
            <div>
              <Input id="grazing.$lease" />
            </div>
            <Stop />
          </>
        )}

        <div>Amount of forage for fall grazing</div>
        <div>
          <Input id="grazing.fall" options={[0, 500, 1000, 1500]} labels={['None', 'Low', 'Medium', 'High']} type="radio" />
        </div>

        <div>Amount of forage for spring grazing</div>
        <div>
          <Input id="grazing.spring" options={[0, 500, 1000, 1500]} labels={['None', 'Low', 'Medium', 'High']} type="radio" />
        </div>

        <div>What is the value of the hay you feed? ($/ton)</div>
        <div>
          <Input id="grazing.$hay" />
        </div>

        <div>Current hours per season used in feeding livestock</div>
        <div>
          <Input id="grazing.hoursFeeding" />
        </div>

        <div>Hours per season to feed livestock and graze cover crops</div>
        <div>
          <Input id="grazing.hoursGrazingFeeding" />
        </div>

        <div style={{ background: 'lightyellow' }}>Additional hours per acre per season required for grazing livestock (hours/acre)</div>
        <div style={{ background: 'lightyellow' }}>
          {grazing.hoursAcre.toFixed(2)}
          {grazing.hoursAcre > 1 && (
          <div className="warning" style={{ paddingLeft: '2rem', fontWeight: 'normal' }}>
            Please confirm this number.
            <br />
            It seems too high.
          </div>
          )}
        </div>

        <div style={{ background: 'lightyellow' }}>Net impact of Grazing ($/acre)</div>
        <div style={{ background: 'lightyellow' }}>
          {dollars(-grazing.total)}
        </div>
      </div>
    </div>
  );
}; // GrazingHelper

const Grazing = () => (
  <div id="Grazing">
    <h1>Grazing</h1>
    <p>
      Diversified crop and livestock operators can take advantage of the forage value cover crops provide.
      Growers without livestock may also find potential lease opportunities with livestock operators in their area.
      The following question will help you evaluate the financial impact of grazing livestock.
    </p>

    <GrazingHelper />

    {dev && (
      <div className="test-buttons">
        <button
          type="button"
          onClick={exampleGrazing}
        >
          Test data
        </button>
      </div>
    )}
  </div>
); // Grazing

Grazing.menu = (
  <span>
    Gra
    <u>z</u>
    ing
  </span>
);

export default Grazing;
