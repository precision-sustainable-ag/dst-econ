/* eslint-disable jsx-a11y/no-access-key */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { get, set } from '../../store/redux-autosetters';
import {
  dev,
  exampleSeeds,
  exampleHerbicides,
  exampleSeedbed,
  examplePlanting,
  exampleTermination1,
  exampleTermination2,
  exampleTermination3,
  exampleTermination4,
  exampleTermination5,
  exampleTillage1,
  exampleTillage2,
  exampleTillage3,
  exampleTillage4,
  exampleTillage5,
  exampleFertilityBenefit,
  exampleFertilityCost,
  exampleErosion,
  exampleYield1,
  exampleYield2,
  dollars,
} from '../../store/Store';

import './styles.scss';

const costs = (n) => (n >= 0 ? dollars(n) : '');
const benefits = (n) => (n < 0 ? dollars(-n) : '');

const Implement = ({ desc, type, benefit }) => {
  const total = useSelector(get[type].total);
  const implement = useSelector(get[type].implement);
  const power = useSelector(get[type].power);
  return (
    total > 0 && (
      <tr>
        <td />
        <td>{desc}</td>
        <td>
          {implement}
          <br />
          {power}
        </td>
        <td>{benefit ? '' : dollars(total)}</td>
        <td />
        <td>{benefit ? dollars(total) : ''}</td>
        <td />
      </tr>
    )
  );
}; // Implement

const CropSummary = () => {
  const species = useSelector(get.species);
  const coverCropTotal = useSelector(get.coverCropTotal);
  const rates = useSelector(get.rates);
  const prices = useSelector(get.prices);

  return (
    <>
      <tr>
        <td colSpan={2}>
          <NavLink to="/Seeds">Cover crops planted</NavLink>
        </td>
        <td className="hidden" />
        <td />
        <td />
        <td>{costs(coverCropTotal)}</td>
        <td />
        <td>{benefits(coverCropTotal)}</td>
      </tr>
      {species.map((crop, i) => (
        <tr key={crop}>
          <td />
          <td>{crop}</td>
          <td>
            {rates[i]}
            {' '}
            pounds @
            {dollars(prices[i])}
            /acre
          </td>
          <td>{costs(rates[i] * prices[i])}</td>
          <td />
          <td>{benefits(rates[i] * prices[i])}</td>
          <td />
        </tr>
      ))}
    </>
  );
}; // CropSummary

const SeedbedSummary = () => {
  const total = useSelector(get.seedbed.total) || 0;
  const implement = useSelector(get.seedbed.implement);
  const power = useSelector(get.seedbed.power);

  return (
    <tr>
      <td colSpan={2}>
        <NavLink to="/Seedbed">Cover crop seedbed preparation</NavLink>
      </td>
      <td />
      <td>
        {implement || 'none'}
        <br />
        {power}
      </td>
      <td />
      <td>{costs(total)}</td>
      <td />
      <td>{benefits(total)}</td>
    </tr>
  );
}; // SeedbedSummary

const PlantingSummary = () => {
  const total = useSelector(get.planting.total) || 0;
  const implement = useSelector(get.planting.implement);
  const power = useSelector(get.planting.power);

  return (
    <tr>
      <td colSpan={2}>
        <NavLink to="/Planting">Cover crop planting activity</NavLink>
      </td>
      <td className="hidden" />
      <td>
        {implement}
        <br />
        {power}
      </td>
      <td />
      <td>{costs(total)}</td>
      <td />
      <td>{benefits(total)}</td>
    </tr>
  );
}; // PlantingSummary

