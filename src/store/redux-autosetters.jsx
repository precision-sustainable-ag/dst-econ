import { configureStore, createAction, createReducer } from '@reduxjs/toolkit';
import axios from 'axios';

export const set = {};
export const get = {};

export const createStore = (initialState, { afterChange = {}, reducers = {} }) => {
  const funcs = {};
  const methods = {};
  const allkeys = {};

  const getAllkeys = (obj, parents = []) => {
    Object.keys(obj).forEach((key) => {
      const isArray = Array.isArray(obj[key]);
      const isObject = !isArray && obj[key] instanceof Object && typeof obj[key] !== 'function';
      const fullkey = parents.length ? `${parents.join('.')}.${key}` : key;

      allkeys[fullkey] = true;

      if (isObject) {
        getAllkeys(obj[key], [...parents, key]);
      }
    });
  }; // getAllkeys

  getAllkeys(initialState);

  const processMethods = ((state, key) => {
    if (methods[key]) {
      Object.keys(methods[key]).forEach((k) => {
        let st = state;
        k.split('.').slice(0, -1).forEach((key2) => {
          st = st[key2];
        });
        const l = k.includes('.') ? k.split('.').slice(-1)[0] : k;
        st[l] = methods[key][k](state);
        processMethods(state, k);
      });
    }
  });

  const builders = (builder) => {
    const recurse = (obj, set2, get2, parents = []) => {
      if (!obj) { // TODO dst-econ
        // console.log(set2);
        return;
      }
      Object.keys(obj).forEach((key) => {
        const isArray = Array.isArray(obj[key]);
        const isObject = !isArray && obj[key] instanceof Object;
        const fullkey = parents.length ? `${parents.join('.')}.${key}` : key;
        allkeys[fullkey] = true;

        get2[key] = (state) => {
          const st = parents.reduce((acc, k) => acc[k], state);

          if (!st) {
            alert(`Unknown: ${fullkey}`);
          }
          return st[key];
        };

        if (typeof obj[key] === 'function') {
          funcs[fullkey] = obj[key];
          const func = obj[key].toString();

          Object.keys(allkeys).forEach((key2) => {
            const regex = new RegExp(`${key2?.replace(/[.$]/g, (c) => `\\${c}`)}`);
            if (func.match(regex)) {
              methods[key2] = methods[key2] || {};
              methods[key2][fullkey] = funcs[fullkey];
            }
          });

          obj[key] = funcs[fullkey](initialState);
        }

        set2[key] = createAction(fullkey);

        builder
          .addCase(set2[key], (state, action) => {
            const st = parents.reduce((acc, k) => acc[k], state);

            if (isArray && Number.isFinite(action.payload.index)) {
              const { index, value } = action.payload;
              st[key][index] = value;
            } else {
              st[key] = action.payload;
            }

            if (afterChange[fullkey]) {
              const ac = afterChange[fullkey](state, action);
              if (ac) {
                ac.forEach((parm) => afterChange[parm](state, action));
              }
            }

            // TODO:  Is the first of these needed?
            processMethods(state, key);
            processMethods(state, fullkey);

            if (afterChange[fullkey]) {
              const func = afterChange[fullkey].toString();
              Object.keys(allkeys).forEach((key2) => {
                if (func.match(new RegExp(`${key2?.replace(/[.$]/g, (c) => `\\${c}`)}`))) {
                  processMethods(state, key2);
                }
              });
            }
          });

        if (isObject) {
          recurse(obj[key], set2[key], get2[key], [...parents, key]);
        }
      });
    }; // recurse

    Object.entries(reducers).forEach(([key, reducer]) => {
      const action = createAction(key);
      builder.addCase(action, reducer);
    });

    builder.addCase(createAction('api'), (state, { payload }) => {
      const method = payload.options.method || 'get';

      axios[method](payload.url, payload.options)
        .then((data) => {
          if (typeof payload.callback === 'function') {
            payload.callback(data.data);
          } else {
            alert(`Error: ${JSON.stringify(payload, null, 2)}`);
          }
        })
        .catch((error) => {
          console.log('api error: ', error);
        });
    });

    recurse(initialState, set, get);

    builder.addDefaultCase((state, action) => {
      if (action.type !== '@@INIT') {
        console.log(`Unknown action: ${JSON.stringify(action)}`);
      }
    });
  }; // builders

  const reducer = createReducer(initialState, builders);

  return configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false,
    }),
  });
}; // createStore
