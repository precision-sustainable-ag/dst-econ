import {Input} from './Inputs'
import {useSelector} from 'react-redux';
import {get} from '../store/store';

const Airtable = ({name, url}) => {
  const table = useSelector(state => state[name]);

  let keys = {};
  
  for (const [key, value] of Object.entries(table)) {
    // eslint-disable-next-line no-loop-func
    Object.keys(value).forEach(k => keys[k] = true);
  }
  keys = Object.keys(keys).filter(k => k !== 'key').sort();

  return (
    <>
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
                      if (get[name][key][k]) {
                        return <td><Input id={`${name}.${key}.${k}`} /></td>
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
    </>
  )
} // Airtable

export default Airtable;