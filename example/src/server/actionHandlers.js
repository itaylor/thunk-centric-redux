// This is representative of some actual data source.
// For example purposes it's just records in server memory.
const records = {};

module.exports = {
  getRecord,
  setRecord,
  ioPromiseFetch,
};

function getRecord(socket, { id }, respondFn) {
  respondFn({ type: 'getRecord', data: records[id] });
}

function setRecord(socket, { id, data }, respondFn) {
  records[id] = data;
  respondFn({ type: 'setRecord', data: records[id] });
}

function ioPromiseFetch(socket, { withError = false }, respondFn) {
  if (withError) {
    respondFn({ type: randChoice(errorCodes) });
  } else {
    respondFn({ type: 'ioPromiseFetch', data: randChoice(successData) });
  }
}

function randChoice(items) {
  return items[Math.floor(Math.random() * items.length)];
}

const errorCodes = [
  'coreDumped',
  'modemLineBusyPleaseRedial',
  'stackShuffled',
  'serverMelting',
  'missedGarbageCollectionDay',
  'buffersTooBuffed',
  'floppyDriveFailedError40',
];

const successData = [
  'all splines reticulated',
  'hard disk format complete!',
  'all buffers successfully buffed',
  'scandisk completed, no errors found',
  'MS-DOS is resident in the high memory area',
  'Himem.sys successfully loaded',
];
