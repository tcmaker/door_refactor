const COVID_19_USE_EFFECTIVE_PRIORITY=true;
// covid 19 temporary priority table was create with this DDL:
//
//  CREATE TABLE IF NOT EXISTS covid_access_restrictions (
//    effective_priority INTEGER NOT NULL,
//    tagnumber INTEGER NOT NULL
//  );

const audit = require('./audit');
const serial = require('./serial');

const sqlite3 = require('sqlite3');    // remove '.verbose()' to deactivate debug messages
var db = new sqlite3.Database("/opt/doors/doors.sqlite"); // opens the database

module.exports.getPriority = function(commandValue, doorNumber) {
  priorityOrZero = `SELECT priority FROM tags WHERE tagnumber = ? AND priority > 1
                      UNION
                      SELECT effective_priority AS priority FROM covid_access_restrictions WHERE tagnumber = ? AND effective_priority > 0
                      UNION
                      SELECT 0 AS priority
                      ORDER BY priority DESC
                      LIMIT 1;`;
  db.get(priorityOrZero, commandValue, commandValue, function(err, row) {
    serial.sendToSerial("D" + doorNumber + "P" + row.priority);
    msg = row.priority ? "Found tag: " : "ERR NO_TAG: "
    audit.message(msg + commandValue);
  });
};

module.exports.logActivity = function(commandValue) {
  db.run("INSERT INTO activity (tagnumber) VALUES (?)", commandValue, function(err) {
    if (err == null) { return; }
    audit.message("ERR sqlite: " + err);
  });
}

module.exports.insertTag = function(tag, priority) {
  db.run("INSERT OR REPLACE INTO tags VALUES (?, ?);", tag, priority, function(err){
    if (err == null) {
      audit.message("sqlite: OK");
    } else {
      audit.message("ERR sqlite: " + err);
    }
  });
};




// If '.verbose()' is set on the sqlite3 library load, this event will fire when a query is sent
db.on('trace', function (sqlstring) {
  console.log(sqlstring);
});