const TerminationSummary = () => {
  const total = useSelector(get.termination.total);
  const method = useSelector(get.termination.method);
  const product = useSelector(get.termination.product);
  const productCost = useSelector(get.termination.productCost);
  const rate = useSelector(get.termination.rate);
  const unitCost = useSelector(get.termination.unitCost);

  const additionalTotal = useSelector(get.termination.additionalTotal);
  const additionalHerbicides = useSelector(get.termination.additionalHerbicides);
  const additionalRates = useSelector(get.termination.additionalRates);
  const additionalPrices = useSelector(get.termination.additionalPrices);

  const reducedTotal = useSelector(get.termination.reducedTotal);
  const reducedHerbicides = useSelector(get.termination.reducedHerbicides);
  const reducedRates = useSelector(get.termination.reducedRates);
  const reducedPrices = useSelector(get.termination.reducedPrices);

  return (
    <>
      <tr>
        <td colSpan={2}>
          <NavLink to="/Termination">Cover crop termination activity</NavLink>
        </td>
        <td className="hidden" />
        <td>{method}</td>
        <td />
        <td>{costs(total)}</td>
        <td />
        <td>{benefits(total)}</td>
      </tr>
      {productCost > 0 && (
        <tr>
          <td />
          <td>
            Product:
            {' '}
            {product}
          </td>
          <td>
            {rate}
            {' '}
            pounds/acre @
            {dollars(unitCost)}
          </td>
          <td>{dollars(productCost)}</td>
          <td />
          <td />
          <td />
        </tr>
      )}

      <Implement desc="Chemical spray equipment" type="chemical" />
      <Implement desc="Roller equipment" type="roller" />
      <Implement desc="Tillage equiment" type="tillage" />

      {additionalTotal ? (
        <>
          <tr>
            <td />
            <td>Additional herbicides</td>
            <td />
            <td>{costs(additionalTotal)}</td>
            <td />
            <td>{benefits(additionalTotal)}</td>
            <td />
          </tr>
          {additionalHerbicides.map((herb, i) => (
            <tr key={herb}>
              <td />
              <td>
                &nbsp;&nbsp;&nbsp;&nbsp;Product:
                {' '}
                {herb}
              </td>
              <td>
                {additionalRates[i]}
                {' '}
                pounds @
                {dollars(additionalPrices[i])}
                /acre
              </td>
              <td>{dollars(additionalRates[i] * additionalPrices[i])}</td>
              <td />
              <td />
              <td />
            </tr>
          ))}
        </>
      ) : null}
      {reducedTotal ? (
        <>
          <tr>
            <td />
            <td>Reduced herbicides</td>
            <td />
            <td />
            <td />
            <td>{dollars(reducedTotal)}</td>
            <td />
          </tr>
          {reducedHerbicides.map((herb, i) => (
            <tr key={herb}>
              <td />
              <td>
                &nbsp;&nbsp;&nbsp;&nbsp;Product:
                {' '}
                {herb}
              </td>
              <td>
                {reducedRates[i]}
                {' '}
                pounds @
                {dollars(reducedPrices[i])}
                /acre
              </td>
              <td />
              <td />
              <td>{dollars(reducedRates[i] * reducedPrices[i])}</td>
              <td />
            </tr>
          ))}
        </>
      ) : null}
    </>
  );
}; // TerminationSummary

const TillageSummary = () => {
  const total = useSelector(get.tillageAll.total);

  return (
    <>
      <tr>
        <td colSpan={2}>
          <NavLink to="/Tillage">
            Tillage modifications
            <br />
            to normal cropping system
          </NavLink>
        </td>
        <td />
        <td />
        <td />
        <td>{costs(total)}</td>
        <td />
        <td>{benefits(total)}</td>
      </tr>

      <Implement desc="Fall Tillage" type="tillageFall" benefit />
      <Implement desc="Tillage Elimination" type="tillageElimination" benefit />
      <Implement desc="Other Tillage" type="tillageOther" />
    </>
  );
}; // TillageSummary

