import Logic from './Logic';
import {Icon} from '@mui/material';

import {get, set, test, getDefaults, dollars} from '../store/store';
import {useSelector, useDispatch} from 'react-redux';

const Yield = () => {
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

    </div>
  )
} // Yield

Yield.menu = <span><u>Y</u>ield</span>;

export default Yield;