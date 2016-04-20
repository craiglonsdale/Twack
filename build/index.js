'use strict';

var _slackNode = require('slack-node');

var Slack = _interopRequireWildcard(_slackNode);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

module.exports = function (config) {
  console.log(config);
  var slack = new Slack(config);
};