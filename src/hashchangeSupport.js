import { EventEmitter } from 'events';

let currentUrl = window.location.href;
const emitter = new EventEmitter();

window.addEventListener('hashchange', onChange);

function onChange(){
  const newUrl = window.location.href;
  if(currentUrl != newUrl){
    currentUrl = newUrl;
    emitter.emit('change',newUrl);
  }
}

Object.defineProperty(emitter, 'value', {
  get:()=>{
    return currentUrl;
  },
  set:(val)=>{
    window.location.href=val;
  }
});

export default emitter;
