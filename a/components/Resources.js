import {Navigation} from './Navigation';

const Resources = ({set, parms}) => (
  <div className="Resources">
    <h1>Economic Decision Aid for Cover Crops: Resources</h1>
    <p>
      If you already use cover crops on your farm, you know that implementing cover crops into your rotation is unique to your farm and individual perspective.
      Multiple years of experience will be valuable to an overall farm strategy.
      However, the resources listed below can supplement your on-farm experience and help guide your decision-making.  
    </p>

    <ul>
      <li>Field and Farm</li>
      <li>Cover Crop selection</li>
      <li>Planting decisions</li>
      <li>Termination</li>
      <li>Tillage</li>
      <li>Fertility</li>
      <li>Herbicide</li>
      <li>Pests</li>
      <li>Soil erosion control</li>
      <li>Additional considerations</li>
      <li>Yield</li>
    </ul>

    <Navigation set={set} current={Resources} parms={parms} />
  </div>
) // Resources

export default Resources;