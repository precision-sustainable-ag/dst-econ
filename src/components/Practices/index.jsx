/* eslint-disable jsx-a11y/no-access-key */
import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import {
  Accordion, AccordionDetails, AccordionSummary, Typography, Box,
} from '@mui/material';
import { get } from '../../store/redux-autosetters';

import {
  dev,
  exampleErosion,
  examplePlanting,
  exampleSeedbed,
  exampleSeeds,
  exampleGrazing,
  exampleHerbicides,
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
  exampleYield1,
  exampleYield2,
  dollars,
} from '../../store/Store';

import './styles.scss';

const Tests = () => (
  <div className="test-buttons">
    <button type="button" onClick={exampleSeeds}>Test Seeds</button>
    <button type="button" onClick={exampleSeedbed}>Test Seedbed</button>
    <button type="button" onClick={examplePlanting}>Test Planting</button>
    <button type="button" onClick={exampleTermination1}>Test Termination 1</button>
    <button type="button" onClick={exampleTermination2}>Test Termination 2</button>
    <button type="button" onClick={exampleTermination3}>Test Termination 3</button>
    <button type="button" onClick={exampleTermination4}>Test Termination 4</button>
    <button type="button" onClick={exampleTermination5}>Test Termination 5</button>
    <button type="button" onClick={exampleTillage1}>Test Tillage 1</button>
    <button type="button" onClick={exampleTillage2}>Test Tillage 2</button>
    <button type="button" onClick={exampleTillage3}>Test Tillage 3</button>
    <button type="button" onClick={exampleTillage4}>Test Tillage 4</button>
    <button type="button" onClick={exampleTillage5}>Test Tillage 5</button>
    <button type="button" onClick={exampleFertilityBenefit}>Test FertilityBenefit</button>
    <button type="button" onClick={exampleFertilityCost}>Test FertilityCost</button>
    <button type="button" onClick={exampleHerbicides}>Test Herbicides</button>
    <button type="button" onClick={exampleErosion}>Test Erosion</button>
    <button type="button" onClick={exampleGrazing}>Test Grazing</button>
    <button type="button" onClick={exampleYield1}>Test Yield1</button>
    <button type="button" onClick={exampleYield2}>Test Yield2</button>
  </div>
);

const CustomExpandIcon = () => (
  <Box
    sx={{
      '.Mui-expanded & > .collapseIconWrapper': {
        display: 'none',
      },
      '.expandIconWrapper': {
        display: 'none',
      },
      '.Mui-expanded & > .expandIconWrapper': {
        display: 'block',
      },
      marginRight: '0.5rem',
    }}
  >
    <div className="expandIconWrapper">&ndash;</div>
    <div className="collapseIconWrapper">+</div>
  </Box>
);

const costs = (n) => (n >= 0 ? dollars(n) : '');
const benefits = (n) => (n < 0 ? dollars(-n) : '');

