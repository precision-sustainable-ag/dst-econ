import {useSelector, useDispatch} from "react-redux";
import {get, set} from "../../store/redux-autosetters";
import {
  exampleSpecies,
  exampleHerbicides,
  exampleSeedbed,
  examplePlanting,
  exampleTermination1,
  exampleTermination2,
  exampleTermination3,
  exampleTermination4,
  exampleTermination5,
  dollars
} from "../../store/Store";

import './styles.scss';

const cost = (n) => n >= 0 ? dollars(n) : '';
const benefit = (n) => n < 0 ? dollars(-n) : '';

const CropSummary = () => {
  const dispatch = useDispatch();
  const species = useSelector(get.species);
  const coverCropTotal = useSelector(get.coverCropTotal);
  const rates = useSelector(get.rates);
  const prices = useSelector(get.prices);

  return (
    <>
      <tr>
        <td
          colSpan={2}
          onClick={() => dispatch(set.screen('Species'))}
        >
          Cover crops planted
        </td>
        <td className="hidden" />
        <td />
        <td />
        <td>{cost(coverCropTotal)}</td>
        <td />
        <td>{benefit(coverCropTotal)}</td>
      </tr>
      {species.map((crop, i) => (
        <tr key={crop}>
          <td />
          <td>{crop}</td>
          <td>{rates[i]} pounds @ {dollars(prices[i])}/acre</td>
          <td>{cost(rates[i] * prices[i])}</td>
          <td />
          <td>{benefit(rates[i] * prices[i])}</td>
          <td />
        </tr>
      ))}
    </>
  );
} // CropSummary

const SeedbedSummary = () => {
  const dispatch = useDispatch();
  const total = useSelector(get.seedbed.total) || 0;
  const implement = useSelector(get.seedbed.implement);
  const power = useSelector(get.seedbed.power);

  return (
    <tr>
      <td
        colSpan={2}
        onClick={() => dispatch(set.screen('Seedbed'))}
      >
        Cover crop seedbed preparation
      </td>
      <td className="hidden" />
      <td>
        {implement || 'none'}
        <br />
        {power}
      </td>
      <td />
      <td>{cost(total)}</td>
      <td />
      <td>{benefit(total)}</td>
    </tr>
  )
} // SeedbedSummary

const PlantingSummary = () => {
  const dispatch = useDispatch();
  const total = useSelector(get.planting.total) || 0;
  const implement = useSelector(get.planting.implement);
  const power = useSelector(get.planting.power);

  return (
    <tr>
      <td
        colSpan={2}
        onClick={() => dispatch(set.screen('Planting'))}
      >
        Cover crop planting activity
      </td>
      <td className="hidden" />
      <td>
        {implement}
        <br />
        {power}
      </td>
      <td />
      <td>{cost(total)}</td>
      <td />
      <td>{benefit(total)}</td>
    </tr>
  )
} // PlantingSummary

const TerminationSummary = () => {
  const dispatch = useDispatch();
  const total = useSelector(get.termination.total);
  const method = useSelector(get.termination.method);
  const product = useSelector(get.termination.product);
  const productCost = useSelector(get.termination.productCost);
  const rate = useSelector(get.termination.rate);
  const unitCost = useSelector(get.termination.unitCost);
  
  const chemicalTotal = useSelector(get.chemical.total);
  const chemicalImplement = useSelector(get.chemical.implement);
  const chemicalPower = useSelector(get.chemical.power);

  const rollerTotal = useSelector(get.roller.total);
  const rollerImplement = useSelector(get.roller.implement);
  const rollerPower = useSelector(get.roller.power);

  const tillageTotal = useSelector(get.tillage.total);
  const tillageImplement = useSelector(get.tillage.implement);
  const tillagePower = useSelector(get.tillage.power);

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
        <td
          colSpan={2}
          onClick={() => dispatch(set.screen('Termination'))}
        >
          Cover crop termination activity
        </td>
        <td className="hidden" />
        <td>{method}</td>
        <td />
        <td>{cost(total)}</td>
        <td />
        <td>{benefit(total)}</td>
      </tr>
      {
        productCost ? (
          <tr>
            <td />
            <td>Product: {product}</td>
            <td>{rate} pounds/acre @ {dollars(unitCost)}</td>
            <td>{dollars(productCost)}</td>
            <td />
            <td />
            <td />
          </tr>
        ) : null
      }
      {
        chemicalTotal ? (
          <tr>
            <td />
            <td>Chemical spray equipment</td>
            <td>
              {chemicalImplement}
              <br />
              {chemicalPower}
            </td>
            <td>{cost(chemicalTotal)}</td>
            <td />
            <td>{benefit(chemicalTotal)}</td>
            <td />
          </tr>
        ) : null
      }
      {
        rollerTotal ? (
          <tr>
            <td />
            <td>Roller equipment</td>
            <td>
              {rollerImplement}
              <br />
              {rollerPower}
            </td>
            <td>{cost(rollerTotal)}</td>
            <td />
            <td>{benefit(rollerTotal)}</td>
            <td />
          </tr>
        ) : null
      }
      {
        tillageTotal ? (
          <tr>
            <td />
            <td>Tillage equipment</td>
            <td>
              {tillageImplement}
              <br />
              {tillagePower}
            </td>
            <td>{cost(tillageTotal)}</td>
            <td />
            <td>{benefit(tillageTotal)}</td>
            <td />
          </tr>
        ) : null
      }
      {
        additionalTotal ? (
          <>
            <tr>
              <td />
              <td>Additional herbicides</td>
              <td />
              <td>{cost(additionalTotal)}</td>
              <td />
              <td>{benefit(additionalTotal)}</td>
              <td />
            </tr>
            {
              additionalHerbicides.map((herb, i) => (
                <tr key={herb}>
                  <td />
                  <td>&nbsp;&nbsp;&nbsp;&nbsp;Product: {herb}</td>
                  <td>{additionalRates[i]} pounds @ {dollars(additionalPrices[i])}/acre</td>
                  <td>{dollars(additionalRates[i] * additionalPrices[i])}</td>
                  <td />
                  <td />
                  <td />
                </tr>
              ))
            }
          </>
        ) : null
      }
      {
        reducedTotal ? (
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
            {
              reducedHerbicides.map((herb, i) => (
                <tr key={herb}>
                  <td />
                  <td>&nbsp;&nbsp;&nbsp;&nbsp;Product: {herb}</td>
                  <td>{reducedRates[i]} pounds @ {dollars(reducedPrices[i])}/acre</td>
                  <td />
                  <td />
                  <td>{dollars(reducedRates[i] * reducedPrices[i])}</td>
                  <td />
                </tr>
              ))
            }
          </>
        ) : null
      }
    </>
  )
} // TerminationSummary

