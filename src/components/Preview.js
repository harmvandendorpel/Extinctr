import PropTypes from 'prop-types'
import React, { Component } from 'react'
import './Preview.scss'

export default class Preview extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    imageURL: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    uploading: PropTypes.bool.isRequired,
    giphyURL: PropTypes.string,
  }

  static defaultProps = {
    visible: false,
    imageURL: null,
    width: null,
    height: null,
    giphyURL: null
  }

  render() {
    const {
      imageURL,
      visible,
      width,
      height,
      onClose,
      onSave,
      uploading,
      giphyURL
    } = this.props

    if (!visible) return null

    return (
      <div className="preview-container">
        <div className="preview-blur" onClick={() => !uploading && onClose()} />
        {imageURL &&
          <div className="preview-modal">
            <div className="preview-image-container">
              <img
                src={imageURL}
                alt="preview"
                width={width / window.devicePixelRatio}
                height={height / window.devicePixelRatio}
                style={{ display: 'block' }}
              />
            </div>
            <div className="preview-buttons">
              {!uploading && !giphyURL && [
                <button className="tool-button" onClick={onSave}>upload to giphy...</button>,
                <button className="tool-button"><a href={imageURL} target="_blank">view in browser</a></button>,
                <button className="tool-button" onClick={onClose}>close</button>,
              ]}
              {giphyURL && [
                <button className="tool-button"><a href={giphyURL} target="_blank">view on giphy</a></button>,
                <button className="tool-button" onClick={onClose}>close</button>,
              ]}
              {uploading && [
                <button className="tool-button" disabled>uploading to giphy...</button>,
              ]}
            </div>
          </div>
        }
      </div>
    )
  }
}
