import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import App from './App';

function Root({ store }) {
  return (
    <Provider store={store}>
      <div>
        <App />
      </div>
    </Provider>
  );
}

Root.propTypes = {
  store: PropTypes.object.isRequired
};

module.exports = Root;
