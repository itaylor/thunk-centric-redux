// This is representative of some actual data source.
// For example purposes it's just records in server memory.
const records = {};

module.exports = {
  getRecord,
  setRecord,
};

function getRecord(socket, { id }, respondFn) {
  respondFn({ type: 'getRecord', data: records[id] });
}

function setRecord(socket, { id, data }, respondFn) {
  records[id] = data;
  respondFn({ type: 'setRecord', data: records[id] });
}
