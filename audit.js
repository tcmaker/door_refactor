const webapp = require('./webapp')
module.exports.message = function(text) {
  console.log(text);
  webapp.io.sockets.emit('conmsg', text + '\r\n');
}
