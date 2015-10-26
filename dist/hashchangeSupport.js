'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var currentUrl = window.location.href;
var emitter = new _events.EventEmitter();

window.addEventListener('hashchange', onChange);

function onChange() {
  var newUrl = window.location.href;
  if (currentUrl != newUrl) {
    currentUrl = newUrl;
    emitter.emit('change', newUrl);
  }
}

Object.defineProperty(emitter, 'value', {
  get: function get() {
    return currentUrl;
  },
  set: function set(val) {
    window.location.href = val;
  }
});

exports['default'] = emitter;
module.exports = exports['default'];