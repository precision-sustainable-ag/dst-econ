import {useSelector, useDispatch} from 'react-redux';
import {get, set} from '../store/store';

const Airtable = ({name, url}) => {
  const dispatch = useDispatch();

  window.scrollTo(0, 0);
  const table = useSelector(state => state[name]);
  const state = useSelector(get[name]);
  console.log(state);

  let keys = {};
  
  Object.values(table).forEach((value) => {
    Object.keys(value).forEach(k => keys[k] = true);
  });
  
  keys = Object.keys(keys).filter(k => k !== 'key').sort();
  let first = 1;
  return (
    <form class="airtable">
      <h2>
        <a 
          target="_blank"
          rel="noreferrer"
          href={url}
        >
          {name}
        </a>
      </h2>
      <table>
        <thead>
          <tr style={{background: '#eee'}}>
            <th>Key</th>
            {keys.map(k => <th>{k}</th>)}
          </tr>
        </thead>
        <tbody>
          <>
            {
              Object.keys(table).sort().map((key) => {
                return (
                  <tr>
                    <td>{key}</td>
                    {keys.map(k => {
                      if (state[key][k]) {
                        return (
                          <td>
                            <input
                              id={`${name}.${key}.${k}`}
                              value={state[key][k]}
                              autoFocus={first++ == 1}
                              onChange={(e) => {
                                dispatch(set[name][key][k](e.target.value));
                              }}
                            />
                          </td>
                        )
                      } else {
                        return <td></td>
                      }
                    })}
                  </tr>
                )
              })
            }
          </>
        </tbody>
      </table>
    </form>
  )
} // Airtable

export default Airtable;