const express = require('express');
const fs  = require('fs');
const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem")
};
var app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, { 'Access-Control-Allow-Origin': '**'});

const PORT = process.env.PORT || 3001;


app.use(express.static(__dirname + '/dist/InPerson'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/dist/InPerson/index.html');
});

io.sockets.on('connection', function(socket){
  socket.on('subscribe', function(data) {
    console.log('joining room', data.roomId);
    socket.join(data.roomId);
  })

  socket.on('unsubscribe', function(data) {
    console.log('leaving room', data.roomId);
    socket.leave(data.roomId);
  })

  socket.on('send', function(data) {
    io.sockets.in(data.roomId).emit('message', data);
  });
});

http.listen(PORT, () => console.log(`http server listening at port number :${PORT}`));




