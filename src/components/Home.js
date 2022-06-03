import {get, set, test} from '../store/store';

import {useSelector, useDispatch} from 'react-redux';

let n = 0;
const Home = () => {
  const dispatch = useDispatch();
  const dev  = useSelector(get.dev);
  const test2 = useSelector(get.test2.a.b.c);
  // const test = useSelector(state => state.test.a.b.c);
  const fertN = useSelector(get.fertN);
  const array1 = useSelector(get.array1);
  const array2 = useSelector(get.array2.a);

  return (
    <div className="Home">
      <h1>Economic Decision Aid for Cover Crops</h1>
      <p>Welcome</p>
      <p>
        <em>This worksheet is for educational purposes only. The user assumes all risks associated with its use.</em>
      </p>
      <img src="background.png" alt="background" style={{width: '100%'}} />
      {dev && (
        <div>
          n: {++n}
          <br/>
          fertN: {fertN}
          <br/>
          test: {test2}
          <br/>
          array1: {array1}
          <br/>
          array2: {array2}
          <br/>
          <button
            onClick={() => {
              dispatch(set.fertN(333));
              test('fertN', 333);

              dispatch(set.test2.a.b.c(987));
              test('test2.a.b.c', 987);

              dispatch(set.array1({index: 1, value: 'was '}));
              test('array1', ['This ','was ', 'a ', 'test']);

              dispatch(set.array2.a([1, 2, 3, 4, 5]));
              test('array2.a', [1,2,3,4,5]);
            }}
          >
            Click me
          </button>
        </div>
        )}
    </div>
  )
} // Home

export default Home;