import urlMapper from 'url-mapper';
import hashchangeSupport from './hashchangeSupport.js';
import nextTick from 'next-tick';

//A function that creates a middleware that functions as a "router" that maps urls to actions
export default function router(routes, options={'hash':true}){
  let urlDispatchMap, actionUrlMap, urlChangeSupport;
  if(options.hash){
    urlChangeSupport = hashchangeSupport;
  }
  else{
    throw new Error('Only hashchangeSupport available presently');
  }

  function changeUrl(key, action) {
    let newHash = key;
    Object.keys(action).forEach((actionProp) => {
      newHash = newHash.replace(':'+actionProp, ''+action[actionProp]);
    });
    const newValue = urlChangeSupport.value.replace(/\#.*/, '') + '#' + newHash;
    urlChangeSupport.value = newValue;
    return newValue;
  }

  const middleware = (store) => {
    urlDispatchMap = routeActionsToRouteFunctions(routes, store);
    actionUrlMap = actionTypesToUrlFunctions(routes, changeUrl);

    urlChangeSupport.on('change', (url) => {
      url = url.replace(/.*?\#/, '');
      urlMapper(url, urlDispatchMap);
    });

    let href = window.location.href;
    nextTick(()=>{
      urlMapper(href, urlDispatchMap);
    })

    return next => action => {
      //Run the action, then change the URL if we had one that matched.
      const result = next(action);
      if(action.type){
        const urlChangeFn = actionUrlMap[action.type];
        if(urlChangeFn){
          urlChangeFn(action);
        }
      }
      return result;
    }
  }
  return middleware;
}

function routeActionsToRouteFunctions(routes, store){
  const routeFns = {};
  Object.keys(routes).forEach((key)=>{
    const actionType = routes[key];
    routeFns[key] = ({params}) => {
      params.type = actionType;
      store.dispatch(params);
    }
  });
  return routeFns;
}

function actionTypesToUrlFunctions(routes, changeFn){
  const actionTypeFns = {};
  Object.keys(routes).forEach((key)=>{
    const val = routes[key];
    actionTypeFns[val] = changeFn.bind(null, key);
  });
  return actionTypeFns;
}
