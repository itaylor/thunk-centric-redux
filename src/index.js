import urlMapper from 'url-mapper';
import hashchangeSupport from './hashchangeSupport.js';
import nextTick from 'next-tick';

//A function that creates a middleware that functions as a "router" that maps urls to actions or actionCreators
export default function router(routes, opts){
  let options = {
    hash:true,
    urlChangeActionType:'urlChange',
    urlChangeActionProperty:'url',
    ...opts
  }

  let urlActionMap, actionUrlMap, urlChangeSupport;
  if(options.hash){
    urlChangeSupport = hashchangeSupport;
  }
  else{
    throw new Error('Only hashchangeSupport available presently');
  }

  const mapper = urlMapper({});

  urlActionMap = routes;
  actionUrlMap = {};
  Object.keys(routes).forEach((url) => {
    actionUrlMap[routes[url]] = url;
  });

  const middleware = (store) => {

    function onChange(url){
      if(!url){
        return;
      }
      const matched = mapper.map(url, urlActionMap);
      if(matched){
        const {route, match, values} = matched;
        if(typeof match === 'function'){
          let actionCreatorResult = match(values);
          store.dispatch(actionCreatorResult);
        }else{
          store.dispatch({...values, type:match});
        }
      }
    }
    urlChangeSupport.removeAllListeners('change');
    urlChangeSupport.on('change', onChange);

    nextTick(()=>{
      onChange(window.location.href);
    });

    return next => action => {
      //Run the action, then change the URL if we had one that matched.
      const result = next(action);
      if(action.type){
        if(action.type === options.urlChangeActionType){
          urlChangeSupport.value = action[options.urlChangeActionProperty];
        }else{
          const matchedUrl = actionUrlMap[action.type];
          if(matchedUrl){
            const newHash = mapper.stringify(matchedUrl, action);
            urlChangeSupport.value = newHash;
          }
        }
      }
      return result;
    }
  }

  return middleware;
}
