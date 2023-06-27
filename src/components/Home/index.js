import React from 'react';
import { useDispatch } from 'react-redux';
import { dev, set } from '../../store/Store';

import './styles.scss';

const Home = () => {
  const dispatch = useDispatch();
  return (
    <div id="Home">
      <p>
        The
        {' '}
        <strong>Cover Crop Economic DST</strong>
        {' '}
        (Decision Support Tool) helps growers understand the impact of cover crops on profitability when making crop management changes.
      </p>
      <h4>Background</h4>

      <p>
        The Cover Crop Economic DST helps users better understand the impact of incorporating cover crop species or mixtures into their farm.
        Both the decision of what cover crop species to use and the resulting economic impact are very specific to individual operations.
        The DST will help you understand individualized conditions and management decisions.
      </p>

      <p>
        Incorporating cover crops into your rotation will result in increased input costs (e.g. seed costs ).
        Reduced annual input costs are also possible (e.g. herbicides or N credits).
        The DST will guide you through a series of questions which enable you to quantify potential changes
        in costs and potential savings and benefits.
      </p>

      <p>
        Use of cover crops can also result in long-term benefits.
        Reduced soil erosion, improved soil aggregate structure, increased water infiltration, and increased soil organic matter
        are some of many impacts to our soil health that accrue with long-term use of cover crops.
        These benefits, over time, can result in increased soil resiliency and potential yield improvements.
        The DST also enables users to consider the some of the market valued impacts of these longer-term benefits.
      </p>

      <p>
        This version of the DST allows users to consider changes in one field.
        Future revisions will enable management changes for multiple fields on your farm.
        Check back with us for future revisions and increased user functions.
      </p>

      <h4>Input Data Requirements</h4>
      <p>
        The Cover Crop Economic DST has been designed to provide credible estimates of the impact of cover crops
        with a limited amount of data retrieval by growers.
        Begin by inputting ALL of the required information into the Field & Farm module
        and then proceed to each of the following input modules (each of the input modules are buttons with white lettering).
      </p>

      <ul>
        <li>Cover Crop selection</li>
        <li>Planting decisions</li>
        <li>Termination</li>
        <li>Tillage</li>
        <li>Fertility</li>
        <li>Herbicide</li>
        <li>Pests</li>
        <li>Soil erosion control</li>
        <li>Additional considerations</li>
        <li>Yield</li>
      </ul>

      <p>
        Users can view real-time financial impacts by viewing the budget table on the right-hand side of your screen.
        The DST is designed for individualized conditions.
        For example, users can select equipment similar to their operation and also have the option of determining what equipment costs
        they wish to include in the analysis.
        Click on a green question mark (?) for additional information on the input fields.
        After completing the input modules, view the summary of financial impacts.
        At any point, users can go back to specific input modules to modify their responses.
      </p>

      {dev && (
        <div className="test-buttons">
          <button
            type="button"
            onClick={() => {
              dispatch(set.location('123 Main Street, Athens, GA, USA'));
              dispatch(set.farm('My farm'));
              dispatch(set.field('My field'));
              dispatch(set.mapFeatures.area(123));
              dispatch(set.field('My field'));
              dispatch(set.cashCrop('Corn'));
              dispatch(set.map.lat(33.9347));
              dispatch(set.map.lon(-83.3157));
              dispatch(set.mapFeatures.zoom(13));
            }}
          >
            Test data
          </button>
        </div>
      )}
    </div>
  );
}; // Home

Home.menu = (
  <span>
    <u>H</u>
    ome
  </span>
);

export default Home;
