import Activity from './Activity';
import Logic from './Logic';

import {useSelector, useDispatch} from 'react-redux';
import {get, set, test, getDefaults, clearInputs} from '../store/store';

const Tillage = () => {
  const dispatch  = useDispatch();
  const current = 'tillage';

  const farm  = useSelector(get.farm);
  const field = useSelector(get.field);
  const acres = useSelector(get.acres);

  return (
    <div className="Tillage">
      <h1>Economic Decision Aid for Cover Crops: Tillage</h1>
      <p>
        As a reminder to the user, the <strong>Cover Crop Economic DST (Decision Support Tool)</strong> considers changes to your crop management system specific to the inclusion of cover crops into your rotation.
        Therefore, this module will consider any reduction or addition of tillage that may result from utilizing cover crops.
        For example, many growers have discovered that utilizing cover crops will reduce or eliminate the need for deep tillage in the fall.
        Other growers have switched from conventional tillage to no-til planting after making a switch to extensive use of cover crops.
        Review the <span className="link" onClick={() => dispatch(set.screen('Resources'))}>Resources page</span> for additional information.
      </p>

      <table>
        <tbody>
          {farm  && <tr><td>Farm:  </td><td>{farm} </td></tr>}
          {field && <tr><td>Field: </td><td>{field}</td></tr>}
          {acres && <tr><td>Acres: </td><td>{acres}</td></tr>}
        </tbody>
      </table>

      <form>
        <table className={current + ' inputs'}>
          <tbody>
            <tr>
              <th colSpan="2">Tillage</th>
            </tr>
            <Logic
              current={current}
              property="q1"
              q="Do you typically conduct fall tillage on this field?"
              a={['Yes', 'No']}
            />
          </tbody>
        </table>
      </form>
    </div>
  )
} // Tillage

export default Tillage;