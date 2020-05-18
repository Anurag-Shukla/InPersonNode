const express = require('express');
const fs  = require('fs');
const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem")
};
var app = express();
const https = require('https').Server(options, app);
const io = require('socket.io')(https, { 'Access-Control-Allow-Origin': '**'});

const PORT = process.env.PORT || 8081;


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

https.listen(PORT, () => console.log(`https server listening at port number :${PORT}`));




