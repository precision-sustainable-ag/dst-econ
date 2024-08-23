import React from 'react';
import { useSelector } from 'react-redux';
import {
  dev, get, dollars, db, getDefaults, exampleSeeds, mobile,
} from '../../store/Store';
import Input from '../../shared/Inputs';
import ClearInputs from '../ClearInputs';

import './styles.scss';

const defaults = getDefaults('rates|species|prices');

const SpeciesRow = ({ n }) => {
  const species = useSelector(get.species);
  const rates = useSelector(get.rates);
  const prices = useSelector(get.prices);

  const speciesList = {
    Other: ['Commercial mix'],
  };

  const types = [...new Set(Object.values(db.seedList).map((item) => item.type))].sort((a, b) => a.localeCompare(b));
  types.forEach((type) => {
    speciesList[type] = Object.values(db.seedList)
      .filter((item) => item.type === type)
      .map((item) => item.key);
  });

  const options = [
    ...speciesList.Other,
    ...speciesList.Grass,
    ...speciesList.Legume,
    ...speciesList.Brassica,
    ...speciesList.Broadleaf,
  ].filter((s) => s === species[n] || !species.includes(s));

  const groupByOption = (option) => {
    if (speciesList.Other.includes(option)) {
      return '-';
    }
    if (speciesList.Brassica.includes(option)) {
      return 'Brassica';
    }
    if (speciesList.Broadleaf.includes(option)) {
      return 'Broadleaf';
    }
    if (speciesList.Grass.includes(option)) {
      return 'Grass';
    }
    if (speciesList.Legume.includes(option)) {
      return 'Legume';
    }
    return 'ERROR';
  }; // groupByOption

  return (
    <tr>
      <td>
        <Input
          id="species"
          index={n}
          autoFocus={!mobile && n === 0}
          groupBy={groupByOption}
          options={options}
        />
      </td>
      <td>
        <Input type="number" id="rates" index={n} />
      </td>
      <td>
        <Input type="dollar" id="prices" index={n} />
      </td>
      <td>
        {dollars(rates[n] * prices[n])}
      </td>
    </tr>
  );
}; // SpeciesRow

const Seeds = () => {
  const species = useSelector(get.species);
  const address = useSelector(get.map.address);
  const total = useSelector(get.coverCropTotal);
  const state = address.state || '';

  const rec = db.stateRegions[state.toUpperCase()];

  let region = rec ? db.stateRegions[state.toUpperCase()].ccRegion.toLowerCase() : '';
  if (region) {
    region = region[0].toUpperCase() + region.slice(1);
  }

  const link = {
    Midwest: 'https://mccc.msu.edu/selector-tool/',
    Northeast: 'http://northeastcovercrops.com/decision-tool/',
    Southern: 'https://southerncovercrops.org/cover-crop-resource-guide/',
    Western: 'https://westerncovercrops.org/category/resources/selection/',
  }[region];

  return (
    <div id="Seeds">
      <h1>Cover Crops Species Selection</h1>

      <p>
        In the User box below, select your cover crop species.
        Default seeding rates and prices will appear.
        You are encouraged to adjust these to fit your farming plan.
      </p>

      <div className="mobile-table-div">
        <table className="mobile-table">
          <thead>
            <tr>
              <th colSpan="4">
                User Input
                <ClearInputs defaults={defaults} />
              </th>
              <td className="hidden" />
              <td className="hidden" />
            </tr>
            <tr>
              <th>Cover Crop Species</th>
              <th>
                Seeding Rate
                <br />
                (lb/ac)
              </th>
              <th>
                Price
                <br />
                ($/lb)
              </th>
              <th>
                Total
                <br />
                ($)
              </th>
            </tr>
          </thead>
          <tbody>
            {species.map((s, n) => s && <SpeciesRow key={n} n={n} />)}
            <SpeciesRow key={species.length} n={species.length} />
            <tr>
              <td colSpan="3">
                <strong>Cost of Cover crop seed ($/acre)</strong>
              </td>
              <td className="hidden" />
              <td>
                <strong>{dollars(total)}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        A common strategy for selecting a cover crop is to base your decision upon a specific goal you have for a field or farm.
        For example, if you wish to build soil organic matter you may want to select a cover crop
        with high levels of biomass and a fibrous root structure.
        Options exist to mitigate soil erosion, create grazing opportunities, and to decrease weed pressure.
        If you already know which cover crop you wish to consider, please select from the drop-down menu.
        If you are new to the use of cover crops or still have questions, please consider using the
        {' '}
        <a href={link} target="_blank" rel="noreferrer">
          {region}
          {' '}
          Cover Crops Council Species Selector
        </a>
        .
      </p>

      <p>
        After selecting a cover crop species, please select a seeding rate.
        Seeding rate selection will depend upon whether you are using a single species or a mix.
        In addition, you may adjust seeding rates even for single species based upon your intended purpose.
        For example, you may use a lower seeding rate of cereal rye if you only seek help with erosion control,
        but may plant a higher rate if you seek to maximize grazing potential.
        You may use the common rate listed in the green shaded boxes or input your own rate.
      </p>

      {/* <p>
        If you wish to learn more about possible seeding rates, consider using the
        {' '}
        <strong>
          <a target="_blank" rel="noreferrer" href="https://covercrop-seedcalc.org/">Cover Crop Seeding Rate Calculator</a>
        </strong>
        .
      </p> */}

      <p>
        Prices for cover crops may vary widely based upon your geography and availability from season to season.
        You may utilize the default value or enter specific pricing from your region.
        Growers planning to plant a cover crop
        {' '}
        <em>mix</em>
        {' '}
        can either
        &apos;build&apos; their mix by selecting multiple cover crop species and an
        {' '}
        <em>
          <strong>appropriate</strong>
        </em>
        {' '}
        seeding rate (i.e. seeding rate may be lower in a mix relative to seeding as a stand-alone)
        or by selecting commercial mix and entering a seed rate and price for the commercial mix you chose.
      </p>

      {dev && (
        <div className="test-buttons">
          <button type="button" onClick={exampleSeeds}>
            Test data
          </button>
        </div>
      )}
    </div>
  );
}; // Seeds

Seeds.menu = (
  <span>
    S
    <u>e</u>
    eds
  </span>
);

export default Seeds;
