import {useSelector, useDispatch} from 'react-redux';
import {get, set} from '../store/store';

const Airtable = ({name, url}) => {
  const dispatch = useDispatch();

  const table = useSelector(state => state[name]);
  const state = useSelector(get[name]);
  console.log(state);
  console.log(set);

  let keys = {};
  
  Object.values(table).forEach((value) => {
    Object.keys(value).forEach(k => keys[k] = true);
  });
  
  keys = Object.keys(keys).filter(k => k !== 'key').sort();
  let first = 1;
  return (
    <form className="airtable">
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
            {keys.map(k => <th key={k}>{k}</th>)}
          </tr>
        </thead>
        <tbody>
          <>
            {
              Object.keys(table).sort().map((key) => {
                return (
                  <tr key={key}>
                    <td>{key}</td>
                    {keys.map(k => {
                      return (
                        <td key={k}>
                          <input
                            id={`${name}.${key}.${k}`}
                            defaultValue={state[key][k]}
                            autoFocus={first++ === 1}
                            
                            onBlur={(e) => {
                              dispatch(set[name][key][k](e.target.value));
                            }}

                            onKeyDown={(e) => {
                              const s = e.target.value;
                              const td = e.target.closest('td');
                              const span = td.querySelector('span');
                              // force new width:
                              if (e.key.length === 1) {
                                span.textContent = s + e.key + '\xa0';
                              } else {
                                span.textContent = s;
                              }

                              if (/ArrowDown|ArrowUp|PageDown|PageUp|End|Home/.test(e.key)) {
                                const col = e.target.closest('td').cellIndex;
                                const row = e.target.closest('tr').rowIndex;
                                const table = e.target.closest('table');
                                let input;
  
                                switch (e.key) {
                                  case 'ArrowDown':
                                    input = table.rows[Math.min(table.rows.length - 1, row + 1)].cells[col].querySelector('input');
                                    break;
                                  case 'ArrowUp':
                                    input = table.rows[row - 1].cells[col].querySelector('input');
                                    break;
                                  case 'PageDown':
                                    input = table.rows[Math.min(table.rows.length - 1, row + 10)].cells[col].querySelector('input');
                                    break;
                                  case 'PageUp':
                                    input = table.rows[Math.max(1, row - 10)].cells[col].querySelector('input');
                                    break;
                                  case 'End':
                                    if (e.ctrlKey) {
                                      input = table.rows[table.rows.length - 1].cells[col].querySelector('input');
                                    }
                                    break;
                                  case 'Home':
                                    if (e.ctrlKey) {
                                      input = table.rows[1].cells[col].querySelector('input');
                                    }
                                    break;
                                  default:
                                }

                                if (input) {
                                  input.focus();
                                  input.select();

                                  // prevent position: sticky from covering input:
                                  const pos = input.getBoundingClientRect();
                                  if (pos.top < input.clientHeight) {
                                    window.scrollTo(window.scrollX, window.scrollY - input.clientHeight);
                                  }
                                  e.preventDefault();
                                }
                              }
                            }}
                          />
                          <span>{state[key][k]}</span>
                        </td>
                      )
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