const Practices = () => {
  const dispatch = useDispatch();
  const dev = useSelector(get.dev);
  const farm = useSelector(get.farm);
  const field = useSelector(get.field);
  const priorCrop = useSelector(get.priorCrop);
  const cashCrop = useSelector(get.cashCrop);
  const lat = useSelector(get.lat);
  const lon = useSelector(get.lon);

  return (
    <div className="Practices">
      <h1>Summary of Practices</h1>
      
      {farm && <p>Farm: {farm}</p>}
      {field && <p>Field: {field} at {lat} latitude and {lon} longitude</p>}
      
      {priorCrop && cashCrop && <p>Crop management: Cover crop planted after {priorCrop} and prior to {cashCrop}.</p>}

      <table>
        <thead>
          <tr>
            <th colSpan={2} />
            <th className="hidden" />
            <th>Description</th>
            <th>Costs/line item</th>
            <th>Total cost</th>
            <th>Benefit/line item</th>
            <th>Total Benefit</th>
          </tr>
        </thead>
        <tbody>
          <CropSummary />
          <SeedbedSummary />
          <PlantingSummary />
          <TerminationSummary />
        </tbody>
      </table>

      {
        dev && (
          <>
            <button
              onClick={() => {
                dispatch(set.farm('My farm'));
                dispatch(set.field('NW40 of home place'));
                dispatch(set.priorCrop('Corn'));
                dispatch(set.cashCrop('Soybeans'));

                exampleSpecies();
                exampleSeedbed();
                examplePlanting();
                exampleTermination1();
                exampleHerbicides();
              }}
            >
              Test 1
            </button>
            <button
              onClick={() => {
                dispatch(set.farm('My farm'));
                dispatch(set.field('NW40 of home place'));
                dispatch(set.priorCrop('Corn'));
                dispatch(set.cashCrop('Soybeans'));

                exampleSpecies();
                exampleSeedbed();
                examplePlanting();
                exampleTermination2();
                exampleHerbicides();
              }}
            >
              Test 2
            </button>
            <button
              onClick={() => {
                dispatch(set.farm('My farm'));
                dispatch(set.field('NW40 of home place'));
                dispatch(set.priorCrop('Corn'));
                dispatch(set.cashCrop('Soybeans'));

                exampleSpecies();
                exampleSeedbed();
                examplePlanting();
                exampleTermination3();
                exampleHerbicides();
              }}
            >
              Test 3
            </button>
            <button
              onClick={() => {
                dispatch(set.farm('My farm'));
                dispatch(set.field('NW40 of home place'));
                dispatch(set.priorCrop('Corn'));
                dispatch(set.cashCrop('Soybeans'));

                exampleSpecies();
                exampleSeedbed();
                examplePlanting();
                exampleTermination4();
                exampleHerbicides();
              }}
            >
              Test 4
            </button>
            <button
              onClick={() => {
                dispatch(set.farm('My farm'));
                dispatch(set.field('NW40 of home place'));
                dispatch(set.priorCrop('Corn'));
                dispatch(set.cashCrop('Soybeans'));

                exampleSpecies();
                exampleSeedbed();
                examplePlanting();
                exampleTermination5();
                exampleHerbicides();
              }}
            >
              Test 5
            </button>
          </>
        )
      }
    </div>
  )
} // Practices

Practices.menu = <span>S<u>u</u>mmary</span>;

export default Practices;