const Implement = ({ desc, type, benefit }) => {
  const selector = type.split('.').reduce((acc, k) => acc[k], get);
  const total = useSelector(selector.total);
  const implement = useSelector(selector.implement);
  const power = useSelector(selector.power);
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
  const {
    total, method, product, productCost, rate, unitCost,
    additionalTotal, additionalHerbicides, additionalRates, additionalPrices,
    reducedTotal, reducedHerbicides, reducedRates, reducedPrices,
  } = useSelector(get.termination);

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

      <Implement desc="Chemical spray equipment" type="termination.chemical" />
      <Implement desc="Roller equipment" type="termination.roller" />
      <Implement desc="Tillage equiment" type="termination.tillage" />

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
  const total = useSelector(get.tillage.total);

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

      <Implement desc="Fall Tillage" type="tillage.fall" benefit />
      <Implement desc="Tillage Elimination" type="tillage.elimination" benefit />
      <Implement desc="Other Tillage" type="tillage.other" />
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

const NestedAccordion = ({ details, level = 0 }) => (
  Object.entries(details).map(([title, content]) => {
    if (typeof content === 'object') {
      return (
        <Accordion
          key={title}
          defaultExpanded
          style={{ paddingLeft: level * 15, margin: 0 }}
        >
          <AccordionSummary
            expandIcon={<CustomExpandIcon />}
            style={{ flexDirection: 'row-reverse' }}
          >
            <Typography style={{ fontWeight: level === 0 ? 'bold' : 'normal' }}>
              {title}
            </Typography>
          </AccordionSummary>
          <NestedAccordion details={content} level={level + 1} />
        </Accordion>
      );
    }

    return (
      <AccordionDetails
        key={title}
        style={{
          paddingLeft: level * 40,
          paddingTop: 0,
          paddingBottom: 10,
        }}
      >
        {title}
        :
        {' '}
        <strong>{content}</strong>
      </AccordionDetails>
    );
  })
);

const equipment = (obj, type, nest = true) => {
  const {
    description,
    total,
    implement,
    power,
  } = type;

  if (total) {
    if (nest) {
      obj[description] = {
        Equipment: `${implement}; ${power}`,
      };
    } else {
      obj[description] = `${implement}; ${power}`;
    }
  }
};

const Practices = () => {
  const farm = useSelector(get.farm);
  const field = useSelector(get.field);
  const acres = useSelector(get.mapFeatures.area);
  const lat = useSelector(get.map.lat).toFixed(4);
  const lon = useSelector(get.map.lon).toFixed(4);
  const cashCrop = useSelector(get.cashCrop);
  const $labor = useSelector(get.$labor);
  const $diesel = useSelector(get.$diesel);

  const species = useSelector(get.species);
  const rates = useSelector(get.rates);
  const prices = useSelector(get.prices);

  const seedbed = useSelector(get.seedbed);
  const planting = useSelector(get.planting);
  const termination = useSelector(get.termination);
  const tillage = useSelector(get.tillage);

  const totals = [
    useSelector(get.coverCropTotal) || 0,
    useSelector(get.seedbed.total) || 0,
    useSelector(get.planting.total) || 0,
    useSelector(get.termination.total) || 0,
    useSelector(get.tillage.total) || 0,
    -useSelector(get.fertility.total) || 0,
    useSelector(get.herbicide.total) || 0,
    -useSelector(get.erosion.total) || 0,
    -useSelector(get.yield.total) || 0,
    -useSelector(get.additional.total) || 0,
  ];

  const totalCosts = totals.reduce((previous, value) => previous + Math.max(value, 0), 0);
  const totalBenefits = -totals.reduce((previous, value) => previous + Math.min(value, 0), 0);

  const details = {
    'Field & Farm': {
      'Cash crop': cashCrop,
      'Labor value': dollars($labor),
      'Diesel cost': dollars($diesel),
    },
  };

  if (species.length) {
    details['Seeds Planted'] = species.filter((s) => s).reduce((obj, s, i) => {
      obj[s] = `${rates[i]} pounds/acre @ ${dollars(prices[i])}/pound`;
      return obj;
    }, {});
  }

  equipment(details, seedbed);
  equipment(details, planting);

  if (termination.total) {
    const {
      method,
      product, rate, productCost,
      additionalTotal, additionalHerbicides, additionalRates, additionalPrices,
      reducedTotal, reducedHerbicides, reducedRates, reducedPrices,
    } = termination;

    const obj = {
      Method: method,
    };

    if (additionalTotal) {
      obj['Additional herbicides'] = additionalHerbicides.filter((s) => s).reduce((obj2, s, i) => {
        obj2[s] = `${additionalRates[i]} pounds/acre @ ${dollars(additionalPrices[i])}/acre`;
        return obj2;
      }, {});
    }

    if (reducedTotal) {
      obj['Reduced herbicides'] = reducedHerbicides.filter((s) => s).reduce((obj2, s, i) => {
        obj2[s] = `${reducedRates[i]} pounds/acre @ ${dollars(reducedPrices[i])}/acre`;
        return obj2;
      }, {});
    }

    if (product) {
      obj.Product = `${product} - ${rate} pounds @ ${dollars(productCost)}/acre`;
    }

    equipment(obj, termination.chemical, false);
    equipment(obj, termination.roller, false);
    equipment(obj, termination.tillage, false);

    details.Termination = obj;
  }

  if (tillage.total) {
    const obj = {};
    equipment(obj, tillage.fall, false);
    equipment(obj, tillage.elimination, false);
    equipment(obj, tillage.other, false);

    details['Tillage modifications to normal cropping system'] = obj;
  }

  return (
    <div id="Practices">
      <h1>
        Summary of Practices for
        <br />
        {farm && `${farm}`}
        {field && ` - ${field}`}
        {acres && ` (${acres} acres)`}
        <br />
        latitude:
        {` ${lat}, `}
        longitude:
        {` ${lon}`}
      </h1>

      <NestedAccordion details={details} />

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
      {dev && <Tests />}
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
