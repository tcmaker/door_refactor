const webapp = require('./webapp')
module.exports.message = function(text) {
  console.log("BUTTS BUTTS BUTTS");
  console.log(text);
  webapp.io.sockets.emit('conmsg', text + '\r\n');
}