const FertilitySummary = () => {
  const total = useSelector(get.fertility.total);
  const fertN = useSelector(get.fertN);
  const fertP = useSelector(get.fertP);
  const fertK = useSelector(get.fertK);
  const fertNAdded = useSelector(get.fertNAdded);
  const fertPAdded = useSelector(get.fertPAdded);
  const fertKAdded = useSelector(get.fertKAdded);
  const $fertCredit = useSelector(get.$fertCredit);
  const $fertCost = useSelector(get.$fertCost);
  const $fertApplication = useSelector(get.$fertApplication);

  return (
    <>
      <tr>
        <td colSpan={2}>
          <NavLink to="/Fertility">Fertility</NavLink>
        </td>
        <td className="hidden" />
        <td />
        <td />
        <td>{costs(-total)}</td>
        <td />
        <td>{benefits(-total)}</td>
      </tr>
      <tr>
        <td />
        <td>Fertilizer credit</td>
        <td>
          {fertN > 0 && (
            <>
              {fertN}
              {' '}
              pound N/acre
              <br />
            </>
          )}
          {fertP > 0 && (
            <>
              {fertP}
              {' '}
              pound P
              <sub>2</sub>
              O
              <sub>5</sub>
              /acre
              <br />
            </>
          )}
          {fertK > 0 && (
            <>
              {fertK}
              {' '}
              pound K
              <sub>2</sub>
              O/acre
            </>
          )}
        </td>
        <td />
        <td />
        <td>{dollars($fertCredit)}</td>
        <td />
      </tr>
      <tr>
        <td />
        <td>Additional fertilizer expense</td>
        <td>
          {fertNAdded > 0 && (
            <>
              {fertNAdded}
              {' '}
              pound N/acre
              <br />
            </>
          )}
          {fertPAdded > 0 && (
            <>
              {fertPAdded}
              {' '}
              pound P
              <sub>2</sub>
              O
              <sub>5</sub>
              /acre
              <br />
            </>
          )}
          {fertKAdded > 0 && (
            <>
              {fertKAdded}
              {' '}
              pound K
              <sub>2</sub>
              O/acre
            </>
          )}
        </td>
        <td>{dollars(-$fertCost - $fertApplication)}</td>
        <td />
        <td />
        <td />
      </tr>
      <tr>
        <td />
        <td>Additional fertilizer application cost</td>
        <td />
        <td>{dollars($fertApplication)}</td>
        <td />
        <td />
        <td />
      </tr>
    </>
  );
}; // FertilitySummary

const HerbicideSummary = () => {
  const total = useSelector(get.herbicide.total);

  const additionalProduct = useSelector(get.herbicideAdditional.product);
  const additionalRate = useSelector(get.herbicideAdditional.rate);
  const additionalUnitCost = useSelector(get.herbicideAdditional.unitCost);
  const additionalProductCost = useSelector(get.herbicideAdditional.cost);

  const reducedProduct = useSelector(get.herbicideReduced.product);
  const reducedRate = useSelector(get.herbicideReduced.rate);
  const reducedUnitCost = useSelector(get.herbicideReduced.unitCost);
  const reducedProductCost = useSelector(get.herbicideReduced.cost);

  const fallSavings = useSelector(get.herbicideFall.savings);

  return (
    <>
      <tr>
        <td colSpan={2}>
          <NavLink to="/Herbicide">
            Herbicide modifications
            <br />
            to normal cropping system
          </NavLink>
        </td>
        <td />
        <td />
        <td />
        <td>{costs(total)}</td>
        <td />
        <td>{benefits(total)}</td>
      </tr>

      <Implement desc="Additional herbicides" type="herbicideAdditional" />
      {additionalProductCost > 0 && (
        <tr>
          <td />
          <td>
            &nbsp;&nbsp;&nbsp;&nbsp;Product:
            {' '}
            {additionalProduct}
          </td>
          <td>
            {additionalRate}
            {' '}
            pounds/acre @
            {dollars(additionalUnitCost)}
          </td>
          <td>{dollars(additionalProductCost)}</td>
          <td />
          <td />
          <td />
        </tr>
      )}

      <Implement desc="Fall herbicides" type="herbicideFall" />
      {fallSavings > 0 && (
        <tr>
          <td />
          <td>&nbsp;&nbsp;&nbsp;&nbsp;Savings</td>
          <td />
          <td />
          <td />
          <td>{dollars(fallSavings)}</td>
          <td />
        </tr>
      )}

      <Implement desc="Reduced herbicides" type="herbicideReduced" benefit />
      {reducedProductCost > 0 && (
        <tr>
          <td />
          <td>
            &nbsp;&nbsp;&nbsp;&nbsp;Product:
            {' '}
            {reducedProduct}
          </td>
          <td>
            {reducedRate}
            {' '}
            pounds/acre @
            {dollars(reducedUnitCost)}
          </td>
          <td />
          <td />
          <td>{dollars(reducedProductCost)}</td>
          <td />
        </tr>
      )}
    </>
  );
}; // HerbicideSummary

