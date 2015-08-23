"use strict";

exports.__esModule = true;
exports["default"] = createTargetConnector;

function createTargetConnector(backend) {
  return {
    dropTarget: backend.connectDropTarget.bind(backend)
  };
}

module.exports = exports["default"];