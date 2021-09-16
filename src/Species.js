import Autocomplete from '@material-ui/lab/Autocomplete';
import {TextField} from '@material-ui/core';
import NumberFormat from 'react-number-format';

import {Navigation} from './Navigation';

const dollars = (n) => isFinite(n) ? '$' + (+n).toFixed(2) : '';

const SpeciesRow = ({db, n, parms, update}) => {
  const species = {
    Brassica:   ['Brassica, Forage', 'Mustard', 'Radish, Forage', 'Radish, Oilseed', 'Rape, Oilseed, Spring', 'Rape, Oilseed, Winter', 'Rapeseed, Forage', 'Turnip, Forage', 'Turnip, Purple Top'],
    Broadleaf:  ['Buckwheat', 'Phacelia', 'Sunflower'],
    Grass:      ['Barley, Spring', 'Barley, Winter', 'Cereal Rye, Spring', 'Cereal Rye, Winter', 'Millet, Japanese', 'Millet, Pearl', 'Oats', 'Oats, Black', 'Oats, Spring', 'Ryegrass, Annual', 'Ryegrass, Perennial', 'Sorghum', 'Sorghum-sudangrass', 'Sudangrass', 'Teff', 'Triticale, Spring', 'Triticale, Winter', 'Wheat, Spring', 'Wheat, Winter'],
    Legume:     ['Alfalfa, Dormant', 'Clover, Alsike', 'Clover, Balansa', 'Clover, Berseem', 'Clover, Crimson', 'Clover, Red', 'Clover, White', 'Cowpea', 'Pea, Spring', 'Pea, Winter', 'Soybeans', 'Sunn Hemp', 'Sweetclover, Yellow', 'Vetch, Hairy']
  };

  const options = [
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
            (option) => species.Brassica.includes(option)  ? 'Brassica' :
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
      {/*
        <td>{dollars((db.seedList[parms.species[n]] || {}).seedingRate)}</td>
        <td>{dollars((db.seedList[parms.species[n]] || {}).price)}</td>
      */}
    </tr>
  )
} // SpeciesRow

const Species = ({sets, setScreen, db, parms, update}) => {
  let total = 0;

  parms.species
    .forEach((s, n) => {
      if (s) {
        total += (+parms.rates[n] || 0) * (+parms.prices[n] || 0)
      }
    });

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
    <div className="Species">
      <h1 id="H1">Economic Decision Aid for Cover Crops: Species Selection</h1>

      <div id="About">
        <p>
          Species selection and planting rate are important decisions for successful cover cropping experience.
          You can access several selection tools by clicking on the links below.
        </p>
        <p>
          The information in the green cells are common rates and prices for the species you selected.
          You can use them or change them to make this analysis specific to your farm.
        </p>
      </div>

      <table>
        <thead>
          <tr>
            <th colSpan="3">User Input</th>
            <td className="hidden"></td>
            <td className="hidden"></td>
            <th colSpan="2">Common rates and prices</th>
          </tr>
          <tr>
            <th>Cover Crop Species</th>
            <th>Seeding Rate<br/>(lb/ac)</th>
            <th>Price<br/>($/lb)</th>
            <th>Seeding Rate<br/>(lb/ac)</th>
            <th>Price<br/>($/lb)</th>
          </tr>
        </thead>
        <tbody>
          {
            parms.species.map((s, n) => 
              s &&
              <SpeciesRow key={s} db={db} n={n} parms={parms} update={update} />
            )
          }
          <SpeciesRow key={`row${parms.species.length}`} db={db} n={parms.species.length} parms={parms} update={update} />
          <tr>
            <td colSpan="2"><strong>Cost of Cover crop seed ($/acre)</strong></td>
            <td className="hidden"></td>
            <td><strong>{dollars(total)}</strong></td>
            <td></td><td></td>
          </tr>
        </tbody>
      </table>
      
      {
        link &&
        <a href={link} target="_blank">
          {region} Cover Crops Council Species Selector
        </a>
      }

      <Navigation setScreen={setScreen} current={Species} />
    </div>
  )
} // Species

Species.menu = 'Cover Crop selection';

export default Species;