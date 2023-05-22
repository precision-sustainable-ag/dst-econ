import React from 'react';
import { useSelector } from 'react-redux';
import Input from '../../shared/Inputs';

import { get } from '../../store/Store';

const Stop = () => <div className="stop" />;

const Graze = ({ type }) => {
  const context = useSelector(get.additional);
  return (
    <>
      <div>
        Do you intend to
        {type}
        graze?
      </div>
      <div>
        <Input id={`additional.${type}Graze`} options={['Yes', 'No']} type="radio" />
      </div>
      <div hidden={context[`${type}Graze`] !== 'Yes'}>
        Amount of forage for
        {type}
        grazing
      </div>
      <div>
        <Input
          id={`additional.${type}Grazing`}
          options={['Low', 'Medium', 'High']}
          type="radio"
        />
      </div>
    </>
  );
}; // Graze

const GrazingHelper = () => {
  const context = useSelector(get.additional);

  return (
    <>
      <br />
      <div className="mobile-table-div">
        <div className="grid2">
          <header>Grazing Cover Crops</header>

          <div className="colspan">
            Diversified crop and livestock operators can take advantage of the forage value cover crops provide.
            Growers without livestock may also find potential lease opportunities with livestock operators in their area.
            The following question will help you evaluate the financial impact of grazing livestock.
          </div>

          <div>Do you intend on grazing your cover crops?</div>
          <div>
            <Input id="additional.grazing" options={['Yes', 'No']} type="radio" />
          </div>
          {context.grazing !== 'Yes' && <Stop />}

          <div>
            Do you intend to lease your cover crop acres to a livestock producer (not graze them with your operation)?
          </div>
          <div>
            <Input id="additional.lease" options={['Yes', 'No']} type="radio" />
          </div>

          {context.lease === '' && <Stop />}

          {context.lease === 'Yes' && (
            <>
              <div>
                What is the approximate value (per acre) you will receive for leasing your cover crop acres for grazing?
              </div>
              <div>
                <Input id="additional.$lease" />
              </div>
              <Stop />
            </>
          )}

          <Graze type="fall" />
          <Graze type="spring" />

          <div>What is the value of the hay you feed? ($/ton)</div>
          <div>
            <Input id="additional.$hay" />
          </div>

          <div>
            How much additional time (hours per acre) will be required for management of the grazing operation?
          </div>
          <div>
            <Input id="additional.hoursAcre" />
          </div>
        </div>
      </div>
    </>
  );
}; // Grazing

/* eslint-disable */
const Grazing = () => {
  return (
    <div className="Additional">
      <h1>Additional Considerations (Grazing)</h1>
      <GrazingHelper />
    </div>
  );
}; // Additional
/* eslint-enable */

Grazing.menu = (
  <span>
    Gra
    <u>z</u>
    ing
  </span>
);

export default Grazing;
