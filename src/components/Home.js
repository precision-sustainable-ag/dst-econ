import {get, set} from '../store/store';

import {useSelector, useDispatch} from 'react-redux';

let n = 0;
const Home = () => {
  const dispatch = useDispatch();

  const test = useSelector(get.test2.a.b.c);
  // const test = useSelector(state => state.test.a.b.c);
  const fertN = useSelector(get.fertN);
  const array1 = useSelector(get.array1);
  const array2 = useSelector(get.array2.a);

  return (
    <div className="Home">
      <h1 id="H1">Economic Decision Aid for Cover Crops</h1>
      <p>Welcome</p>
      <p id="D2">
        <em>This worksheet is for educational purposes only. The user assumes all risks associated with its use.</em>
      </p>
      <img src="background.png" alt="background" style={{width: '100%'}} />
      n: {++n}
      <br/>
      fertN: {fertN}
      <br/>
      test: {test}
      <br/>
      array1: {array1}
      <br/>
      array2: {array2}
      <br/>
      <button onClick={() => {
        dispatch(set.test2.a.b.c(987));
        dispatch(set.fertN(333));
        dispatch(set.array1({index: 1, value: 'was '}));
        dispatch(set.array2.a([1, 2, 3, 4, 5]));
      }}>
        Click me
      </button>

    </div>
  )
} // Home

export default Home;