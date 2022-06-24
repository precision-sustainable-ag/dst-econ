import {useSelector, useDispatch} from 'react-redux';
import {get, set, dollars, test, db} from '../store/store';
import {Input} from './Inputs';
import Activity from './Activity';

const SpeciesRow = ({n}) => {
  const species = useSelector(get.species);

  const speciesList = {
    Other:      ['Commercial mix'],
    Brassica:   ['Brassica, Forage', 'Mustard', 'Radish, Forage', 'Radish, Oilseed', 'Rape, Oilseed, Spring', 'Rape, Oilseed, Winter', 'Rapeseed, Forage', 'Turnip, Forage', 'Turnip, Purple Top'],
    Broadleaf:  ['Buckwheat', 'Phacelia', 'Sunflower'],
    Grass:      ['Barley, Spring', 'Barley, Winter', 'Cereal Rye, Spring', 'Cereal Rye, Winter', 'Millet, Japanese', 'Millet, Pearl', 'Oats', 'Oats, Black', 'Oats, Spring', 'Ryegrass, Annual', 'Ryegrass, Perennial', 'Sorghum', 'Sorghum-sudangrass', 'Sudangrass', 'Teff', 'Triticale, Spring', 'Triticale, Winter', 'Wheat, Spring', 'Wheat, Winter'],
    Legume:     ['Alfalfa, Dormant', 'Clover, Alsike', 'Clover, Balansa', 'Clover, Berseem', 'Clover, Crimson', 'Clover, Red', 'Clover, White', 'Cowpea', 'Pea, Spring', 'Pea, Winter', 'Soybeans', 'Sunn Hemp', 'Sweetclover, Yellow', 'Vetch, Hairy']
  };

  const options = [
    ...speciesList.Other,
    ...speciesList.Grass,
    ...speciesList.Legume,
    ...speciesList.Brassica,
    ...speciesList.Broadleaf,
  ].filter((s, i) => s === species[n] || !species.includes(s));

  return (
    <tr>
      <td>
        <Input
          id="species"
          index={n}
          autoFocus={n === 0}
          groupBy={
            (option) => speciesList.Other.includes(option)     ? '-' :
                        speciesList.Brassica.includes(option)  ? 'Brassica' :
                        speciesList.Broadleaf.includes(option) ? 'Broadleaf' :
                        speciesList.Grass.includes(option)     ? 'Grass' :
                        speciesList.Legume.includes(option)    ? 'Legume' :
                                                                 'ERROR'
          }
          options={options}
        />
      </td>
      <td>
        <Input
          type="number"
          id="rates"
          index={n}
        />
      </td>
      <td>
        <Input
          type="dollar"
          id="prices"
          index={n}
        />
      </td>
    </tr>
  )
} // SpeciesRow

const Species = () => {
  console.log('Render: Species');

  const dispatch = useDispatch();
  const dev      = useSelector(get.dev);
  const species  = useSelector(get.species);
  const state    = useSelector(get.state);
  const total    = useSelector(get.coverCropTotal);

  let rec = db.stateRegions[state.toUpperCase()];

  let region = rec ? db.stateRegions[state.toUpperCase()].ccRegion.toLowerCase() : '';
  if (region) {
    region = region[0].toUpperCase() + region.slice(1);
  }

  const link = {
    Midwest:    'https://mccc.msu.edu/selector-tool/',
    Northeast:  'http://northeastcovercrops.com/decision-tool/',
    Southern:   'https://southerncovercrops.org/cover-crop-resource-guide/',
    Western:    'https://westerncovercrops.org/category/resources/selection/'
  }[region];

  return (
    <>
      <form className="Species">
        <div>
          <h1>Economic Decision Aid for Cover Crops: Species Selection</h1>

          <div id="About">
            <p>In this section, you will select a cover crop and seeding rates as well as an estimated cost of the cover crop seed ($/pound).</p>

            <p>
              A common strategy for selecting a cover crop is to base your decision upon the need for a specific change you wish to make in a field or farm.
              For example, if you wish to build soil organic matter you may want to select a cover crop with high levels of biomass and a fibrous root structure.
              Options exist to mitigate soil erosion, create grazing opportunities, and to decrease weed pressure.
              If you already know which cover crop you wish to consider, please select from the drop-down menu.
              If you are new to the use of cover crops or still have questions,
              please consider using the <a href={link} target="_blank" rel="noreferrer">{region} Cover Crops Council Species Selector</a>.
            </p>

            <p>
              After selecting a cover crop species, please select a seeding rate.
              Seeding rate selection will depend upon whether you are using a single species or a mix.
              In addition, you may adjust seeding rates even for single species based upon your intended purpose.
              For example, you may use a lower seeding rate of cereal rye if you only seek help with erosion control,
              but may plant a higher rate if you seek to maximize grazing potential.
              You may use the common rate listed in the grey shaded boxes or input your own rate.
              If you wish to learn more about possible seeding rates, consider using the "Cover Crop Seeding Rate Calculator".</p>

            <p>
              Prices for cover crops may vary widely based upon your geography and availability from season to season.
              You may utilize the default value or enter specific pricing from your region.
            </p>
          </div>

          <table>
            <thead>
              <tr>
                <th colSpan="3">User Input</th>
                <td className="hidden"></td>
                <td className="hidden"></td>
              </tr>
              <tr>
                <th>Cover Crop Species</th>
                <th>Seeding Rate<br/>(lb/ac)</th>
                <th>Price<br/>($/lb)</th>
              </tr>
            </thead>
            <tbody>
              {
                species.map((s, n) => {
                  return (
                    s &&
                    <SpeciesRow key={n} n={n}/>
                  )
                })
              }
              <SpeciesRow key={species.length} n={species.length}/>
              <tr>
                <td colSpan="2"><strong>Cost of Cover crop seed ($/acre)</strong></td>
                <td className="hidden"></td>
                <td><strong>{dollars(total)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </form>
      {
        dev && (
          <button
            onClick={() => {
              dispatch(set.species({index: 0, value: 'Clover, Crimson'}));
              dispatch(set.rates({index: 0, value: 17}));
              dispatch(set.prices({index: 0, value: 14}));
              dispatch(set.species({index: 1, value: 'Clover, Berseem'}));
              dispatch(set.rates({index: 1, value: 5}));
              dispatch(set.prices({index: 1, value: 3.13}));
              test('coverCropTotal', 253.65);
              test('fertN', 30);
              dispatch(set.rates({index: 0, value: 16}));
              test('coverCropTotal', 239.65);
            }}
          >
            Test data
          </button>
        )
      }
      <button
        onClick={() => {
          dispatch(set.rates([]));
          dispatch(set.prices([]));
          dispatch(set.species([]));
        }}
      >
        Clear inputs
      </button>

      <Activity type="species"/>
    </>
  )
} // Species

Species.menu = 'Cover Crop selection';

export default Species;