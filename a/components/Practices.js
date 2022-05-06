import {Navigation} from './Navigation';

const Practices = ({set}) => (
  <div className="Practices">
    <h1>Economic Decision Aid for Cover Crops: Summary of Practices</h1>
    <Navigation set={set} current={Practices} />
  </div>
) // Practices

Practices.menu = 'Summary of Practices';

export default Practices;