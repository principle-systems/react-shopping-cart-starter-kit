'use strict';

exports.__esModule = true;
exports['default'] = registerSource;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function registerSource(type, source, manager) {
  var registry = manager.getRegistry();
  var sourceId = registry.addSource(type, source);

  function unregisterSource() {
    registry.removeSource(sourceId);
  };

  return {
    handlerId: sourceId,
    unregister: unregisterSource
  };
}

module.exports = exports['default'];