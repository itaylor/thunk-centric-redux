import { EventEmitter } from 'events';

let currentUrl = window.location.href;
const emitter = new EventEmitter();

window.removeEventListener('hashchange', onChange);
window.addEventListener('hashchange', onChange);

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
    window.location.href = removeHash(currentUrl) + '#' + val;
  }
});

export default emitter;

function hashOnly(url){
  return url.replace(/.*?\#/, '');
}

function removeHash(url){
  return url.replace(/\#.*/, '')
}
