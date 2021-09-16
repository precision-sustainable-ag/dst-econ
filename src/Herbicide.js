import {Navigation} from './Navigation';

const Herbicide = ({setScreen}) => (
  <div className="Herbicide">
    <h1>Economic Decision Aid for Cover Crops: Herbicide</h1>
    <Navigation setScreen={setScreen} current={Herbicide} />
  </div>
) // Herbicide

export default Herbicide;