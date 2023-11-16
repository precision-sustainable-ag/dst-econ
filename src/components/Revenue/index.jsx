/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import React from 'react';
import { useSelector } from 'react-redux';
import {
  dev,
  // dollars,
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
  // set,
} from '../../store/Store';
// import Input from '../../shared/Inputs';

import './styles.scss';

const Tests = () => (
  <div className="test-buttons">
    <button type="button" onClick={exampleSeeds}>Test Seeds</button>
    <button type="button" onClick={exampleSeedbed}>Test Seedbed</button>
    <button type="button" onClick={examplePlanting}>Test Planting</button>
    <button type="button" onClick={exampleErosion}>Test Erosion Control</button>
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
  const acres = useSelector(get.mapFeatures.area);

  const coverCropTotal = { desc: 'Seed Expense', value: useSelector(get.coverCropTotal) };
  const seedbedPreparation = { desc: 'Seedbed Preparation', value: useSelector(get.seedbed) };
  const planting = { desc: 'Planting', value: useSelector(get.planting) };
  const termination = { desc: 'Termination', value: useSelector(get.termination) };
  const tillage = { desc: 'Tillage', value: useSelector(get.tillage) };
  const fertility = { desc: 'Fertility', value: useSelector(get.fertility) };
  const herbicide = { desc: 'Herbicides', value: useSelector(get.herbicide) };
  const erosion = { desc: 'Erosion Control', value: useSelector(get.erosion) };
  const grazing = { desc: 'Grazing', value: useSelector(get.grazing) };
  const yieldImpact = { desc: 'Yield Impact', value: useSelector(get.yield) };
  const additionalConsiderations = { desc: 'Additional Considerations', value: useSelector(get.additional) };

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

  const negativeMultiplierItems = ['Fertility', 'Erosion Control', 'Yield Impact', 'Additional Considerations'];

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

  // const increaseInIncome = benefitItems.slice(0, benefitItems.length / 2);
  const increaseInIncome = benefitItems.filter((item) => ['Yield Impact', 'Grazing', 'Additional Considerations'].includes(item.desc));
  const decreaseInCost = benefitItems.filter((item) => ['Erosion Control'].includes(item.desc));
  const decreaseInIncome = costItems.filter((item) => [].includes(item.desc));
  const increaseInCost = costItems.filter((item) => [
    'Seed Expense', 'Seedbed Preparation', 'Planting', 'Termination', 'Tillage', 'Fertility', 'Herbicides',
  ].includes(item.desc));

  const countSection1 = Math.max(increaseInIncome.length, decreaseInIncome.length);
  const countSection2 = Math.max(decreaseInCost.length, increaseInCost.length);

  const descPlaceholder = (index) => (index === 0 ? 'None identified' : '');

  const getValue = (item) => (item.desc === 'Seed Expense' ? Math.abs(item.value.toFixed(2)) : Math.abs(item.value.total));

  const getTotalValue = (itemList) => itemList.reduce((acc, item) => acc + getValue(item), 0);

  const increaseInIncomeTotal = getTotalValue(increaseInIncome);
  const decreaseInCostTotal = getTotalValue(decreaseInCost);
  const decreaseInIncomeTotal = getTotalValue(decreaseInIncome);
  const increaseInCostTotal = getTotalValue(increaseInCost);
  const benefitTotal = increaseInIncomeTotal + decreaseInCostTotal;
  const costTotal = decreaseInIncomeTotal + increaseInCostTotal;
  const finalTotal = benefitTotal - costTotal;

  const formattingOptions = {
    // style: 'decimal',
    // minimumFractionDigits: 2,
    // maximumFractionDigits: 2,
    style: 'currency',
    currency: 'USD',
  };

  return (
    <div id="Revenue">

      <table style={{ float: 'left', width: '100%', marginTop: '2%' }}>
        <caption>
          {`Economic Effects of Cover Crops ${farm ? ` on ${farm} ` : ''}${field ? ` - ${field} ` : ''} ${new Date().getFullYear()}`}
        </caption>

        <tr>
          <th colSpan="3" style={{ backgroundColor: '#669f4d', color: '#fff' }}>Increases in Net Income</th>
          <th colSpan="3" style={{ backgroundColor: '#bb1032', color: '#fff' }}>Decreases in Net Income</th>
        </tr>
        <tr style={{ borderTop: '2px solid #666', borderBottom: '2px solid #666' }}>
          <th colSpan="3" style={{ backgroundColor: '#d7e28b' }}>Increase in Income</th>
          <th colSpan="3" style={{ backgroundColor: '#e58167' }}>Decrease in Income</th>
        </tr>
        <tr>
          <th>ITEM</th>
          <th>PER ACRE</th>
          <th>TOTAL</th>
          <th>ITEM</th>
          <th>PER ACRE</th>
          <th>TOTAL</th>
        </tr>
        {
            Array(countSection1).fill(0).map((_, index) => (
              <tr key={index}>
                <td style={{ textAlign: 'left', width: '25%' }}>
                  {index >= increaseInIncome.length
                    ? descPlaceholder(index)
                    : increaseInIncome[index].desc}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {index >= increaseInIncome.length
                    ? ''
                    : `${(getValue(increaseInIncome[index])).toLocaleString('en-US', formattingOptions)}`}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {index >= increaseInIncome.length
                    ? ''
                    : `${(getValue(increaseInIncome[index]) * acres).toLocaleString('en-US', formattingOptions)}`}
                </td>
                <td style={{ textAlign: 'left', width: '25%' }}>
                  {index >= decreaseInIncome.length
                    ? descPlaceholder(index)
                    : decreaseInIncome[index].desc}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {index >= decreaseInIncome.length
                    ? ''
                    : `${(getValue(decreaseInIncome[index])).toLocaleString('en-US', formattingOptions)}`}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {index >= decreaseInIncome.length
                    ? ''
                    : `${(getValue(decreaseInIncome[index]) * acres).toLocaleString('en-US', formattingOptions)}`}
                </td>
              </tr>
            ))
          }
        <tr>
          <td><b>Total Increased Income</b></td>
          <td style={{ textAlign: 'right' }}>
            <b>
              {increaseInIncomeTotal.toLocaleString('en-US', formattingOptions)}
            </b>
          </td>
          <td style={{ textAlign: 'right' }}>
            <b>
              {(increaseInIncomeTotal * acres).toLocaleString('en-US', formattingOptions)}
            </b>
          </td>
          <td><b>Total Decreased Income</b></td>
          <td style={{ textAlign: 'right' }}>
            <b>
              {decreaseInIncomeTotal.toLocaleString('en-US', formattingOptions)}
            </b>
          </td>
          <td style={{ textAlign: 'right' }}>
            <b>
              {(decreaseInIncomeTotal * acres).toLocaleString('en-US', formattingOptions)}
            </b>
          </td>
        </tr>

        <tr>
          <th colSpan="3" style={{ backgroundColor: '#d7e28b' }}>Decrease in Cost</th>
          <th colSpan="3" style={{ backgroundColor: '#e58167' }}>Increase in Cost</th>
        </tr>
        <tr>
          <th>ITEM</th>
          <th>PER ACRE</th>
          <th>TOTAL</th>
          <th>ITEM</th>
          <th>PER ACRE</th>
          <th>TOTAL</th>
        </tr>
        {
            Array(countSection2).fill(0).map((_, index) => (
              <tr key={index}>
                <td style={{ textAlign: 'left', width: '25%' }}>
                  {index >= decreaseInCost.length
                    ? descPlaceholder(index)
                    : decreaseInCost[index].desc}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {index >= decreaseInCost.length
                    ? ''
                    : `${(getValue(decreaseInCost[index])).toLocaleString('en-US', formattingOptions)}`}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {index >= decreaseInCost.length
                    ? ''
                    : `${(getValue(decreaseInCost[index]) * acres).toLocaleString('en-US', formattingOptions)}`}
                </td>
                <td style={{ textAlign: 'left', width: '25%' }}>
                  {index >= increaseInCost.length
                    ? descPlaceholder(index)
                    : increaseInCost[index].desc}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {index >= increaseInCost.length
                    ? ''
                    : `${(getValue(increaseInCost[index])).toLocaleString('en-US', formattingOptions)}`}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {index >= increaseInCost.length
                    ? ''
                    : `${(getValue(increaseInCost[index]) * acres).toLocaleString('en-US', formattingOptions)}`}
                </td>
              </tr>
            ))
          }
        <tr>
          <td><b>Total Decreased Cost</b></td>
          <td style={{ textAlign: 'right' }}>
            <b>
              {decreaseInCostTotal.toLocaleString('en-US', formattingOptions)}
            </b>
          </td>
          <td style={{ textAlign: 'right' }}>
            <b>
              {(decreaseInCostTotal * acres).toLocaleString('en-US', formattingOptions)}
            </b>
          </td>
          <td><b>Total Increased Cost</b></td>
          <td style={{ textAlign: 'right' }}>
            <b>{increaseInCostTotal.toLocaleString('en-US', formattingOptions)}</b>
          </td>
          <td style={{ textAlign: 'right' }}>
            <b>{(increaseInCostTotal * acres).toLocaleString('en-US', formattingOptions)}</b>
          </td>
        </tr>

        <tr style={{ borderTop: '2px solid #666', borderBottom: '2px solid #666' }}>
          <td>
            <b>Total Increases in Net Income</b>
          </td>
          <td style={{ textAlign: 'right' }}>
            <b>
              {benefitTotal.toLocaleString('en-US', formattingOptions)}
            </b>
          </td>
          <td style={{ textAlign: 'right' }}>
            <b>
              {(benefitTotal * acres).toLocaleString('en-US', formattingOptions)}
            </b>
          </td>
          <td>
            <b>Total Decreases in Net Income</b>
          </td>
          <td style={{ textAlign: 'right' }}>
            <b>
              {costTotal.toLocaleString('en-US', formattingOptions)}
            </b>
          </td>
          <td style={{ textAlign: 'right' }}>
            <b>
              {(costTotal * acres).toLocaleString('en-US', formattingOptions)}
            </b>
          </td>
        </tr>

        <tr>
          <th colSpan="6" style={{ backgroundColor: '#669f4d', color: '#fff' }}>
            Annual Change in Total Net Income =
            {' '}
            {finalTotal < 0 ? '-' : ''}
            {(Math.abs(finalTotal) * acres).toLocaleString('en-US', formattingOptions)}
          </th>
        </tr>
        <tr>
          <th colSpan="6" style={{ backgroundColor: '#669f4d', color: '#fff' }}>
            Annual Change in Per Acre Net Income =
            {' '}
            {finalTotal < 0 ? '-' : ''}
            {(Math.abs(finalTotal)).toLocaleString('en-US', formattingOptions)}
          </th>
        </tr>

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