const ErosionSummary = () => {
  const total = useSelector(get.erosion.total);
  const tool = useSelector(get.erosion.q2);

  return (
    <>
      <tr>
        <td colSpan={2}>
          <NavLink to="/Erosion">Erosion control</NavLink>
        </td>
        <td />
        <td />
        <td />
        <td />
        <td />
        <td>{dollars(total)}</td>
      </tr>

      {total > 0 && (
        <tr>
          <td />
          <td>
            Reduced hours of repairing fields with
            {tool.toLowerCase()}
          </td>
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
      )}
    </>
  );
}; // ErosionSummary

const YieldSummary = () => {
  const total = useSelector(get.yield.total);
  const year = {
    1: 'first',
    3: 'third',
    5: 'fifth',
  }[useSelector(get.yield.q4)];

  return (
    <>
      <tr>
        <td colSpan={2}>
          <NavLink to="/Yield">Yield impact</NavLink>
        </td>
        <td />
        <td />
        <td />
        <td />
        <td />
        <td>{dollars(total)}</td>
      </tr>
      <tr>
        <td />
        <td>
          Improved yield estimate in
          {year}
          year of cover crops
        </td>
        <td />
        <td />
        <td />
        <td />
        <td />
      </tr>
    </>
  );
}; // YieldSummary

const AdditionalSummary = () => {
  const sel = useSelector(get.additional);

  return (
    <>
      <tr>
        <td colSpan={2}>
          <NavLink to="/Additional">Additional considerations</NavLink>
        </td>
        <td />
        <td />
        <td />
        <td />
        <td />
        <td>{dollars(sel.total)}</td>
      </tr>
      <tr>
        <td />
        <td>Estimated cash contribution from rent</td>
        <td />
        <td />
        <td />
        <td>{dollars(sel.$landowner)}</td>
        <td />
      </tr>
      <tr>
        <td />
        <td>State or federal financial assistance</td>
        <td />
        <td />
        <td />
        <td>{dollars(sel.$costShare)}</td>
        <td />
      </tr>
      <tr>
        <td />
        <td>Voluntary carbon offset program</td>
        <td />
        <td />
        <td />
        <td>{dollars(sel.$carbonOffset)}</td>
        <td />
      </tr>
      <tr>
        <td />
        <td>Insurance discount</td>
        <td />
        <td />
        <td />
        <td>{dollars(sel.$insuranceDiscount)}</td>
        <td />
      </tr>
    </>
  );
}; // AdditionalSummary

