'use strict';

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _nippyApiResponse = require('nippy-api-response');

var _nippyApiResponse2 = _interopRequireDefault(_nippyApiResponse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (_apiResponse) {
  (0, _inherits3.default)(Response, _apiResponse);

  function Response(rawJson) {
    (0, _classCallCheck3.default)(this, Response);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Response).call(this));

    _this.requestError = null;
    if (rawJson) {
      _this.setFromRawJson(rawJson);
    }
    return _this;
  }

  (0, _createClass3.default)(Response, [{
    key: 'setFromRawJson',
    value: function setFromRawJson(json) {
      if (json.hasOwnProperty('metas')) (0, _get3.default)((0, _getPrototypeOf2.default)(Response.prototype), 'setMetas', this).call(this, json.metas);
      if (json.hasOwnProperty('source')) (0, _get3.default)((0, _getPrototypeOf2.default)(Response.prototype), 'setSource', this).call(this, json.source);
      if (json.hasOwnProperty('result') && json.hasOwnProperty(json.result)) {
        switch (json.result) {
          case 'success':
            (0, _get3.default)((0, _getPrototypeOf2.default)(Response.prototype), 'setSuccess', this).call(this, json.success);
            break;
          case 'error':
            this.error.code = json.error.code || null;
            this.error.message = json.error.message || null;
            if (json.error.hasOwnProperty('details')) {
              (0, _get3.default)((0, _getPrototypeOf2.default)(Response.prototype), 'setErrorDetails', this).call(this, json.error.details);
            }
            break;
          default:
            throw new Error('Unknown result type ' + json.result);
        }
      }
    }

    // Request error -------------------------------------------------------------

  }, {
    key: 'setRequestError',
    value: function setRequestError(error) {
      this.requestError = error;
    }
  }, {
    key: 'hasRequestError',
    value: function hasRequestError() {
      return this.getRequestError() !== null;
    }
  }, {
    key: 'getRequestError',
    value: function getRequestError() {
      return this.requestError;
    }
  }]);
  return Response;
}(_nippyApiResponse2.default);