/* eslint-disable jsx-a11y/no-access-key */
import React from 'react';
import { useSelector } from 'react-redux';
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
  exampleAdditional,
  exampleYield1,
  exampleYield2,
  dollars,
} from '../../store/Store';

import './styles.scss';
import Print from '../../shared/Print';

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
    <button type="button" onClick={exampleAdditional}>Test Additional</button>
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

const isJSX = (obj) => obj && obj?.$$typeof?.toString() === 'Symbol(react.element)';

const getClass = (data) => {
  if (+data || /^\$/.test(data)) {
    return 'right';
  }
  return '';
};

const NestedAccordion = ({ details, level = 0 }) => {
  if (level > 0 && Object.keys(details).length >= 1) {
    return (
      <table>
        <thead>
          {
            Object.entries(details).filter(([title]) => title === 'th').map(([title, content]) => (
              <tr key={title}>
                <th />
                {
                  [...content].map((data) => <th key="data">{data}</th>)
                }
              </tr>
            ))
          }
        </thead>
        <tbody>
          {
            Object.entries(details)
              .filter(([title, content]) => title !== 'th' && content !== '$0.00')
              .map(([title, content]) => {
                if (Array.isArray(content)) {
                  content = content.map((data) => <td key="data" className={getClass(data)}>{data}</td>);
                } else if (typeof content === 'object') {
                  content = (
                    <td className={getClass(content)}>
                      {
                        Object.keys(content).map((key) => (
                          <div key={key}>
                            {key}
                            :&nbsp;
                            {content[key]}
                          </div>
                        ))
                      }
                    </td>
                  );
                } else {
                  content = <td className={getClass(content)}>{content}</td>;
                }

                return (
                  <tr key={title}>
                    <td>{title}</td>
                    {content}
                  </tr>
                );
              })
          }
        </tbody>
      </table>
    );
  }

  return Object.entries(details).map(([title, content]) => {
    // if (content === 'Fertility') {
    //   return <NavLink key={title} to="/Fertility">Fertility</NavLink>;
    // }

    if (isJSX(content)) {
      return content;
    }

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
  });
};

const equipment = (obj, type, nest = true) => {
  const {
    description,
    total,
    implement,
    power,
  } = type;

  let updatedImplement = implement;

  if (description === 'Planting Decisions' || description === 'Chemical spray equipment') {
    [updatedImplement] = updatedImplement.split('|');
  }

  if (total) {
    if (nest) {
      obj[description] = {
        Equipment: `${updatedImplement}${power ? `; ${power}` : ''}`,
      };
    } else {
      obj[description] = `${updatedImplement}${power ? `; ${power}` : ''}`;
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
  const fertility = useSelector(get.fertility);
  const herbicide = useSelector(get.herbicide);
  const erosion = useSelector(get.erosion);
  const grazing = useSelector(get.grazing);
  const additional = useSelector(get.additional);
  const Yield = useSelector(get.yield);

  const details = {
    'Field & Farm': {
      'Cash crop following cover crop': cashCrop,
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
      product, productCost,
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
      obj.Product = `${product} @ ${dollars(productCost)}/acre`;
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

  if (fertility.total) {
    details.Fertility = {
      // eslint-disable-next-line react/jsx-one-expression-per-line
      th: ['N', <>P<sub>2</sub>O<sub>5</sub></>, <>K<sub>2</sub>O</>],
      'Fertilizer value ($/pound of nutrient)': [dollars(fertility.$N), dollars(fertility.$P), dollars(fertility.$K)],
      'Expected fertilizer credit from your cover crop species (pounds/acre).': [fertility.N, fertility.P, fertility.K],
      'Fertilizer added for cover crop production (pounds/acre)': [
        fertility.NAdded,
        fertility.PAdded,
        fertility.KAdded,
      ],
      'Cost of fertilizer application ($/acre)': dollars(fertility.$application),
    };
  }

  if (herbicide.total) {
    const obj = {};
    equipment(obj, herbicide.additional, false);
    if (herbicide.additional.product) {
      obj.Product = `${herbicide.additional.product} @ ${dollars(herbicide.additional.cost)} / acre`;
    }
    equipment(obj, herbicide.reduced, false);
    equipment(obj, herbicide.fall, false);
    details['Herbicide modifications to normal cropping system'] = obj;
  }

  if (erosion.total) {
    details['Soil Erosion Control'] = {
      'Cost per hour': dollars(erosion.q3),
      [`Reduced hours of repairing fields with ${erosion.q2.toLowerCase()}`]: erosion.q4,
    };
  }

  if (grazing.total) {
    const mapping = {
      0: 'None',
      500: 'Low',
      1000: 'Medium',
      1500: 'High',
    };

    if (grazing.$lease) {
      details.Grazing = {
        'Value (per acre) you will receive for leasing': dollars(grazing.$lease),
      };
    } else {
      details.Grazing = {
        'Amount of forage for fall grazing': mapping[grazing.fall],
        'Amount of forage for spring grazing': mapping[grazing.spring],
        'Hay value ($/ton)': dollars(grazing.$hay),
        'Additional time required for management (hours/acre)': grazing.hoursAcre,
      };
    }
  }

  if (additional.total) {
    details['Additional considerations'] = {
      'Estimated cash contribution from rent ($/acre)': dollars(additional.$landowner),
      'State or federal financial assistance ($/acre)': dollars(additional.$costShare),
      'Voluntary carbon offset program': dollars(additional.$carbonOffset),
      'Insurance discount': dollars(additional.$insuranceDiscount),
    };
  }

  if (Yield.total) {
    const year = {
      1: 'first',
      3: 'third',
      5: 'fifth',
    }[Yield.q4];

    details.Yield = {
      [`Improved yield estimate in ${year} year of cover crops`]: dollars(Yield.total),
    };
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

      <Print />

      <NestedAccordion details={details} />

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
