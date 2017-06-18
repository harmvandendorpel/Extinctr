import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import App from './App';
// import DevTools from './DevTools';

function Root({ store }) {
  return (
    <Provider store={store}>
      <div>
        <App />
        {/* <DevTools /> */}
      </div>
    </Provider>
  );
}

Root.propTypes = {
  store: PropTypes.object.isRequired
};

module.exports = Root;
