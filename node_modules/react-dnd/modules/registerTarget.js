'use strict';

exports.__esModule = true;
exports['default'] = registerTarget;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function registerTarget(type, target, manager) {
  var registry = manager.getRegistry();
  var targetId = registry.addTarget(type, target);

  function unregisterTarget() {
    registry.removeTarget(targetId);
  };

  return {
    handlerId: targetId,
    unregister: unregisterTarget
  };
}

module.exports = exports['default'];