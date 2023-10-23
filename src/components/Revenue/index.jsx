/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  dev,
  dollars,
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
  get,
  set,
} from '../../store/Store';
import Input from '../../shared/Inputs';

import './styles.scss';

const Tests = () => (
  <div className="test-buttons">
    <button type="button" onClick={exampleSeeds}>Test Seeds</button>
    <button type="button" onClick={exampleSeedbed}>Test Seedbed</button>
    <button type="button" onClick={examplePlanting}>Test Planting</button>
    <button type="button" onClick={exampleErosion}>Test Erosion</button>
    <button type="button" onClick={exampleGrazing}>Test Grazing</button>
    <button type="button" onClick={exampleHerbicides}>Test Herbicides</button>
    <button type="button" onClick={exampleTermination1}>Test Termination1</button>
    <button type="button" onClick={exampleTermination2}>Test Termination2</button>
    <button type="button" onClick={exampleTermination3}>Test Termination3</button>
    <button type="button" onClick={exampleTermination4}>Test Termination4</button>
    <button type="button" onClick={exampleTermination5}>Test Termination5</button>
    <button type="button" onClick={exampleTillage1}>Test Tillage1</button>
    <button type="button" onClick={exampleTillage2}>Test Tillage2</button>
    <button type="button" onClick={exampleTillage3}>Test Tillage3</button>
    <button type="button" onClick={exampleTillage4}>Test Tillage4</button>
    <button type="button" onClick={exampleTillage5}>Test Tillage5</button>
    <button type="button" onClick={exampleFertilityBenefit}>Test FertilityBenefit</button>
    <button type="button" onClick={exampleFertilityCost}>Test FertilityCost</button>
    <button type="button" onClick={exampleYield1}>Test Yield1</button>
    <button type="button" onClick={exampleYield2}>Test Yield2</button>
  </div>
);

