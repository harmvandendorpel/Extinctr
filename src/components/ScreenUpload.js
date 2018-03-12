import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DropToUpload from 'react-drop-to-upload'
import classNames from 'classnames'
import { connect } from 'react-redux'
import './ScreenUpload.scss'

import { imageRequest } from '../actions/FallerActions'

@connect(
  () => ({}),
  {
    imageRequest
  }
)
export default class ScreenUpload extends Component {
  static propTypes = {
    imageRequest: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context)
    this.state = {
      dropAreaHover: false
    }
  }

  handleHoverDropUpload() {
    this.setState({ dropAreaHover: true })
  }

  handleLeaveDropUpload() {
    this.setState({ dropAreaHover: false })
  }

  handleDropDataURI([dataURI]) {
    this.props.imageRequest(dataURI)
  }

  loadTransTest() {
    this.props.imageRequest('/img/test4.png')
  }


  loadWhiteTest() {
    this.props.imageRequest('/img/test3.png')
  }


  render() {
    const dropAreaClassNames = classNames(
      'dropArea',
      this.state.dropAreaHover ? 'dropArea__hover' : null
    )

    return (
      <div>
        <DropToUpload
          onOver={this.handleHoverDropUpload.bind(this)}
          onLeave={this.handleLeaveDropUpload.bind(this)}
          onDropDataURI={this.handleDropDataURI.bind(this)}
        >
          <div className={dropAreaClassNames}>drop image here</div>
        </DropToUpload>
        <button onClick={this.loadTransTest.bind(this)}>example (transparent background)</button>
        <button onClick={this.loadWhiteTest.bind(this)}>example (white background)</button>
      </div>
    )
  }
}

