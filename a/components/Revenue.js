import {Navigation} from './Navigation';

const Revenue = ({set}) => (
  <div className="Revenue">
    <h1>Economic Decision Aid for Cover Crops: Revenue Impact</h1>
    <Navigation set={set} current={Revenue} />
  </div>
) // Revenue

Revenue.menu = 'Revenue Impact';

export default Revenue;