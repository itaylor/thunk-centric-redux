import { EventEmitter } from 'events';

let currentUrl;
const emitter = new EventEmitter();

function onChange(){
  const newUrl = window.location.href;
  if(currentUrl != newUrl){
    currentUrl = newUrl;
    emitter.emit('change',hashOnly(newUrl));
  }
}

Object.defineProperty(emitter, 'value', {
  get:()=>{
    return hashOnly(currentUrl);
  },
  set:(val)=>{
    window.location.href = removeHash(currentUrl) + '#' + hashOnly(val);
  }
});

reset();

function reset(){
  currentUrl = window.location.href;

  window.removeEventListener('hashchange', onChange);
  window.addEventListener('hashchange', onChange);
}
emitter.reset = reset;
export default emitter;

function hashOnly(url){
  return url.replace(/.*?\#/, '');
}

function removeHash(url){
  return url.replace(/\#.*/, '');
}
