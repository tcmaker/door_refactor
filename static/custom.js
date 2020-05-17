var socket = io();

function setDoorLock(door, state) {
    var cmd = "D" + door + state;
    socket.emit('setDoorLock', cmd);
}

function lockAllDoors() {
    socket.emit('lockAllDoors');
}

function addTag(tag, priority) {
    socket.emit('addTag', tag, priority);
}

function getStatus() {
    socket.emit('getStatus');
}

function updateConsole(text) {
  $('#conmsg').append('one');
}

jQuery(function() {
  getStatus();

  socket.on('conmsg', function(text) {
      $('#conmsg').append(text);
  });

  socket.on('doorState1', function(text) {
    if (text == '1') {
        jQuery('#door1').removeClass('list-group-item-success').addClass('list-group-item-danger').html('Front Door is <strong>LOCKED</strong>');
    } else {
        jQuery('#door1').removeClass('list-group-item-danger').addClass('list-group-item-success').html('Front Door is <strong>UNLOCKED</strong>');
    }
  });

  socket.on('doorState2', function(text) {
     if (text == '1') {
         jQuery('#door2').removeClass('list-group-item-success').addClass('list-group-item-danger').html('Front Door is <strong>LOCKED</strong>');
     } else {
         jQuery('#door2').removeClass('list-group-item-danger').addClass('list-group-item-success').html('Front Door is <strong>UNLOCKED</strong>');
     }
  });

  //// Sidenav ////
  jQuery('#FrontDoorLock').on('click', function(e) {
    e.preventDefault();
    setDoorLock(1, 'L');
  });

  jQuery('#FrontDoorUnlock').on('click', function(e) {
    e.preventDefault();
    setDoorLock(1, 'U');
  });

  jQuery('#SideDoorLock').on('click', function(e) {
    e.preventDefault();
    setDoorLock(2, 'L');
  });

  jQuery('#SideDoorUnlock').on('click', function(e) {
    e.preventDefault();
    setDoorLock(2, 'U');
  });

  $('#addTag').on('submit', function(e) {
    e.preventDefault();
    var tag = $('#tag').val().replace(/^0+/g);
    var priority = $('#priority').val();
    addTag(tag, priority);
  });
});
