import {useSelector, useDispatch} from 'react-redux';
import {get, set, test} from '../../store/Store';
import {Input} from '../../shared/Inputs';

let n = 0;

const Home = () => {
  const dispatch = useDispatch();

  const dev         = useSelector(get.dev);
  const test2       = useSelector(get.test2.a.b.c);
  const fertN       = useSelector(get.fertN);
  const array1      = useSelector(get.array1);
  const array2      = useSelector(get.array2.a);  
  const fullName    = useSelector(get.fullName);
  const fullName2   = useSelector(get.fullName2);
  const fullName2b  = useSelector(state => state.fullName2);

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
          <div style={{display: 'none'}}>
            First name: <Input id="firstName" immediate/><br/>
            Last name:  <Input id="lastName"/><br/>
            Full name: {fullName}<br/>
            Full name2: {fullName2}<br/>
            Full name2b: {fullName2b}<br/>
            n: {++n}
            <br/>
            fertN: {fertN}
            <br/>
            test: {test2}
            <br/>
            array1: {array1}
            <br/>
            array2: {array2}
          </div>
          <button
            onClick={() => {
              dispatch(set.fertN(333));
              test('fertN', 333);

              dispatch(set.test2.a.b.c(987));
              test('test2.a.b.c', 987);

              dispatch(set.array1({index: 1, value: 'was '}));
              test('array1', ['This ','was ', 'a ', 'test']);

              dispatch(set.array2.a([1, 2, 3, 4, 5]));
              test('array2.a', [1,2,3,4,5,]);

              dispatch(set.firstName('Rick'));
              dispatch(set.lastName('Hitchcock'));

              dispatch(set.cashCrop('Corn'));

              test('fullName', 'Rick Hitchcock');
              test('fullName2', 'Rick Hitchcock');
            }}
          >
            Test data
          </button>
        </div>
        )}
    </div>
  )
} // Home

Home.menu = <span><u>H</u>ome</span>;

export default Home;