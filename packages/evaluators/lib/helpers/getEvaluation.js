"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _difference2 = _interopRequireDefault(require("lodash/difference"));

var _includes2 = _interopRequireDefault(require("lodash/includes"));

var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));

var _constants = require("@edulastic/constants");

var getEvaluation = function getEvaluation(response, answers, rightIndex, compareFunction) {
  var evaluation = [];
  response.forEach(function(item, i) {
    switch (compareFunction) {
      case _constants.evaluatorTypes.INNER_DIFFERENCE:
        evaluation[i] =
          (0, _difference2.default)(answers[rightIndex].value[i], item).length === 0 &&
          (0, _difference2.default)(item, answers[rightIndex].value[i]).length === 0;
        break;

      case _constants.evaluatorTypes.IS_EQUAL:
        evaluation[i] = (0, _isEqual2.default)(answers[rightIndex].value[i], item);
        break;

      default:
        evaluation[i] = (0, _includes2.default)(answers[rightIndex].value, item);
        break;
    }
  });
  return evaluation;
};

var _default = getEvaluation;
exports.default = _default;
