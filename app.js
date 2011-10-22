var io = require('socket.io').listen(3000);
var exec = require('child_process').exec; 

io.configure(function() {
  io.set('log level', 1);

  var transport = process.argv.length >= 2 ? process.argv[2] : null;
  if (transport) {
    io.set('transports', [transport]);
  }
});

// command to read process consumed memory and cpu time
var getCpuCommand = "ps -p " + process.pid + " -u | grep " + process.pid;

var users = 0;
var count = 0;

function roundNumber(num, precision) {
  return parseFloat(Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision));
}

setInterval(function() {
  var aux = roundNumber(count / users, 2)

  var msu = (users > 0 ? aux : 0);
  var trm = (users > 0 ? roundNumber(1000 / aux, 2) : '-');

  // call a system command (ps) to get current process resources utilization
  var child = exec(getCpuCommand, function(error, stdout, stderr) {
    var s = stdout.split(/\s+/);
    var cpu = s[2];
    var memory = s[3];

    var l = [
      'U: ' + users,
      'M/S: ' + count,
      'M/S/U: ' + msu,
      'RT: ' + trm,
      'CPU: ' + cpu,
      'Mem: ' + memory
    ];

    console.log(l.join(', '));
    count = 0;
  });

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