const Practices = () => {
  const dispatch = useDispatch();
  const farm = useSelector(get.farm);
  const field = useSelector(get.field);
  const acres = useSelector(get.mapFeatures.area);
  const lat = useSelector(get.map.lat).toFixed(4);
  const lon = useSelector(get.map.lon).toFixed(4);

  const totals = [
    useSelector(get.coverCropTotal) || 0,
    useSelector(get.seedbed.total) || 0,
    useSelector(get.planting.total) || 0,
    useSelector(get.termination.total) || 0,
    useSelector(get.tillageAll.total) || 0,
    -useSelector(get.fertility.total) || 0,
    useSelector(get.herbicide.total) || 0,
    -useSelector(get.erosion.total) || 0,
    -useSelector(get.yield.total) || 0,
    -useSelector(get.additional.total) || 0,
  ];

  const totalCosts = totals.reduce((previous, value) => previous + Math.max(value, 0), 0);
  const totalBenefits = -totals.reduce((previous, value) => previous + Math.min(value, 0), 0);

  return (
    <div id="Practices">
      <h1>
        Summary of Practices
        {farm && ` for ${farm}`}
        {field && ` - ${field}`}
        {acres && ` (${acres} acres)`}
        <br />
        latitude:
        {` ${lat}, `}
        longitude:
        {` ${lon}`}
      </h1>
      <div>
        <table>
          <thead>
            <tr>
              <th colSpan={2}>&nbsp;</th>
              <th className="hidden">&nbsp;</th>
              <th>Description</th>
              <th>Costs by line item</th>
              <th>Total cost</th>
              <th>Benefit by line item</th>
              <th>Total Benefit</th>
            </tr>
          </thead>
          <tbody>
            <CropSummary />
            <SeedbedSummary />
            <PlantingSummary />
            <TerminationSummary />
            <TillageSummary />
            <FertilitySummary />
            <HerbicideSummary />
            <ErosionSummary />
            <YieldSummary />
            <AdditionalSummary />
            <tr className="total">
              <td colSpan={2}>Total</td>
              <td />
              <td />
              <td />
              <td>{dollars(totalCosts)}</td>
              <td />
              <td>{dollars(totalBenefits)}</td>
            </tr>
            <tr className="total">
              <td colSpan={2}>Net cost of cover crops</td>
              <td />
              <td style={{ textAlign: 'right' }}>{dollars(totalBenefits - totalCosts)}</td>
              <td />
              <td />
              <td />
              <td />
            </tr>
          </tbody>
        </table>
      </div>
      {dev && (
        <div className="test-buttons" style={{ marginTop: '10px' }}>
          <button
            type="button"
            accessKey="1"
            onClick={() => {
              dispatch(set.farm('My farm'));
              dispatch(set.field('NW40 of home place'));
              dispatch(set.cashCrop('Soybeans'));

              exampleSeeds();
              exampleSeedbed();
              examplePlanting();
              exampleTermination1();
              exampleTillage1();
              exampleHerbicides();
              exampleFertilityBenefit();
              exampleErosion();
              exampleYield1();
            }}
          >
            Test
            <u>1</u>
          </button>
          <button
            type="button"
            accessKey="2"
            onClick={() => {
              dispatch(set.farm('My farm'));
              dispatch(set.field('NW40 of home place'));
              dispatch(set.cashCrop('Soybeans'));

              exampleSeeds();
              exampleSeedbed();
              examplePlanting();
              exampleTermination2();
              exampleTillage2();
              exampleHerbicides();
              exampleFertilityCost();
              exampleErosion();
              exampleYield2();
            }}
          >
            Test
            <u>2</u>
          </button>
          <button
            type="button"
            accessKey="3"
            onClick={() => {
              dispatch(set.farm('My farm'));
              dispatch(set.field('NW40 of home place'));
              dispatch(set.cashCrop('Soybeans'));

              exampleSeeds();
              exampleSeedbed();
              examplePlanting();
              exampleTermination3();
              exampleTillage3();
              exampleHerbicides();
              exampleFertilityBenefit();
              exampleErosion();
              exampleYield1();
            }}
          >
            Test
            <u>3</u>
          </button>
          <button
            type="button"
            accessKey="4"
            onClick={() => {
              dispatch(set.farm('My farm'));
              dispatch(set.field('NW40 of home place'));
              dispatch(set.cashCrop('Soybeans'));

              exampleSeeds();
              exampleSeedbed();
              examplePlanting();
              exampleTermination4();
              exampleTillage4();
              exampleHerbicides();
              exampleFertilityCost();
              exampleErosion();
              exampleYield2();
            }}
          >
            Test
            <u>4</u>
          </button>
          <button
            type="button"
            accessKey="5"
            onClick={() => {
              dispatch(set.farm('My farm'));
              dispatch(set.field('NW40 of home place'));
              dispatch(set.cashCrop('Soybeans'));

              exampleSeeds();
              exampleSeedbed();
              examplePlanting();
              exampleTermination5();
              exampleTillage5();
              exampleHerbicides();
              exampleFertilityBenefit();
              exampleErosion();
              exampleYield1();
            }}
          >
            Test
            <u>5</u>
          </button>
        </div>
      )}
    </div>
  );
}; // Practices

Practices.menu = (
  <span>
    S
    <u>u</u>
    mmary
  </span>
);

export default Practices;
