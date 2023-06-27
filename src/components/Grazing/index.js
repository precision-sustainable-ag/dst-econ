import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Input from '../../shared/Inputs';
import ClearInputs from '../ClearInputs';
import {
  dev,
  get,
  set,
  test,
  getDefaults,
} from '../../store/Store';

const Stop = () => <div className="stop" />;

const Graze = ({ type }) => {
  const context = useSelector(get.grazing);
  return (
    <>
      <div>
        Do you intend to
        {type}
        graze?
      </div>
      <div>
        <Input id={`grazing.${type}Graze`} options={['Yes', 'No']} type="radio" />
      </div>
      <div hidden={context[`${type}Graze`] !== 'Yes'}>
        Amount of forage for
        {type}
        grazing
      </div>
      <div>
        <Input
          id={`grazing.${type}Grazing`}
          options={['Low', 'Medium', 'High']}
          type="radio"
        />
      </div>
    </>
  );
}; // Graze

const GrazingHelper = () => {
  const context = useSelector(get.grazing);
  const defaults = getDefaults(Object.keys(context).map((key) => `grazing.${key}`));

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
        {context.grazing !== 'Yes' && <Stop />}

        <div>
          Do you intend to lease your cover crop acres to a livestock producer (not graze them with your operation)?
        </div>
        <div>
          <Input id="grazing.lease" options={['Yes', 'No']} type="radio" />
        </div>

        {context.lease === '' && <Stop />}

        {context.lease === 'Yes' && (
          <>
            <div>
              What is the approximate value (per acre) you will receive for leasing your cover crop acres for grazing?
            </div>
            <div>
              <Input id="grazing.$lease" />
            </div>
            <Stop />
          </>
        )}

        <Graze type="fall" />
        <Graze type="spring" />

        <div>What is the value of the hay you feed? ($/ton)</div>
        <div>
          <Input id="grazing.$hay" />
        </div>

        <div>
          How much additional time (hours per acre) will be required for management of the grazing operation?
        </div>
        <div>
          <Input id="grazing.hoursAcre" />
        </div>
      </div>
    </div>
  );
}; // GrazingHelper

const Grazing = () => {
  const dispatch = useDispatch();

  return (
    <div className="Grazing">
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
            onClick={() => {
              dispatch(set.grazing.grazing('Yes'));
              dispatch(set.grazing.lease('No'));
              dispatch(set.grazing.fallGraze('Yes'));
              dispatch(set.grazing.springGraze('Yes'));
              dispatch(set.grazing.fallDryMatter(500));
              dispatch(set.grazing.fallWaste(0.4));
              test('grazing.fallDryMatter', 500);
              test('grazing.fallWaste', 0.4);
              dispatch(set.grazing.fallGraze('No'));
              test('grazing.fallWaste', 0.5);

              dispatch(set.grazing.fallGraze('Yes'));

              dispatch(set.grazing.fallDryMatter(500));
              dispatch(set.grazing.fallWaste(0.5));
              dispatch(set.grazing.springDryMatter(1000));
              dispatch(set.grazing.springWaste(0.5));
              dispatch(set.grazing.dryMatter(0.88));
              dispatch(set.grazing.wasted(0.22));
              dispatch(set.grazing.$hay(80));
              dispatch(set.grazing.baleSize(1800));
            }}
          >
            Test data
          </button>
        </div>
      )}
    </div>
  );
}; // Grazing

Grazing.menu = (
  <span>
    Gra
    <u>z</u>
    ing
  </span>
);

export default Grazing;
