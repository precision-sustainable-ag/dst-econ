import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Logic from '../Logic';
import Help from '../../shared/Help';
import {
  get, set, dollars, exampleErosion,
} from '../../store/Store';

const Erosion = () => {
  const dispatch = useDispatch();
  const state = useSelector(get.erosion);
  const dev = useSelector(get.dev);

  return (
    <div className="Erosion">
      <h1>Soil Erosion Control</h1>
      <p>
        Using cover crops has been documented to provide benefits with controlling soil erosion.
        Select the
        {' '}
        <NavLink
          className="link"
          onClick={() => dispatch(set.screen('Resources'))}
          to="/Resources"
        >
          Resources page
        </NavLink>
        {' '}
        button at the bottom of this page if you would like to read more about which cover crops can provide strong erosion control benefits.
        This portion of the Cover Crop Economic DST (Decision Support Tool) will help quantify potential cost savings.
        Please answer the following questions:
      </p>

      <table>
        <tbody>
          <Logic
            current="erosion"
            property="q1"
            q="Are there typically soil erosion issues associated with this field that require time and expense to repair?"
            a={['Yes', 'No']}
          />

          {
            state.q1 === 'Yes' && (
              <>
                <Logic
                  current="erosion"
                  property="q2"
                  q="How will soil repair activities be conducted on this field?"
                  a={['Skid steer', 'Trackhoe', 'Dozer']}
                />

                <Logic
                  current="erosion"
                  property="q3"
                  q="Cost ($) per hour"
                  a="dollar"
                />

                <Logic
                  current="erosion"
                  property="q4"
                  q="On average, estimate the reduced annualized number of hours to repair tile outlets, fix erosion issues,
                     repair terrace breakovers or other issues for this particular field."
                  a="number"
                />

                <tr style={{ background: 'yellow' }}>
                  <td>
                    Calculation of cost savings
                    <Help>
                      <p>
                        If erosion repair occurs less than once/year,
                        estimate the time it takes when done and divide by the number of years between repair activities.
                      </p>
                    </Help>
                  </td>
                  <td>
                    {dollars(state.total)}
                  </td>
                </tr>
              </>
            )
          }
        </tbody>
      </table>
      {
        dev && (
          <button type="button" onClick={exampleErosion}>Test data</button>
        )
      }
    </div>
  );
}; // Erosion

Erosion.menu = (
  <span>
    Erosio
    <u>n</u>
    {' '}
    Control
  </span>
);

export default Erosion;
