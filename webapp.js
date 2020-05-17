const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 8080;

const audit = require('./audit');
const serial = require('./serial');
const datastore = require('./datastore')

http.listen(port); // app.listen does *not* work, because of socket.io
app.use('/', express.static(__dirname));
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/static/index.html');
});

io.on('connection', (socket) => {
  audit.message('socket connected from ' + socket.handshake.address);

  socket.on('setDoorLock', function(cmd) {
    audit.message('socket message: setDoorLock ' + cmd);
    serial.sendToSerial(cmd);
  });

  socket.on('lockAllDoors', function(){
    audit.message('socket message: lockAllDoors');
    serial.sendToSerial("D1L\r\nD2L");
  });

  socket.on('addTag', function(tag, priority) {
    audit.message('socket message: addTag ' + tag + ' ' + priority)
    datastore.insertTag(tag, priority);
  });

  socket.on('getStatus', function() {
    audit.message('socket message: getStatus');
    serial.sendToSerial("ST");
 });
});

module.exports.io = io;
module.exports.sendStatus = function(status) {
  io.sockets.emit('doorState1', status.doorState1);
  io.sockets.emit('doorState2', status.doorState2);
  io.sockets.emit('lastStatusTime', status.lastStatusTime);
}

io.sockets.emit('doorState1', 1);
