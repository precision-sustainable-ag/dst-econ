import Logic from './Logic';
import {Icon} from '@mui/material';

import {get, set, test, getDefaults, dollars} from '../store/store';
import {useSelector, useDispatch} from 'react-redux';

const Yield = () => {
  const dispatch = useDispatch();
  const current = 'yield';
  const state = useSelector(get[current]);
  const dev = useSelector(get.dev);
  const cashCrop = useSelector(get.cashCrop) || ' your cash crop';

  return (
    <div className="Yield">
      <h1>Economic Decision Aid for Cover Crops: Yield</h1>
      <p>
        When using cover crops in your rotation, yields of your cash crops may be affected.
        Results from farmer surveys indicate many farmers report a yield increase when using cover crops, although experiences have also resulted in decreased yields under certain conditions.
        Survey results also indicate experience matters.
        Growers that have utilized cover crops on their farms for more consecutive years report greater yield benefits.        
      </p>
      <p>
        The Sustainable Agriculture Research &amp; Education program (<a target="_blank" rel="noreferrer" href="https://www.sare.org">https://www.sare.org</a>) aggregated survey data of farmers responding to the SARE/CTIC National Cover Crop Survey in a June 2019 SARE Technical Bulletin titled, Cover Crop Economics.
        The SARE publication notes,        
      </p>
      <blockquote>
        "To better understand how the number of years spent planting a cover crop impacts crop yield, data was collected from farmers responding to the SARE/CTIC National Cover Crop Survey.
        Farmers who planted cover crops on some fields but not on others, and who otherwise managed those fields similarly, were asked to report on respective yields."
      </blockquote>
      <p>
        The authors note that yields were self-reported and yields varied from field to field, with a few fields having losses and with some fields showing no difference.
        However, the majority of growers responding reported yield benefits.
        The SARE/CTIC survey was conducted for several years with questions in 2015 and 2016 focused on the number of years of consecutive use of cover crops in fields and the impact on yield.
        The following table is regression analysis results of those surveys (approximately 500 farmers each year for two years)
      </p>
      <div style={{paddingLeft: '3rem'}}>
        <img alt="yield" src="yield.png" />
      </div>

      <table>
        <tbody>
          <Logic
            current={current}
            property="q1"
            q={
              <>
                What is the expected yield for {cashCrop} in this field?
                <Icon>
                  help
                  <p>User may enter a trend adjusted APH, APH, or typical yield for this field.</p>
                </Icon>
              </>
            }
            a="number"
          />

          <Logic
            current={current}
            property="q2"
            q="Do you want your financial analysis to use the typical yield estimates or the cover crop adjusted yield estimates?"
            a={['Use typical yield estimates', 'Use cover crop adjusted yield estimates']}
          />

          <Logic
            current={current}
            property="q3"
            q="Do you want your financial analysis to be based on anticipated yields in years 1, 3, or 5?"
            a={['1', '3', '5']}
          />

        </tbody>
      </table>
      {
        dev && (
          <>
            <button
              onClick={() => {
                dispatch(set.yield.q1('100'));
                dispatch(set.cashCrop('Soybeans'));
                dispatch(set.yield.q2('Use typical yield estimates'));
                dispatch(set.yield.q3('5'));
              }}
            >
              Test data
            </button>
          </>
        )
      }
    </div>
  )
} // Yield

Yield.menu = <span><u>Y</u>ield</span>;

export default Yield;