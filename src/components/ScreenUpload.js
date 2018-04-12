import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
import DropToUpload from './DragToUpload'
import './ScreenUpload.scss'

import { imageRequest } from '../actions/fallerActions'

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

  handleHoverDropUpload = () => {
    this.setState({ dropAreaHover: true })
  }

  handleLeaveDropUpload = () => {
    this.setState({ dropAreaHover: false })
  }

  handleDropDataURI = ([dataURI]) => {
    this.props.imageRequest(dataURI)
  }

  render() {
    const dropAreaClassNames = classNames(
      'dropArea',
      this.state.dropAreaHover ? 'dropArea__hover' : null
    )

    return [
      <DropToUpload
        onOver={this.handleHoverDropUpload}
        onLeave={this.handleLeaveDropUpload}
        onDropDataURI={this.handleDropDataURI}
        key="upload-control"
      >
        <div className={dropAreaClassNames}>
          drop image here (maximum dimensions 512&times;512px)
        </div>
      </DropToUpload>
    ]
  }
}

