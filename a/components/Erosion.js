import {Navigation} from './Navigation';

const Erosion = ({set}) => (
  <div className="Erosion">
    <h1>Economic Decision Aid for Cover Crops: Soil Erosion Control</h1>
    <Navigation set={set} current={Erosion} />
  </div>
) // Erosion

Erosion.menu = 'Soil erosion control';

export default Erosion;