process.on('unhandledRejection', up => { throw up });

const audit = require('./audit');
const db = require('./datastore');
const serial = require('./serial');
const webapp = require('./webapp');

//audit.message('DO STUFF');

webapp.sendStatus({
  doorState1: 1,
  doorState2: 2,
  lastStatusTime: 'hello',
});
