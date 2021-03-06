var express = require('express'), 
    app = express(),
    http = require('http'),
    socketIo = require('socket.io');

var server = http.createServer(app);
var io = socketIo.listen(server);
server.listen(8080);
console.log("Server running on 127.0.0.1:8080");

var line_history = [];

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
   for (var i in line_history) {
      socket.emit('draw_line', { line: line_history[i] } );
   }
   socket.on('draw_line', function (data) {
      line_history.push(data.line);
      io.emit('draw_line', { line: data.line });
   });
   socket.on('disconnect', function(){
       line_history = [];
     });
});