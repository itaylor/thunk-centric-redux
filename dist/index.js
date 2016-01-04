'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = router;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _urlMapper = require('url-mapper');

var _urlMapper2 = _interopRequireDefault(_urlMapper);

var _hashchangeSupportJs = require('./hashchangeSupport.js');

var _hashchangeSupportJs2 = _interopRequireDefault(_hashchangeSupportJs);

var _nextTick = require('next-tick');

var _nextTick2 = _interopRequireDefault(_nextTick);

//A function that creates a middleware that functions as a "router" that maps urls to actions or actionCreators

function router(routes, opts) {
  var options = _extends({
    hash: true,
    fireInitial: false,
    urlChangeActionType: 'urlChange',
    urlChangeActionProperty: 'url'
  }, opts);

  var urlActionMap = undefined,
      actionUrlMap = undefined,
      urlChangeSupport = undefined;
  if (options.hash) {
    urlChangeSupport = _hashchangeSupportJs2['default'];
  } else {
    throw new Error('Only hashchangeSupport available presently');
  }
  urlChangeSupport.reset();
  var mapper = (0, _urlMapper2['default'])({});

  urlActionMap = routes;
  actionUrlMap = {};
  Object.keys(routes).forEach(function (url) {
    actionUrlMap[routes[url]] = url;
  });

  var middleware = function middleware(store) {

    function onChange(url) {
      if (!url) {
        return;
      }
      var matched = mapper.map(url, urlActionMap);
      if (matched) {
        var route = matched.route;
        var match = matched.match;
        var values = matched.values;

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
      (0, _nextTick2['default'])(function () {
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
          } else {
            var matchedUrl = actionUrlMap[action.type];
            if (matchedUrl) {
              var newHash = mapper.stringify(matchedUrl, action);
              urlChangeSupport.value = newHash;
            }
          }
        }
        return result;
      };
    };
  };

  return middleware;
}

module.exports = exports['default'];