import React from 'react';
import PropTypes from 'prop-types';

const CollapsrCanvas = ({ onCanvasReady }) =>
  <canvas className={'faller'} ref={canvas => onCanvasReady(canvas)} />;

CollapsrCanvas.propTypes = {
  onCanvasReady: PropTypes.func.isRequired
};

export default CollapsrCanvas;
