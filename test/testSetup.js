import {jsdom} from 'jsdom';
const doc = jsdom('<!doctype><html><head><meta charset="utf-8"></head><body></body></html>', {});
const win = doc.defaultView;
const globalKeys = Object.keys(global);

copyToGlobal(win);
global.window = win;

export default window;

function copyToGlobal (window) {
  for (var key in window) {
    if (!window.hasOwnProperty(key)) continue
    if (~globalKeys.indexOf(key)) continue
    if (key in global) continue
    global[key] = window[key]
  }
}
