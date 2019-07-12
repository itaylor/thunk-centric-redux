import urlMapper from 'url-mapper';
import querystring from 'querystring';
import hashchangeSupport from './hashchangeSupport.js';

let urlSupport;

export default function createActionRouterMiddleware(routes, opts) {
  const options = {
    dispatcher,
    actionHandler,
    urlSupport: hashchangeSupport,
    ...opts,
  };
  if (urlSupport) {
    urlSupport.cleanUp();
  }

  const urlActionMap = routes;
  const mapper = urlMapper({});

  const middleware = (store) => {
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
          values = {
            ...parsedQuery,
            ...values,
          };
        }
        options.dispatcher(store, match, values, path);
      }
    }
    urlSupport = options.urlSupport(onChange);
    return next => action => options.actionHandler(store, next, action);
  };
  return middleware;
}

export function processCurrentUrl() {
  return urlSupport.processUrl();
}

export function actionHandler(store, next, action) {
  if (action && action.type === 'setUrl') {
    urlSupport.setUrl(action.url);
  } else if (action && action.type === 'setUrlRoute') {
    urlSupport.setUrl(action.url);
    processCurrentUrl();
  }
  return next(action);
}

export function dispatcher(store, match, values, path) {
  store.dispatch({ type: 'urlChange', values, path });
  const typeOfMatch = typeof match;
  if (typeOfMatch === 'function') {
    const actionCreatorResult = match(values);
    store.dispatch(actionCreatorResult);
  } else {
    throw new Error('Routes must be to action creator functions');
  }
}
