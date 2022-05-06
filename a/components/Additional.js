import {Navigation} from './Navigation';

const Additional = ({set}) => (
  <div className="Additional">
    <h1>Economic Decision Aid for Cover Crops: Additional Considerations</h1>
    <Navigation set={set} current={Additional} />
  </div>
) // Additional

Additional.menu = 'Additional considerations';

export default Additional;