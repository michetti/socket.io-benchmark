var io = require('socket.io').listen(3000);

io.configure(function() {
  io.set('log level', 1);
});

var users = 0;
var count = 0;

setInterval(function() {
  var aux = Math.round(count / users)

  var msu = (users > 0 ? aux  : 0);
  var trm = (users > 0 ? Math.round(1000 / aux) : '-');

  var l = [
    'U: ' + users,
    'M/S: ' + count,
    'M/S/U: ' + msu,
    'TR/M: ' + trm,
  ];

  console.log(l.join(', '));
  count = 0;

}, 1000);

io.sockets.on('connection', function(socket) {

  users++;

  socket.on('message', function(message) {
    socket.send(message);
    count++;
  });

  socket.on('disconnect', function() {
    users--;
  })
});
