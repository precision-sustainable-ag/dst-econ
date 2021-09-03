import Autocomplete from '@material-ui/lab/Autocomplete';

import {TextField, Input} from '@material-ui/core';

const dollars = (n) => isFinite(n) ? '$' + (+n).toFixed(2) : '';

const SpeciesRow = ({db, ps, n, parms, sets}) => {
  const species = 'species' + n;

  return (
    <tr>
      <td>
        <Autocomplete
          value={parms[species] || []}
          options={Object.keys(db.seedList)}
          onChange={(event, newValue) => {
            sets[species](newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label=""
              zplaceholder="Cash crop"
              fullWidth={true}
            />
          )}      
        />
      </td>
      <td>
        <TextField 
          type="number"
          autoComplete="off"
          inputProps={{
            min: 0,
            style: { textAlign: 'right' }}
          }
          {...ps('rate' + n)}
        />
      </td>
      <td>
        <TextField 
          type="number"
          inputProps={{
            min: 0,
            style: { textAlign: 'right' }}
          }
          {...ps('price' + n)}
        />
      </td>
      <td>{dollars((db.seedList[parms['species' + n]] || {}).seedingRate)}</td>
      <td>{dollars((db.seedList[parms['species' + n]] || {}).price)}</td>
    </tr>
  )
} // SpeciesRow

const Species = ({sets, setScreen, db, parms, ps}) => (
  <div className="Species">
    <h1 id="H1">Economic Decision Aid for Cover Crops: Species Selection</h1>

    <div id="About">
      Species selection and planting rate are important decisions for successful cover cropping experience.
      You can access several selection tools by clicking on the links below.
      The information in the green cells are guidelines for the species you selected.
      You can use them or change them to make this analysis specific to your farm.
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
        <SpeciesRow sets={sets} ps={ps} db={db} parms={parms} n='1'/>
        <SpeciesRow sets={sets} ps={ps} db={db} parms={parms} n='2'/>
        <SpeciesRow sets={sets} ps={ps} db={db} parms={parms} n='3'/>
        <SpeciesRow sets={sets} ps={ps} db={db} parms={parms} n='4'/>
        <SpeciesRow sets={sets} ps={ps} db={db} parms={parms} n='5'/>
        <tr>
          <td colSpan="2"><strong>Cost of Cover crop seed ($/acre)</strong></td>
          <td className="hidden"></td>
          <td><strong>{dollars(parms.rate1 * parms.price1 + parms.rate2 * parms.price2 + parms.rate3 * parms.price3 + parms.rate4 * parms.price4 + parms.rate5 * parms.price5)}</strong></td>
          <td></td><td></td>
        </tr>
      </tbody>
    </table>

    <div>
      <button onClick={() => setScreen('Planting') }>Next</button>
    </div>
  </div>
) // Species

Species.menu = 'Cover Crop Selection';

export default Species;