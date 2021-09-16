import {Navigation} from './Navigation';

const Tillage = ({setScreen}) => (
  <div className="Tillage">
    <h1>Economic Decision Aid for Cover Crops: Tillage</h1>
    <Navigation setScreen={setScreen} current={Tillage} />
  </div>
) // Tillage

export default Tillage;