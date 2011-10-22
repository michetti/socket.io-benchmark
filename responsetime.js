// import required modules
var io = require('socket.io-client');

var message = "o bispo de constantinopla nao quer se desconstantinopolizar";

function user() {
  var start = new Date();

  var socket = io.connect('http://localhost:3000', {'force new connection': true});

  socket.on('connect', function() {
    // send loop message
    socket.send(message);

    socket.on('message', function(message) {
      console.log(new Date() - start)
      start = new Date();
      socket.send(message);
    });
  });
};

user()
