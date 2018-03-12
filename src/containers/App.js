import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ScreenUpload from '../components/ScreenUpload'
import ScreenRecord from '../components/ScreenRecord'

@connect(
  state => ({
    imageLoaded: state.faller.loaded
  })
)
export default class App extends Component {
  static propTypes = {
    imageLoaded: PropTypes.bool.isRequired
  };

  render() {
    const screen = this.props.imageLoaded ? <ScreenRecord /> : <ScreenUpload />
    return <div className="main-app-container">{ screen }</div>
  }
}
