import {Autocomplete, Input} from './Inputs';
import {Navigation} from './Navigation';
import Activity from './Activity';

import {Context, db} from './Store';
import {useContext} from 'react';

const dollars = (n) => isFinite(n) ? '$' + (+n).toFixed(2) : '';

const SpeciesRow = ({n}) => {
  const {state, change} = useContext(Context);

  const species = {
    Other:      ['Commercial mix'],
    Brassica:   ['Brassica, Forage', 'Mustard', 'Radish, Forage', 'Radish, Oilseed', 'Rape, Oilseed, Spring', 'Rape, Oilseed, Winter', 'Rapeseed, Forage', 'Turnip, Forage', 'Turnip, Purple Top'],
    Broadleaf:  ['Buckwheat', 'Phacelia', 'Sunflower'],
    Grass:      ['Barley, Spring', 'Barley, Winter', 'Cereal Rye, Spring', 'Cereal Rye, Winter', 'Millet, Japanese', 'Millet, Pearl', 'Oats', 'Oats, Black', 'Oats, Spring', 'Ryegrass, Annual', 'Ryegrass, Perennial', 'Sorghum', 'Sorghum-sudangrass', 'Sudangrass', 'Teff', 'Triticale, Spring', 'Triticale, Winter', 'Wheat, Spring', 'Wheat, Winter'],
    Legume:     ['Alfalfa, Dormant', 'Clover, Alsike', 'Clover, Balansa', 'Clover, Berseem', 'Clover, Crimson', 'Clover, Red', 'Clover, White', 'Cowpea', 'Pea, Spring', 'Pea, Winter', 'Soybeans', 'Sunn Hemp', 'Sweetclover, Yellow', 'Vetch, Hairy']
  };

  const options = [
    ...species.Other,
    ...species.Grass,
    ...species.Legume,
    ...species.Brassica,
    ...species.Broadleaf,
  ].filter(s => s === state['species' + n] || !Object.values(state).includes(s));

  return (
    <tr key={`row${n}`}>
      <td>
        <Autocomplete
          id={'species' + n}
          index={n}
          groupBy={
            (option) => species.Other.includes(option)     ? '-' :
                        species.Brassica.includes(option)  ? 'Brassica' :
                        species.Broadleaf.includes(option) ? 'Broadleaf' :
                        species.Grass.includes(option)     ? 'Grass' :
                        species.Legume.includes(option)    ? 'Legume' :
                                                             'ERROR'
          }
          options={options}

          onInputChange={(event, sp, reason) => {
            if (state.changingScreen) {
              change('change', 'changingScreen', false);
              return;
            } else if (reason === 'clear') {
              setTimeout(() => {  // timeout needed for the cleared species element
                ['species', 'rates', 'prices'].forEach(type => {
                  const obj = Object.keys(state)
                                .filter(key => new RegExp(type + '\\d').test(key))
                                .filter((_, i) => i !== n);
  
                  obj.forEach((value, i) => {
                    change('change', type + i, state[value] || '');
                  });
                });
              }, 1);
            } else {
              change('change', 'rates'  + n, db.rate(sp));
              change('change', 'prices' + n, db.price(sp));
            }
          }}
        />
      </td>
      <td>
        <Input
          type="number"
          id={'rates' + n}
          index={n}
        />
      </td>
      <td>
        <Input
          type="dollar"
          id={'prices' + n}
          index={n}
        />
      </td>
    </tr>
  )
} // SpeciesRow

const Species = () => {
  const {state, change} = useContext(Context);

  let rec = db.stateRegions[state.state.toUpperCase()];
  let region = rec ? db.stateRegions[state.state.toUpperCase()].ccRegion.toLowerCase() : '';
  if (region) {
    region = region[0].toUpperCase() + region.slice(1);
  }

  const link = {
    Midwest:    'https://mccc.msu.edu/selector-tool/',
    Northeast:  'http://northeastcovercrops.com/decision-tool/',
    Southern:   'https://southerncovercrops.org/cover-crop-resource-guide/',
    Western:    'https://westerncovercrops.org/category/resources/selection/'
  }[region];

  const species = Object.keys(state).filter(key => /^species\d/.test(key) && state[key]);

  let total = 0;

  species
    .forEach((s, n) => {
      if (s) {
        total += (+state['rates' + n] || 0) * (+state['prices' + n] || 0);
      }
    });

  change('change', 'coverCropTotal', total);

  return (
    <form>
      <div className="Species">
        <h1 id="H1">Economic Decision Aid for Cover Crops: Species Selection</h1>

        <div id="About">
          <p>In this section, you will select a cover crop and seeding rates as well as an estimated cost of the cover crop seed ($/pound).</p>

          <p>A common strategy for selecting a cover crop is to base your decision upon the need for a specific change you wish to make in a field or farm.  For example, if you wish to build soil organic matter you may want to select a cover crop with high levels of biomass and a fibrous root structure.  Options exist to mitigate soil erosion, create grazing opportunities, and to decrease weed pressure.   If you already know which cover crop you wish to consider, please select from the drop-down menu.  If you are new to the use of cover crops or still have questions, please consider using the [Cover Crop Council LINK or the Cover Crop Selection Tool LINK].</p>

          <p>After selecting a cover crop species, please select a seeding rate.  Seeding rate selection will depend upon whether you are using a single species or a mix.  In addition, you may adjust seeding rates even for single species based upon your intended purpose.  For example, you may use a lower seeding rate of cereal rye if you only seek help with erosion control, but may plant a higher rate if you seek to maximize grazing potential.  You may use the common rate listed in the grey shaded boxes or input your own rate.  If you wish to learn more about possible seeding rates, consider using the "Cover Crop Seeding Rate Calculator".</p>

          <p>Prices for cover crops may vary widely based upon your geography and availability from season to season.  You may utilize the default value or enter specific pricing from your region.</p>
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
                  <SpeciesRow n={n}/>
                )
              })
            }
            <SpeciesRow n={species.length}/>
            <tr>
              <td colSpan="2"><strong>Cost of Cover crop seed ($/acre)</strong></td>
              <td className="hidden"></td>
              <td><strong>{dollars(state.coverCropTotal)}</strong></td>
            </tr>
          </tbody>
        </table>
        
        {
          link &&
          <a href={link} target="_blank" rel="noreferrer">
            {region} Cover Crops Council Species Selector
          </a>
        }

      </div>
      <Navigation current={Species} />
      <Activity db={db} type="species" />
    </form>
  )
} // Species

Species.menu = 'Cover Crop selection';

export default Species;