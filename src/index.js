import urlMapper from 'url-mapper';
import hashchangeSupport from './hashchangeSupport.js';
import nextTick from 'next-tick';
import querystring from 'querystring';

//A function that creates a middleware that functions as a "router" that maps urls to actions or actionCreators
export default function router(routes, opts){
  let options = {
    hash:true,
    fireInitial:false,
    urlChangeActionType:'urlChange',
    urlChangeActionProperty:'url',
    ...opts
  };

  let urlActionMap, urlChangeSupport;
  if(options.hash){
    urlChangeSupport = hashchangeSupport;
  }
  else{
    throw new Error('Only hashchangeSupport available presently');
  }
  urlChangeSupport.reset();
  const mapper = urlMapper({});

  urlActionMap = routes;

  const middleware = (store) => {

    function onChange(url){
      if(!url){
        return;
      }
      const [path, query] = url.split('?');
      const matched = mapper.map(path, urlActionMap);
      if(matched){
        let {route, match, values} = matched;
        if(query){
          const parsedQuery = querystring.parse(query);
          values = {
            ...parsedQuery,
            ...values
          };
        }
        if(typeof match === 'function'){
          const actionCreatorResult = match(values);
          store.dispatch(actionCreatorResult);
        }else{
          store.dispatch({...values, type:match});
        }
      }
    }
    urlChangeSupport.removeAllListeners('change');
    urlChangeSupport.on('change', onChange);

    if(options.fireInitial){
      nextTick(()=>{
        onChange(urlChangeSupport.value);
      });
    }

    return next => action => {
      //Run the action, then change the URL if we had one that matched.
      const result = next(action);
      if(action.type){
        if(action.type === options.urlChangeActionType){
          urlChangeSupport.value = action[options.urlChangeActionProperty];
        }
      }
      return result;
    };
  };

  return middleware;
}
