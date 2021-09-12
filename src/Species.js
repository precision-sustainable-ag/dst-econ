import Autocomplete from '@material-ui/lab/Autocomplete';
import {TextField} from '@material-ui/core';
import NumberFormat from 'react-number-format';

const dollars = (n) => isFinite(n) ? '$' + (+n).toFixed(2) : '';

const SpeciesRow = ({db, n, parms, update}) => {
  let list = Object.keys(db.seedList).filter(s => !parms.species.includes(s));
  let inputRef;
  return (
    <tr>
      <td>
        <Autocomplete
          getOptionSelected={(option, value) => option.id === value.id} // https://stackoverflow.com/a/65347275/3903374
          options={list}
          value={parms.species[n]}
          onChange={(e, newValue) => {
            update(e, `species${n}`, newValue);  // loses focus
            console.log(inputRef);
            inputRef.focus();
          }}
    
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label=""
              fullWidth={true}
              inputRef={input => {
                inputRef = input;
              }}
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
          prefix={'$'}
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

      <div>
        <button onClick={() => setScreen('Planting') }>Next</button>
      </div>
    </div>
  )
} // Species

Species.menu = 'Cover Crop Selection';

export default Species;