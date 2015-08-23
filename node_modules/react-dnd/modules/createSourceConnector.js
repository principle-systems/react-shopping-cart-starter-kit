"use strict";

exports.__esModule = true;
exports["default"] = createSourceConnector;

function createSourceConnector(backend) {
  return {
    dragSource: backend.connectDragSource.bind(backend),
    dragPreview: backend.connectDragPreview.bind(backend)
  };
}

module.exports = exports["default"];