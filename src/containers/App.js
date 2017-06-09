import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as CounterActions from '../actions/CounterActions';
import Counter from '../components/Counter';
import Footer from '../components/Footer';
import CollapsrCanvas from '../containers/CollapsrCanvas';

function mapStateToProps(state) {
  return {
    counter: state.counter
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(CounterActions, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {
  static propTypes = {
  };

  constructor() {
    super();
    this.playing = true;
    setTimeout(() => {
      this.playing = false;
    }, 3000);
  }

  render() {
    return (
      <div className="main-app-container">
        <CollapsrCanvas
          filename={'/img/rhino.png'}
          width={1800}
          height={1100}
          scatter={6}
          playing={this.playing ? true : undefined}
        />
      </div>
    );
  }
}
