'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = router;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _urlMapper = require('url-mapper');

var _urlMapper2 = _interopRequireDefault(_urlMapper);

var _hashchangeSupportJs = require('./hashchangeSupport.js');

var _hashchangeSupportJs2 = _interopRequireDefault(_hashchangeSupportJs);

var _nextTick = require('next-tick');

var _nextTick2 = _interopRequireDefault(_nextTick);

//A function that creates a middleware that functions as a "router" that maps urls to actions

function router(routes) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? { 'hash': true } : arguments[1];

  var urlActionMap = undefined,
      actionUrlMap = undefined,
      urlChangeSupport = undefined;
  if (options.hash) {
    urlChangeSupport = _hashchangeSupportJs2['default'];
  } else {
    throw new Error('Only hashchangeSupport available presently');
  }

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
      url = hashOnly(url);

      var _mapper$map = mapper.map(url, urlActionMap);

      var route = _mapper$map.route;
      var match = _mapper$map.match;
      var values = _mapper$map.values;

      if (match) {
        var newAction = Object.assign({}, values || {}, { type: match });
        store.dispatch(newAction);
      }
    }

    urlChangeSupport.on('change', onChange);

    (0, _nextTick2['default'])(function () {
      onChange(window.location.href);
    });

    return function (next) {
      return function (action) {
        //Run the action, then change the URL if we had one that matched.
        var result = next(action);
        if (action.type) {
          var matchedUrl = actionUrlMap[action.type];
          if (matchedUrl) {
            var newHash = mapper.stringify(matchedUrl, action);
            var newUrlValue = removeHash(urlChangeSupport.value) + '#' + newHash;
            urlChangeSupport.value = newUrlValue;
          }
        }
        return result;
      };
    };
  };
  return middleware;
}

function hashOnly(url) {
  return url.replace(/.*?\#/, '');
}

function removeHash(url) {
  return url.replace(/\#.*/, '');
}
module.exports = exports['default'];