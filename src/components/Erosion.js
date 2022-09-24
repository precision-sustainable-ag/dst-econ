import Logic from './Logic';
import {Icon} from '@mui/material';

import {get, set, test, getDefaults, dollars} from '../store/store';
import {useSelector, useDispatch} from 'react-redux';

const Erosion = () => {
  const dispatch = useDispatch();
  const current = 'erosion';
  const state = useSelector(get[current]);
  const dev = useSelector(get.dev);

  return (
    <div className="Erosion">
      <h1>Economic Decision Aid for Cover Crops: Soil Erosion Control</h1>
      <p>
        Using cover crops has been documented to provide benefits with controlling soil erosion.
        Select the <span className="link" onClick={() => dispatch(set.screen('Resources'))}>Resources page</span> button at the bottom of this page if you would like to read more about which cover crops can provide strong erosion control benefits.
        This portion of the Cover Crop Economic DST (Decision Support Tool) will help quantify potential cost savings.
        Please answer the following questions:
      </p>

      <table>
        <tbody>
          <Logic
            current={current}
            property="q1"
            q="Are there typically soil erosion issues associated with this field that require time and expense to repair?"
            a={['Yes', 'No']}
          />

          {
            state.q1 === 'Yes' && (
              <>
                <Logic
                  current={current}
                  property="q2"
                  q="How will soil repair activities be conducted on this field?"
                  a={['Skid steer', 'Trackhoe', 'Dozer']}
                />
      
                <Logic
                  current={current}
                  property="q3"
                  q="Cost ($) per hour"
                  a="dollar"
                />

                <Logic
                  current={current}
                  property="q4"
                  q="On average, estimate the reduced annualized number of hours to repair tile outlets, fix erosion issues, repair terrace breakovers or other issues for this particular field."
                  a="number"
                />

                <tr style={{background: 'yellow'}}>
                  <td>
                    Calculation of cost savings
                    <Icon>
                      help
                      <p>If erosion repair occurs less than once/year, estimate the time it takes when done and divide by the number of years between repair activities</p>
                    </Icon>
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
          <>
            <button
              onClick={() => {
                dispatch(set.farm('My farm'));
                dispatch(set.field('My field'));
                dispatch(set.acres(150));
                dispatch(set.erosion.q1('Yes'));
                dispatch(set.erosion.q2('Trackhoe'));
                dispatch(set.erosion.q4(20));
              }}
            >
              Test data
            </button>
          </>
        )
      }
    </div>
  );
} // Erosion

Erosion.menu = <span><u>E</u>rosion Control</span>;

export default Erosion;