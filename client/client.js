$(document).on('ready', function() {
  var socket = io.connect();

  socket.on('validate', function (data) {
    console.log(data);
  });

  socket.on('execute', function (data) {
  	console.log(data);
  });

  socket.on('done', function (data) {
  	console.log('OUTPUT: ' + data);
  });

  //click botao Send
  $("#dang").on('click', function() {
  	socket.emit('flowchart', $("#jsontext").val());
  });

  //click botao Execute
  $("#btnExecute").on('click', function() {
    socket.emit('execute', $("#jsontext").val());
  });
});