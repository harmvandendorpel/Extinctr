import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as FallerActions from '../actions/FallerActions';
import CollapsrCanvas from '../containers/CollapsrCanvas';

@connect(
  state => ({
    loaded: state.faller.loaded
  }),
  dispatch => ({
    actions: bindActionCreators(FallerActions, dispatch)
  })
)
export default class App extends Component {
  static propTypes = {
    loaded: PropTypes.bool.isRequired
  };

  loadImage() {
    this.props.actions.imageRequest('/img/rhino.png');
  }

  render() {
    const faller = this.props.loaded ? (
      <CollapsrCanvas
        filename={'/img/rhino.png'}
        width={1800}
        height={1100}
        scatter={6}
        playing={this.playing ? true : undefined}
      />
    ) : (
      <button onClick={this.loadImage.bind(this)}>Load</button>
    );

    return (
      <div className="main-app-container">
        { faller }
      </div>
    );
  }
}
