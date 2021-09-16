import {Navigation} from './Navigation';

const Yield = ({setScreen}) => (
  <div className="Yield">
    <h1>Economic Decision Aid for Cover Crops: Yield</h1>
    <Navigation setScreen={setScreen} current={Yield} />
  </div>
) // Yield

export default Yield;