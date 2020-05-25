const express = require('express');
const fs  = require('fs');
const options = {
  key: fs.readFileSync("./ssl-certs/key.pem"),
  cert: fs.readFileSync("./ssl-certs/cert.pem")
};

var app = express();

const https = require('https').Server(options, app);
const io = require('socket.io')(https, { 'Access-Control-Allow-Origin': '**'});

app.get('/', function(req, res){
  res.send("I am up and running");
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

module.exports = https;




