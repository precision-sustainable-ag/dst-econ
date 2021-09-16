import {Navigation} from './Navigation';

const Practices = ({setScreen}) => (
  <div className="Practices">
    <h1>Economic Decision Aid for Cover Crops: Summary of Practices</h1>
    <Navigation setScreen={setScreen} current={Practices} />
  </div>
) // Practices

Practices.menu = 'Summary of Practices';

export default Practices;