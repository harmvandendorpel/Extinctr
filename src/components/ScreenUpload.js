import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DropToUpload from 'react-drop-to-upload';
import classNames from 'classnames';
import './ScreenUpload.scss';


export default class ScreenUpload extends Component {
  static propTypes = {
    imageRequest: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      dropAreaHover: false
    };
  }

  handleHoverDropUpload() {
    this.setState({ dropAreaHover: true });
  }

  handleLeaveDropUpload() {
    this.setState({ dropAreaHover: false });
  }

  handleDropDataURI([dataURI]) {
    this.props.imageRequest(dataURI);
  }

  render() {
    const dropAreaClassNames = classNames(
      'dropArea',
      this.state.dropAreaHover ? 'dropArea__hover' : null
    );

    return (
      <div>
        <DropToUpload
          onOver={this.handleHoverDropUpload.bind(this)}
          onLeave={this.handleLeaveDropUpload.bind(this)}
          onDropDataURI={this.handleDropDataURI.bind(this)}
        >
          <div className={dropAreaClassNames}>Drop file here to upload</div>
        </DropToUpload>
      </div>
    );
  }
}

