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

  var urlDispatchMap = undefined,
      actionUrlMap = undefined,
      urlChangeSupport = undefined;
  if (options.hash) {
    urlChangeSupport = _hashchangeSupportJs2['default'];
  } else {
    throw new Error('Only hashchangeSupport available presently');
  }

  function changeUrl(key, action) {
    var newHash = key;
    Object.keys(action).forEach(function (actionProp) {
      newHash = newHash.replace(':' + actionProp, '' + action[actionProp]);
    });
    var newValue = removeHash(urlChangeSupport.value) + '#' + newHash;
    urlChangeSupport.value = newValue;
    return newValue;
  }

  var middleware = function middleware(store) {
    urlDispatchMap = routeActionsToRouteFunctions(routes, store);
    actionUrlMap = actionTypesToUrlFunctions(routes, changeUrl);

    urlChangeSupport.on('change', function (url) {
      url = hashOnly(url);
      (0, _urlMapper2['default'])(url, urlDispatchMap);
    });

    (0, _nextTick2['default'])(function () {
      (0, _urlMapper2['default'])(hashOnly(window.location.href), urlDispatchMap);
    });

    return function (next) {
      return function (action) {
        //Run the action, then change the URL if we had one that matched.
        var result = next(action);
        if (action.type) {
          var urlChangeFn = actionUrlMap[action.type];
          if (urlChangeFn) {
            urlChangeFn(action);
          }
        }
        return result;
      };
    };
  };
  return middleware;
}

function routeActionsToRouteFunctions(routes, store) {
  var routeFns = {};
  Object.keys(routes).forEach(function (key) {
    var actionType = routes[key];
    routeFns[key] = function (_ref) {
      var params = _ref.params;

      params.type = actionType;
      store.dispatch(params);
    };
  });
  return routeFns;
}

function actionTypesToUrlFunctions(routes, changeFn) {
  var actionTypeFns = {};
  Object.keys(routes).forEach(function (key) {
    var val = routes[key];
    actionTypeFns[val] = changeFn.bind(null, key);
  });
  return actionTypeFns;
}

function hashOnly(url) {
  return url.replace(/.*?\#/, '');
}

function removeHash(url) {
  return url.replace(/\#.*/, '');
}
module.exports = exports['default'];