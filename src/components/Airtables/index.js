/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react';
import { db } from '../../store/Store';

import './styles.scss';

const Airtable = ({ name, url }) => {
  const table = db[name];

  let keys = {};

  Object.values(table).forEach((value) => {
    Object.keys(value).forEach((k) => {
      keys[k] = true;
    });
  });

  keys = Object.keys(keys).filter((k) => k !== 'key').sort();
  let first = 1;
  return (
    <form id="Airtable">
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
          <tr style={{ background: '#eee' }}>
            <th>Key</th>
            {keys.map((k) => <th key={k}>{k}</th>)}
          </tr>
        </thead>
        <tbody>
          {
              Object.keys(table).sort().map((key) => (
                <tr key={key}>
                  <td>{key}</td>
                  {keys.map((k) => (
                    <td key={k}>
                      <input
                        id={`${name}.${key}.${k}`}
                        defaultValue={table[key][k]}
                        autoFocus={first++ === 1}
                        onFocus={(e) => e.target.select()}
                        onBlur={(e) => {
                          table[key][k] = e.target.value;
                        }}
                        onKeyDown={(e) => {
                          const s = e.target.value;
                          const td = e.target.closest('td');
                          const span = td.querySelector('span');
                          // force new width:
                          if (e.key.length === 1) {
                            span.textContent = `${s + e.key}\xa0`;
                          } else {
                            span.textContent = s;
                          }
                          if (/ArrowDown|ArrowUp|PageDown|PageUp|End|Home/.test(e.key)) {
                            const col = e.target.closest('td').cellIndex;
                            const row = e.target.closest('tr').rowIndex;
                            const table2 = e.target.closest('table');
                            let input;

                            switch (e.key) {
                              case 'ArrowDown':
                                input = table2.rows[Math.min(table2.rows.length - 1, row + 1)].cells[col].querySelector('input');
                                break;
                              case 'ArrowUp':
                                input = table2.rows[row - 1].cells[col].querySelector('input');
                                break;
                              case 'PageDown':
                                input = table2.rows[Math.min(table2.rows.length - 1, row + 10)].cells[col].querySelector('input');
                                break;
                              case 'PageUp':
                                input = table2.rows[Math.max(1, row - 10)].cells[col].querySelector('input');
                                break;
                              case 'End':
                                if (e.ctrlKey) {
                                  input = table2.rows[table2.rows.length - 1].cells[col].querySelector('input');
                                }
                                break;
                              case 'Home':
                                if (e.ctrlKey) {
                                  input = table2.rows[1].cells[col].querySelector('input');
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
                      <span>{table[key][k]}</span>
                    </td>
                  ))}
                </tr>
              ))
            }
        </tbody>
      </table>
    </form>
  );
}; // Airtable

export default Airtable;
