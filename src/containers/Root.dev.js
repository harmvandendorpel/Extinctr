import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import App from './App';
// import DevTools from './DevTools';

module.exports = class Root extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <div>
          <App />
          {/* <DevTools /> */}
        </div>
      </Provider>
    );
  }
};
