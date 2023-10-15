import React from 'react';
import { useSelector } from 'react-redux';
import Logic from '../Logic';
import ClearInputs from '../ClearInputs';

import {
  dev, get, getDefaults, examplePlanting,
} from '../../store/Store';

const defaults = getDefaults(Object.keys(get.planting).map((parm) => `planting.${parm}`));

const Planting = () => {
  const estimated = useSelector(get.planting.estimated);

  const state = useSelector(get.planting);

  return (
    <>
      <h1>Planting Decisions</h1>
      <p>
        In order to accurately evaluate the economic impact of implementing cover crops into your rotation,
        we only want to consider management decisions directly associated with the use of cover crops.
        In this module we will consider any activity associated with planting cover crops, but only new activity.
        There are many potential options for planting cover crops; including aerial application.
        Input per acre costs associated with using an airplane by selecting &quot;hire custom operator&quot; on the drop-down menu.
        As another example, if utilizing a no-till drill to plant cover crops select the appropriate equipment on the drop-down menu
        and proceed to answer questions on tractor horsepower.
      </p>
      <p>
        Also, the costs associated with machinery are dependent upon the annual hours of use.
        In this module you can accept the default value (for hours of annual use)
        or customize with the estimated hours associated with your operation.
        This will more accurately represent costs in your operation.
      </p>
      <hr />

      <strong>Cover Crop Establishment</strong>
      <div className="mobile-table-div">
        <table className="planting inputs mobile-table power">
          <tbody>
            <tr>
              <th colSpan="3">
                Planting
                <ClearInputs defaults={defaults} />
              </th>
            </tr>

            <Logic
              current="planting"
              property="implement"
              q="How will planting be done?"
              type="Planting"
              custom={[
                'Incorporate planting with fertilizing. No CC planting cost.',
              ]}
            />

            <Logic current="planting" question="power" />
            <Logic current="planting" question="Annual Use (acres on implement)" />
            <Logic current="planting" question="Annual Use (hours on power)" />
            <Logic current="planting" question="Acres/hour" />
            <Logic
              current="planting"
              question="Estimated"
              total={state.total}
              estimated={estimated}
            />
          </tbody>
        </table>
      </div>

      {dev && (
        <div className="test-buttons">
          <button type="button" onClick={examplePlanting}>
            Test data
          </button>
        </div>
      )}
    </>
  );
}; // Planting

Planting.menu = (
  <span>
    P
    <u>l</u>
    anting Decisions
  </span>
);

export default Planting;
