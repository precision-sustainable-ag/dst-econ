import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import './index.css';
import App from './App';
import { StoreProvider } from './store/Store';
import {store} from './store/Store';
import { initialState, Reducer } from './store/Reducer';

if (true) {
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  );
} else {
  ReactDOM.render(
    <React.StrictMode>
      <StoreProvider initialState={initialState} reducer={Reducer}>
        <App />
      </StoreProvider>      
    </React.StrictMode>,
    document.getElementById('root')
  );
}