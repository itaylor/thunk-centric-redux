'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = router;

var _urlMapper = require('url-mapper');

var _urlMapper2 = _interopRequireDefault(_urlMapper);

var _hashchangeSupport = require('./hashchangeSupport.js');

var _hashchangeSupport2 = _interopRequireDefault(_hashchangeSupport);

var _nextTick = require('next-tick');

var _nextTick2 = _interopRequireDefault(_nextTick);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//A function that creates a middleware that functions as a "router" that maps urls to actions or actionCreators
function router(routes, opts) {
  var options = _extends({
    hash: true,
    fireInitial: false,
    urlChangeActionType: 'urlChange',
    urlChangeActionProperty: 'url'
  }, opts);

  var urlActionMap = undefined,
      urlChangeSupport = undefined;
  if (options.hash) {
    urlChangeSupport = _hashchangeSupport2.default;
  } else {
    throw new Error('Only hashchangeSupport available presently');
  }
  urlChangeSupport.reset();
  var mapper = (0, _urlMapper2.default)({});

  urlActionMap = routes;

  var middleware = function middleware(store) {

    function onChange(url) {
      if (!url) {
        return;
      }

      var _url$split = url.split('?');

      var _url$split2 = _slicedToArray(_url$split, 2);

      var path = _url$split2[0];
      var query = _url$split2[1];

      var matched = mapper.map(path, urlActionMap);
      if (matched) {
        var route = matched.route;
        var match = matched.match;
        var values = matched.values;

        if (query) {
          var parsedQuery = _querystring2.default.parse(query);
          values = _extends({}, parsedQuery, values);
        }
        if (typeof match === 'function') {
          var actionCreatorResult = match(values);
          store.dispatch(actionCreatorResult);
        } else {
          store.dispatch(_extends({}, values, { type: match }));
        }
      }
    }
    urlChangeSupport.removeAllListeners('change');
    urlChangeSupport.on('change', onChange);

    if (options.fireInitial) {
      (0, _nextTick2.default)(function () {
        onChange(urlChangeSupport.value);
      });
    }

    return function (next) {
      return function (action) {
        //Run the action, then change the URL if we had one that matched.
        var result = next(action);
        if (action.type) {
          if (action.type === options.urlChangeActionType) {
            urlChangeSupport.value = action[options.urlChangeActionProperty];
          }
        }
        return result;
      };
    };
  };

  return middleware;
}