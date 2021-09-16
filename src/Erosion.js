import {Navigation} from './Navigation';

const Erosion = ({setScreen}) => (
  <div className="Erosion">
    <h1>Economic Decision Aid for Cover Crops: Soil Erosion Control</h1>
    <Navigation setScreen={setScreen} current={Erosion} />
  </div>
) // Erosion

Erosion.menu = 'Soil erosion control';

export default Erosion;