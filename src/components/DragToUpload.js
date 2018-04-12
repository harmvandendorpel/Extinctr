import PropTypes from 'prop-types'
import React, { Component } from 'react'

const NOOP = () => 0

class DropToUpload extends Component {
  static propTypes = {
    className: PropTypes.string,
    dropEffect: PropTypes.oneOf(['copy', 'link', 'move', 'none']),
    element: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    id: PropTypes.string,
    onDropArrayBuffer: PropTypes.func,
    onDropDataURI: PropTypes.func,
    onOver: PropTypes.func,
    onLeave: PropTypes.func,
    style: PropTypes.any,
    children: PropTypes.any.isRequired
  }

  static defaultProps = {
    element: 'div',
    onDrop: NOOP,
    onDropArrayBuffer: NOOP,
    onDropDataURI: NOOP,
    onOver: NOOP,
    onLeave: NOOP
  }

  constructor(props) {
    super(props)

    this.handleDragOver = this.handleDragOver.bind(this)
    this.handleDragLeave = this.handleDragLeave.bind(this)
    this.handleDrop = this.handleDrop.bind(this)
  }

  handleDragOver(evt) {
    evt.preventDefault()
    evt.stopPropagation()

    if (this.props.dropEffect) {
      evt.dataTransfer.dropEffect = this.props.dropEffect
    }

    this.props.onOver(evt)
  }

  handleDragLeave(evt) {
    evt.preventDefault()
    evt.stopPropagation()

    this.props.onLeave(evt)
  }

  handleClick(evt) {
    console.log(evt)
  }

  handleDrop(evt) {
    evt.preventDefault()
    evt.stopPropagation()

    const { onDrop, onDropArrayBuffer, onDropDataURI } = this.props

    const files = [].slice.call(getEventFiles(evt))

    if (files.length) {
      /* eslint-disable */
      onDrop === NOOP ||
        onDrop(files)

      onDropArrayBuffer === NOOP ||
        Promise.all(files.map(file => readAsArrayBuffer(file))).then(arrayBuffers => onDropArrayBuffer(arrayBuffers, files))

      onDropDataURI === NOOP ||
        Promise.all(files.map(file => readAsDataURI(file))).then(dataURIs => onDropDataURI(dataURIs, files))
      /* eslint-enable */
    }
  }

  render() {
    const { props } = this

    return React.createElement(this.props.element, {
      className: props.className,
      id: props.id,
      onDragOver: this.handleDragOver,
      onDragLeave: this.handleDragLeave,
      onDrop: this.handleDrop,
      onClick: this.handleClick,
      style: props.style
    }, (
      <div>
        <input
          id="file-input"
          type="file"
          onChange={e => this.handleDrop(e)}
          style={{ display: 'none' }}
        />
        <label htmlFor="file-input">
        {this.props.children}
        </label>

      </div>
    ))
  }
}

export default DropToUpload

function getEventFiles(evt) {
  return evt.target.files || (evt.dataTransfer ? evt.dataTransfer.files : null)
}

function readAsArrayBuffer(file) {
  return readAs(file, 'ArrayBuffer')
}

function readAsDataURI(file) {
  return readAs(file, 'DataURL')
}

function readAs(file, type) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = () => reject(reader.error)
    reader.onloadend = () => resolve(reader.result)

    reader['readAs' + type](file)
  })
}