const Revenue = () => {
  const farm = useSelector(get.farm);
  const field = useSelector(get.field);
  const species = useSelector(get.species);

  const coverCropTotal = { desc: 'Seed Expense', value: useSelector(get.coverCropTotal) };
  const seedbedPreparation = { desc: 'Seedbed Preparation', value: useSelector(get.seedbed) };
  const planting = { desc: 'Planting', value: useSelector(get.planting) };
  const termination = { desc: 'Termination', value: useSelector(get.termination) };
  const tillage = { desc: 'Tillage', value: useSelector(get.tillage) };
  const fertility = { desc: 'Fertility', value: useSelector(get.fertility) };
  const herbicide = { desc: 'Herbicides', value: useSelector(get.herbicide) };
  const erosion = { desc: 'Erosion', value: useSelector(get.erosion) };
  const grazing = { desc: 'Grazing', value: useSelector(get.grazing) };
  const yieldImpact = { desc: 'Yield Impact', value: useSelector(get.yield) };
  const additionalConsiderations = { desc: 'Additional Considerations', value: useSelector(get.additional) };

  const revenuePadding = useSelector(get.revenuePadding);
  const revenueColor = useSelector(get.revenueColor);

  const dispatch = useDispatch();
  const revenueOpen = useSelector(get.revenueOpen);

  const increasedCosts = [];

  const cashTotal = (item2) => {
    if (!item2.details) {
      return +item2.cash || 0;
    }

    return item2.details.reduce((total, item3) => total + cashTotal(item3), 0);
  };

  const addIncreasedCost = (desc, data) => {
    if (!data.total) return;
    const det = [];
    ['Labor', 'Fuel'].forEach((type) => {
      if (data[type]) {
        det.push({
          desc: type,
          cash: data.$implements[type] + data.$power[type],
        });
      }
    });

    const det2 = [];
    ['Depreciation', 'Interest', 'Storage'].forEach((type) => {
      if (data[type]) {
        det2.push({
          desc: type,
          cash: data.$implements[type] + data.$power[type],
        });
      }
    });

    ['Repairs', 'Taxes', 'Insurance'].forEach((type) => {
      if (data[type]) {
        det2.push({
          desc: type,
          cash: data.$implements[type] + data.$power[type],
        });
      }
    });

    if (det2.length) {
      det.push({
        desc: 'Ownership costs',
        details: det2,
      });
    }

    if (det.length) {
      increasedCosts.push({
        desc,
        details: det,
      });
    }
  };

  if (species.filter((s) => s).length) {
    increasedCosts.push({
      desc: 'Seeds',
      cash: coverCropTotal.value,
    });
  }

  addIncreasedCost('Planting', planting.value);
  addIncreasedCost('Seedbed', seedbedPreparation.value);
  addIncreasedCost('Herbicide', herbicide.value);

  const renderDetails = (details, level = 0, parentOpen = true, parentDesc = '') => {
    if (!details) return null;

    return (
      details.map((item) => {
        if (!item) return null;

        const open = revenueOpen[parentDesc + item.desc] || false;
        let cname = `level${level}`;
        if (revenueColor) {
          cname += ` color${level}`;
        }

        return (
          <>
            <tr
              className={cname}
              style={{ display: parentOpen ? 'table-row' : 'none' }}
            >
              <td
                style={{ paddingLeft: level * 24 + 5 }}
                onClick={() => {
                  dispatch(set.revenueOpen({
                    ...revenueOpen,
                    [parentDesc + item.desc]: !open,
                  }));
                }}
              >
                {
                  item.details ? (
                    <button
                      type="button"
                      style={{ width: '1rem', marginRight: '0.3rem', padding: '0rem' }}
                    >
                      {open ? '-' : '+'}
                    </button>
                  ) : null
                }
                {item.desc}
              </td>
              <td style={revenuePadding ? { paddingRight: level * 18 + 5 } : {}}>
                {dollars(cashTotal(item))}
              </td>
            </tr>
            {renderDetails(item.details, level + 1, parentOpen && open, item.desc)}
          </>
        );
      })
    );
  };

  const decreasedDetails = [];

  if (erosion.value.total) {
    decreasedDetails.push({
      desc: 'Erosion Control',
      details: [{
        desc: erosion.value.q2,
        cash: erosion.value.total,
      }],
    });
  }

  const data = [];

  if (decreasedDetails.length) {
    data.push({
      desc: 'Decreased Cost',
      details: decreasedDetails,
    });
  }

  if (increasedCosts.length) {
    data.push({
      desc: 'Increased Cost',
      details: increasedCosts,
    });
  }

  if (!decreasedDetails.length && !increasedCosts.length) {
    return (
      <div id="Revenue">
        <h1>Revenue Impact</h1>
        <p>Nothing selected.</p>
        {dev && <Tests />}
      </div>
    );
  }

  // new code

  const allItems = [
    coverCropTotal,
    seedbedPreparation,
    planting,
    termination,
    tillage,
    fertility,
    herbicide,
    erosion,
    grazing,
    yieldImpact,
    additionalConsiderations,
  ];

  const negativeMultiplierItems = ['Fertility', 'Erosion', 'Yield Impact', 'Additional Considerations'];

  const costItems = allItems.filter(
    (item) => ((item.desc === 'Seed Expense' && item.value > 0)
      || (negativeMultiplierItems.includes(item.desc)
        ? (item.value.total * -1) > 0
        : item.value.total > 0)),
  );

  const benefitItems = allItems.filter(
    (item) => ((item.desc === 'Seed Expense' && item.value < 0)
      || (negativeMultiplierItems.includes(item.desc)
        ? (item.value.total * -1) < 0
        : item.value.total < 0)),
  );

  const increaseInIncome = benefitItems.slice(0, benefitItems.length / 2);
  const descreaseInCost = benefitItems.slice(benefitItems.length / 2, benefitItems.length);
  const decreaseInIncome = costItems.slice(0, costItems.length / 2);
  const increaseInCost = costItems.slice(costItems.length / 2, costItems.length);

  console.log(
    'increase in income: ',
    increaseInIncome,
    'decrease in cost: ',
    descreaseInCost,
    'descrease in income: ',
    decreaseInIncome,
    'increase in cost: ',
    increaseInCost,
  );

  const countSection1 = Math.max(increaseInIncome.length, decreaseInIncome.length);
  const countSection2 = Math.max(descreaseInCost.length, increaseInCost.length);

  return (
    <div id="Revenue">
      <div style={{ width: '10rem', float: 'right' }}>
        <Input id="revenuePadding" label="padding" />
        <Input id="revenueColor" label="color" />
      </div>
      <table style={{ float: 'left' }}>
        <caption>Increases in Net Income</caption>
        <thead>
          <tr><th colSpan="3">Increase in Income</th></tr>
          <tr>
            <th>ITEM</th>
            <th>PER ACRE</th>
            <th>TOTAL</th>
          </tr>
        </thead>

        <thead>
          <tr><th colSpan="3">Decrease in Cost</th></tr>
          <tr>
            <th>ITEM</th>
            <th>PER ACRE</th>
            <th>TOTAL</th>
          </tr>
        </thead>
      </table>

      <table>
        <caption>Decreases in Net Income</caption>
        <thead>
          <tr><th colSpan="3">Decrease in Income</th></tr>
          <tr>
            <th>ITEM</th>
            <th>PER ACRE</th>
            <th>TOTAL</th>
          </tr>
        </thead>

        <thead>
          <tr><th colSpan="3">Increase in Cost</th></tr>
          <tr>
            <th>ITEM</th>
            <th>PER ACRE</th>
            <th>TOTAL</th>
          </tr>
        </thead>
      </table>

      <table>
        <caption>
          Economic Effects of Cover Crops
          {farm ? ` on ${farm} ` : ''}
          {field ? ` - ${field} ` : ''}
          {' '}
          (
          {new Date().getFullYear()}
          )
        </caption>
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {renderDetails(data)}
        </tbody>
      </table>

      <table style={{ float: 'left', width: '50%' }}>
        <caption style={{ backgroundColor: '#669f4d', color: '#fff' }}>Increases in Net Income</caption>
        <thead>
          <tr><th colSpan="3" style={{ backgroundColor: '#d7e28b' }}>Increase in Income</th></tr>
          <tr>
            <th>ITEM</th>
            <th>PER ACRE</th>
            <th>TOTAL</th>
          </tr>
        </thead>

        <thead>
          <tr><th colSpan="3" style={{ backgroundColor: '#d7e28b' }}>Decrease in Cost</th></tr>
          <tr>
            <th>ITEM</th>
            <th>PER ACRE</th>
            <th>TOTAL</th>
          </tr>
        </thead>
      </table>

      <table style={{ width: '50%' }}>
        <caption style={{ backgroundColor: '#bb1032', color: '#fff' }}>Decreases in Net Income</caption>
        <thead>
          <tr><th colSpan="3" style={{ backgroundColor: '#e58167' }}>Decrease in Income</th></tr>
          <tr>
            <th>ITEM</th>
            <th>PER ACRE</th>
            <th>TOTAL</th>
          </tr>
        </thead>

        <thead>
          <tr><th colSpan="3" style={{ backgroundColor: '#e58167' }}>Increase in Cost</th></tr>
          <tr>
            <th>ITEM</th>
            <th>PER ACRE</th>
            <th>TOTAL</th>
          </tr>
        </thead>
      </table>

      {dev && <Tests />}
    </div>
  );
}; // Revenue

Revenue.menu = (
  <span>
    Re
    <u>v</u>
    enue
    {' '}
    <span className="desktop">Impact</span>
  </span>
);

export default Revenue;
