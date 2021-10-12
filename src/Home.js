import {Navigation} from './Navigation';

const Home = ({parms, setScreen}) => {
  return (
    <div>
      <h1 id="H1">Economic Decision Aid for Cover Crops</h1>
      <p>Welcome</p>
      <p id="D2">
        <em>This worksheet is for educational purposes only. The user assumes all risks associated with its use.</em>
      </p>
      <Navigation setScreen={setScreen} current={Home} parms={parms} />
      <img src="8-crops 1.png" alt="background" style={{width: '100%'}} />
    </div>
  )
} // Home

export default Home;