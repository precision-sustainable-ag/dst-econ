import {Navigation} from './Navigation';

const Additional = ({setScreen}) => (
  <div className="Additional">
    <h1>Economic Decision Aid for Cover Crops: Additional Considerations</h1>
    <Navigation setScreen={setScreen} current={Additional} />
  </div>
) // Additional

Additional.menu = 'Additional considerations';

export default Additional;