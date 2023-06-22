/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  dollars,
  exampleErosion,
  examplePlanting,
  exampleSeeds,
  get,
  set,
} from '../../store/Store';

import './styles.scss';

const Tests = () => (
  <div className="test-buttons">
    <button type="button" onClick={exampleSeeds}>Test Seeds</button>
    <button type="button" onClick={examplePlanting}>Test Planting</button>
    <button type="button" onClick={exampleErosion}>Test Erosion</button>
  </div>
);

const Revenue = () => {
  const dev = useSelector(get.dev);
  const species = useSelector(get.species);
  const rates = useSelector(get.rates);
  const prices = useSelector(get.prices);
  const planting = useSelector(get.planting);
  const erosion = useSelector(get.erosion);
  console.log({
    planting,
    erosion,
  });

  const dispatch = useDispatch();
  const revenueOpen = useSelector(get.revenueOpen);

  const cashTotal = (item2) => {
    if (!item2.details) {
      return +item2.cash || 0;
    }

    return item2.details.reduce((total, item3) => total + cashTotal(item3), 0);
  };

  const nonTotal = (item2) => {
    if (!item2.details) {
      return +item2.non || 0;
    }

    return item2.details.reduce((total, item3) => total + nonTotal(item3), 0);
  };

  const increasedDetails = [];
  if (species.filter((s) => s).length || planting.total) {
    const details = [];

    if (species.filter((s) => s).length) {
      details.push({
        desc: 'Seeds',
        details: species.filter((s) => s).map((s, i) => {
          const total = -(rates[i] * prices[i]);
          return {
            desc: s,
            cash: total,
          };
        }),
      });
    }

    if (planting.total) {
      const det = [];
      ['Labor', 'Fuel'].forEach((type) => {
        if (planting[type]) {
          det.push({
            desc: type,
            cash: -(planting.$implements[type] + planting.$power[type]),
          });
        }
      });

      const det2 = [];
      ['Depreciation', 'Interest', 'Storage'].forEach((type) => {
        if (planting[type]) {
          det2.push({
            desc: type,
            non: -(planting.$implements[type] + planting.$power[type]),
          });
        }
      });

      ['Repairs', 'Taxes', 'Insurance'].forEach((type) => {
        if (planting[type]) {
          det2.push({
            desc: type,
            cash: -(planting.$implements[type] + planting.$power[type]),
          });
        }
      });

      if (det2.length) {
        det.push({
          desc: 'Ownership costs',
          details: det2,
        });
      }

      if (det.length || det2.length) {
        details.push({
          desc: planting.implement,
          details: det,
        });
      }
    }

    increasedDetails.push({
      desc: 'Planting',
      details,
    });
  }

  const renderDetails = (details, level = 0, parentOpen = true) => {
    if (!details) return null;

    return (
      details.map((item) => {
        if (!item) return null;

        const open = revenueOpen[item.desc] || false;
        return (
          <>
            <tr
              className={`level${level}`}
              style={{ display: parentOpen ? 'table-row' : 'none' }}
            >
              <td
                style={{ paddingLeft: level * 24 + 5 }}
                onClick={() => {
                  dispatch(set.revenueOpen({
                    ...revenueOpen,
                    [item.desc]: !open,
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
              <td>{cashTotal(item) ? dollars(cashTotal(item)) : ''}</td>
              <td>{nonTotal(item) ? dollars(nonTotal(item)) : ''}</td>
              <td>{dollars(cashTotal(item) + nonTotal(item))}</td>
            </tr>
            {renderDetails(item.details, level + 1, parentOpen && open)}
          </>
        );
      })
    );
  };

  const decreasedDetails = [];

  if (erosion.total) {
    decreasedDetails.push({
      desc: 'Erosion Control',
      details: [{
        desc: erosion.q2,
        cash: erosion.total,
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

  if (increasedDetails.length) {
    data.push({
      desc: 'Increased Cost',
      details: increasedDetails,
    });
  }

  console.log(data);

  if (!decreasedDetails.length && !increasedDetails.length) {
    return (
      <div id="Revenue">
        <h1>Revenue Impact</h1>
        <p>Nothing selected.</p>
        {dev && <Tests />}
      </div>
    );
  }

  return (
    <div id="Revenue">
      <h1>Revenue Impact</h1>
      <table>
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>Cash</th>
            <th>Non-cash</th>
            <th>Grand Total</th>
          </tr>
        </thead>
        <tbody>
          {renderDetails(data)}
        </tbody>
      </table>
      {dev && <Tests />}
    </div>
  );
}; // Revenue

Revenue.menu = (
  <span>
    Re
    <u>v</u>
    enue Impact
  </span>
);

export default Revenue;
