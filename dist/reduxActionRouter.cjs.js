'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var urlMapper = _interopDefault(require('url-mapper'));
var querystring = _interopDefault(require('querystring'));

/* global window */
let skipNext = 0;
function init(onChange) {
  skipNext = 0;
  window.addEventListener('hashchange', onHashChange);
  window.addEventListener('click', onClick);

  function onClick({ target }) {
    if (target && target.getAttribute) {
      const clickCurrentUrl = target.getAttribute('href') === window.location.hash;
      if (clickCurrentUrl) {
        processUrl();
      }
    }
  }

  function onHashChange() {
    if (skipNext) {
      skipNext--;
      return null;
    }
    return processUrl();
  }

  function processUrl() {
    return onChange(hashOnly(window.location.href));
  }

  function cleanUp() {
    window.removeEventListener('hashchange', onHashChange);
    window.removeEventListener('click', onClick);
  }

  return {
    setUrl(url) {
      const loc = window.location.href;
      const newUrl = `${removeHash(loc)}#${hashOnly(url)}`;
      if (newUrl !== loc) {
        skipNext++;
        window.location.href = newUrl;
      }
    },
    processUrl,
    cleanUp
  };
}

function hashOnly(url) {
  return url.replace(/.*?#/, '');
}

function removeHash(url) {
  return url.replace(/#.*/, '');
}

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

let urlSupport;

function createActionRouterMiddleware(routes, opts) {
  const options = _extends({
    dispatcher,
    actionHandler,
    urlSupport: init
  }, opts);
  if (urlSupport) {
    urlSupport.cleanUp();
  }

  const urlActionMap = routes;
  const mapper = urlMapper({});

  const middleware = store => {
    function onChange(url) {
      if (!url) {
        return;
      }
      const [path, query] = url.split('?');
      const matched = mapper.map(path, urlActionMap);
      if (matched) {
        let { values } = matched;
        const { match } = matched;
        if (query) {
          const parsedQuery = querystring.parse(query);
          values = _extends({}, parsedQuery, values);
        }
        options.dispatcher(store, match, values, path);
      }
    }
    urlSupport = options.urlSupport(onChange);
    return next => action => options.actionHandler(store, next, action);
  };
  return middleware;
}

function processCurrentUrl() {
  return urlSupport.processUrl();
}

function actionHandler(store, next, action) {
  if (action && action.type === 'setUrl') {
    urlSupport.setUrl(action.url);
  } else if (action && action.type === 'setUrlRoute') {
    urlSupport.setUrl(action.url);
    processCurrentUrl();
  }
  return next(action);
}

function dispatcher(store, match, values, path) {
  store.dispatch({ type: 'urlChange', values, path });
  const typeOfMatch = typeof match;
  if (typeOfMatch === 'function') {
    const actionCreatorResult = match(values);
    store.dispatch(actionCreatorResult);
  } else {
    throw new Error('Routes must be to action creator functions');
  }
}

exports.default = createActionRouterMiddleware;
exports.processCurrentUrl = processCurrentUrl;
exports.actionHandler = actionHandler;
exports.dispatcher = dispatcher;
