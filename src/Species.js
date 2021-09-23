import Autocomplete from '@material-ui/lab/Autocomplete';
import {TextField} from '@material-ui/core';
import NumberFormat from 'react-number-format';
import {Navigation} from './Navigation';
import Activity from './Activity';

const dollars = (n) => isFinite(n) ? '$' + (+n).toFixed(2) : '';

const SpeciesRow = ({n, parms, update}) => {
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
  ].filter(s => !parms.species.includes(s));

  return (
    <tr>
      <td>
        <Autocomplete
          getOptionSelected={(option, value) => option.id === value.id} // https://stackoverflow.com/a/65347275/3903374

          groupBy={
            (option) => species.Other.includes(option)     ? '-' :
                        species.Brassica.includes(option)  ? 'Brassica' :
                        species.Broadleaf.includes(option) ? 'Broadleaf' :
                        species.Grass.includes(option)     ? 'Grass' :
                        species.Legume.includes(option)    ? 'Legume' :
                                                             'ERROR'
          }
          
          options={options}
    
          value={parms.species[n]}
          
          onChange={(e, newValue) => {
            update(e, `species${n}`, newValue);  // loses focus
          }}
    
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label=""
              fullWidth={true}
            />
          )}
        />
      </td>
      <td>
        <NumberFormat
          id={`rates${n}`}
          value={parms.rates[n] || ''}
          displayType={'input'}
          decimalScale={2}
          fixedDecimalScale={true}
          thousandSeparator={true}
        />
      </td>
      <td>
        <NumberFormat
          id={`prices${n}`}
          value={parms.prices[n] || ''}
          displayType={'input'}
          decimalScale={2}
          fixedDecimalScale={true}
          thousandSeparator={true}
          prefix={'$'}
        />
      </td>
    </tr>
  )
} // SpeciesRow

const Species = ({sets, setScreen, db, parms, ps, update}) => {
  let total = 0;

  parms.species
    .forEach((s, n) => {
      if (s) {
        total += (+parms.rates[n] || 0) * (+parms.prices[n] || 0)
      }
    });

  sets.coverCropTotal(total);

  let rec = db.stateRegions[parms.state.toUpperCase()];
  let region = rec ? db.stateRegions[parms.state.toUpperCase()].ccRegion.toLowerCase() : '';
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
              parms.species.map((s, n) => 
                s &&
                <SpeciesRow key={s} n={n} parms={parms} update={update} />
              )
            }
            <SpeciesRow key={`row${parms.species.length}`} n={parms.species.length} parms={parms} update={update} />
            <tr>
              <td colSpan="2"><strong>Cost of Cover crop seed ($/acre)</strong></td>
              <td className="hidden"></td>
              <td><strong>{dollars(total)}</strong></td>
            </tr>
          </tbody>
        </table>
        
        {
          link &&
          <a href={link} target="_blank">
            {region} Cover Crops Council Species Selector
          </a>
        }

      </div>
      <Navigation setScreen={setScreen} current={Species} />
      <Activity db={db} parms={parms} ps={ps} sets={sets} type="species" />
    </>
  )
} // Species

Species.menu = 'Cover Crop selection';

export default Species;