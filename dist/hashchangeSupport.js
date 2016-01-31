'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var currentUrl = undefined;
var emitter = new _events.EventEmitter();

function onChange() {
  var newUrl = window.location.href;
  if (currentUrl != newUrl) {
    currentUrl = newUrl;
    emitter.emit('change', hashOnly(newUrl));
  }
}

Object.defineProperty(emitter, 'value', {
  get: function get() {
    return hashOnly(currentUrl);
  },
  set: function set(val) {
    window.location.href = removeHash(currentUrl) + '#' + hashOnly(val);
  }
});

reset();

function reset() {
  currentUrl = window.location.href;

  window.removeEventListener('hashchange', onChange);
  window.addEventListener('hashchange', onChange);
}
emitter.reset = reset;
exports.default = emitter;

function hashOnly(url) {
  return url.replace(/.*?\#/, '');
}

function removeHash(url) {
  return url.replace(/\#.*/, '');
}