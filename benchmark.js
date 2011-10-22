// import required modules
var io = require('socket.io-client');

var message = "o bispo de constantinopla nao quer se desconstantinopolizar";

function user() {
  var socket = io.connect('http://localhost:3000', {'force new connection': true});

  socket.on('connect', function() {
    // send loop message
    socket.send(message);

    socket.on('message', function(message) {
      socket.send(message);    
    });
  });
};

var users = parseInt(process.argv[2]);
var rampUpTime = parseInt(process.argv[3]) * 1000; // in seconds
var newUserTimeout = rampUpTime / users;

for(var i=0; i<parseInt(process.argv[2]); i++) {
  setTimeout(user, i * newUserTimeout);
};
