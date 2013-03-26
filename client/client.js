$(document).on('ready', function() {
  var socket = io.connect();

  socket.on('validate', function (data) {
    console.log(data);
  })

  $("#dang").on('click', function() {
    socket.emit('flowchart', $("#jsontext").val());
  });
});