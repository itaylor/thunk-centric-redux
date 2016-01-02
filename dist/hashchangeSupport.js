'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var currentUrl = window.location.href;
var emitter = new _events.EventEmitter();

window.removeEventListener('hashchange', onChange);
window.addEventListener('hashchange', onChange);

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
    window.location.href = removeHash(currentUrl) + '#' + val;
  }
});

exports['default'] = emitter;

function hashOnly(url) {
  return url.replace(/.*?\#/, '');
}

function removeHash(url) {
  return url.replace(/\#.*/, '');
}
module.exports = exports['default'];