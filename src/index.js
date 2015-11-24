import urlMapper from 'url-mapper';
import hashchangeSupport from './hashchangeSupport.js';
import nextTick from 'next-tick';

//A function that creates a middleware that functions as a "router" that maps urls to actions
export default function router(routes, options={'hash':true}){
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
      url = hashOnly(url);
      const {route, match, values} = mapper.map(url, urlActionMap);
      if(match){
        const newAction = Object.assign({}, values || {}, {type:match});
        store.dispatch(newAction);
      }
    }

    urlChangeSupport.on('change', onChange);

    nextTick(()=>{
      onChange(window.location.href);
    });

    return next => action => {
      //Run the action, then change the URL if we had one that matched.
      const result = next(action);
      if(action.type){
        const matchedUrl = actionUrlMap[action.type];
        if(matchedUrl){
          const newHash = mapper.stringify(matchedUrl, action);
          const newUrlValue = removeHash(urlChangeSupport.value) + '#' + newHash;
          urlChangeSupport.value = newUrlValue;
        }
      }
      return result;
    }
  }
  return middleware;
}

function hashOnly(url){
  return url.replace(/.*?\#/, '');
}

function removeHash(url){
  return url.replace(/\#.*/, '')
}
