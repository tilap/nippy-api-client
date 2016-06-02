'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _response = require('./response');

var _response2 = _interopRequireDefault(_response);

var _errors = require('./errors');

var _errors2 = _interopRequireDefault(_errors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  function ApiClient() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$endpoint = _ref.endpoint;
    var endpoint = _ref$endpoint === undefined ? '' : _ref$endpoint;
    var _ref$token = _ref.token;
    var token = _ref$token === undefined ? null : _ref$token;
    (0, _classCallCheck3.default)(this, ApiClient);

    this.endpoint = endpoint;
    this.token = token;
    this.onEvents = {
      requestError: [],
      responseError: [],
      processingStart: [],
      processingStop: [],
      processingIncrease: [],
      processingDecrease: []
    };
    this.processing = 0;
  }

  (0, _createClass3.default)(ApiClient, [{
    key: 'isProcessing',
    value: function isProcessing() {
      return this.processing > 0;
    }
  }, {
    key: 'increaseProcessing',
    value: function increaseProcessing() {
      if (this.processing === 0) {
        this.emit('processingStart');
      }
      this.processing++;
      this.emit('processingIncrease', this.processing);
    }
  }, {
    key: 'decreseProcessing',
    value: function decreseProcessing() {
      this.processing--;
      this.emit('processingDecrease', this.processing);
      if (this.processing === 0) {
        this.emit('processingStop');
      }
    }
  }, {
    key: 'setToken',
    value: function setToken(token) {
      if (token) {
        this.token = token;
      } else {
        this.resetToken();
      }
      return this;
    }
  }, {
    key: 'hasToken',
    value: function hasToken() {
      return this.getToken() !== null;
    }
  }, {
    key: 'getToken',
    value: function getToken() {
      return this.token;
    }
  }, {
    key: 'resetToken',
    value: function resetToken() {
      this.token = null;
      return this;
    }
  }, {
    key: 'removeToken',
    value: function removeToken() {
      this.token = null;
      return this;
    }
  }, {
    key: 'on',
    value: function on(event, cb) {
      if (!this.onEvents.hasOwnProperty(event)) throw new Error('Unknown event ' + event);
      this.onEvents[event].push(cb);
    }
  }, {
    key: 'emit',
    value: function emit(event) {
      var value = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      if (this.onEvents.hasOwnProperty(event)) {
        this.onEvents[event].forEach(function (cb) {
          return cb(value);
        });
      }
    }
  }, {
    key: 'get',
    value: function get() {
      var path = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
      var args = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return this.run({ path: path, args: args, method: 'GET' });
    }
  }, {
    key: 'post',
    value: function post() {
      var path = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
      var args = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var data = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      return this.run({ path: path, args: args, data: data, method: 'POST' });
    }
  }, {
    key: 'patch',
    value: function patch() {
      var path = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
      var args = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var data = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      return this.run({ path: path, args: args, data: data, method: 'PATCH' });
    }
  }, {
    key: 'delete',
    value: function _delete() {
      var path = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
      var args = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return this.run({ path: path, args: args, method: 'DELETE' });
    }
  }, {
    key: 'buildFullUrl',
    value: function buildFullUrl(path) {
      var args = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var url = '' + this.endpoint + path;

      var query = '';
      if (this.hasToken()) {
        args.access_token = this.getToken();
      }
      if (args && (0, _keys2.default)(args).length > 0) {
        (0, _keys2.default)(args).forEach(function (key) {
          return query += key + '=' + args[key] + '&';
        });
      }

      if (query !== '') {
        url += '?' + query;
      }
      return url;
    }
  }, {
    key: 'buildOptions',
    value: function buildOptions() {
      var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _ref2$method = _ref2.method;
      var method = _ref2$method === undefined ? 'GET' : _ref2$method;
      var _ref2$data = _ref2.data;
      var data = _ref2$data === undefined ? {} : _ref2$data;

      var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      if (this.hasToken()) {
        headers['jwt-token'] = this.getToken();
      }

      var options = { mode: 'cors', cache: 'default', method: method, headers: headers };
      if ((0, _keys2.default)(data).length > 0) {
        options.body = (0, _stringify2.default)(data);
      }

      return options;
    }
  }, {
    key: 'run',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var _ref3 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var _ref3$path = _ref3.path;
        var path = _ref3$path === undefined ? '' : _ref3$path;
        var _ref3$args = _ref3.args;
        var args = _ref3$args === undefined ? {} : _ref3$args;
        var _ref3$data = _ref3.data;
        var data = _ref3$data === undefined ? {} : _ref3$data;
        var _ref3$method = _ref3.method;
        var method = _ref3$method === undefined ? 'GET' : _ref3$method;
        var url, options, response, fetchResponse, rawRes;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                url = this.buildFullUrl(path, args);
                options = this.buildOptions({ method: method, data: data });
                response = new _response2.default();
                fetchResponse = null;
                rawRes = null;


                this.increaseProcessing();

                _context.prev = 6;
                _context.next = 9;
                return fetch(url, options);

              case 9:
                fetchResponse = _context.sent;

                if (fetchResponse.ok) {
                  _context.next = 12;
                  break;
                }

                throw new Error('Invalid response');

              case 12:
                _context.next = 18;
                break;

              case 14:
                _context.prev = 14;
                _context.t0 = _context['catch'](6);

                console.log('fetch connexion error', _context.t0);
                response.setRequestError(new Error(_errors2.default.CONNECT));

              case 18:
                if (response.hasRequestError()) {
                  _context.next = 29;
                  break;
                }

                _context.prev = 19;
                _context.next = 22;
                return fetchResponse.json();

              case 22:
                rawRes = _context.sent;
                _context.next = 29;
                break;

              case 25:
                _context.prev = 25;
                _context.t1 = _context['catch'](19);

                console.log('fetch toJson error', _context.t1);
                response.setRequestError(new Error(_errors2.default.FORMAT));

              case 29:

                if (!response.hasRequestError() && rawRes) {
                  try {
                    response.setFromRawJson(rawRes);
                  } catch (err) {
                    console.log('fetch setFromRawJson error', err);
                    response.setRequestError(new Error(_errors2.default.FORMAT));
                  }
                }

                if (!response.hasRequestError()) {
                  _context.next = 34;
                  break;
                }

                this.emit('requestError', response.getRequestError());
                this.decreseProcessing();
                throw response;

              case 34:
                if (!response.isError()) {
                  _context.next = 38;
                  break;
                }

                this.emit('responseError', response.getError());
                this.decreseProcessing();
                throw response;

              case 38:

                this.decreseProcessing();
                return _context.abrupt('return', response);

              case 40:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[6, 14], [19, 25]]);
      }));

      function run(_x15) {
        return ref.apply(this, arguments);
      }

      return run;
    }()
  }]);
  return ApiClient;
}();