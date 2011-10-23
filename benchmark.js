var profile = require('v8-profiler');
var io = require('socket.io-client');

var message = "o bispo de constantinopla nao quer se desconstantinopolizar";

function user(shouldBroadcast) {
  var socket = io.connect('http://localhost:3000', {'force new connection': true});

  socket.on('connect', function() {
    
    // Start messaging loop
    if (shouldBroadcast) {
      // message will be broadcasted by server
      socket.emit('broadcast', message);
    } else {
      // message will be echoed by server
      socket.send(message);
    }

    socket.on('message', function(message) {
      socket.send(message);    
    });

    socket.on('broadcastOk', function() {
      socket.emit('broadcast', message);
    });
  });
};

var argvIndex = 2;

var users = parseInt(process.argv[argvIndex++]);
var rampUpTime = parseInt(process.argv[argvIndex++]) * 1000; // in seconds
var newUserTimeout = rampUpTime / users;
var shouldBroadcast = process.argv[argvIndex++] === 'broadcast' ? true : false;

for(var i=0; i<parseInt(process.argv[2]); i++) {
  setTimeout(function() { user(shouldBroadcast); }, i * newUserTimeout);
};
