const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage} = require('./utils/messages');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT||3000;
let app  = express();
let server = http.createServer(app);
let io = socketIO(server);  

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
  console.log('user connected');
  socket.emit('newMessage',generateMessage('Admin','welcome to the chat app'));

  socket.broadcast.emit('newMessage',generateMessage('Admin','New user joined '));

  socket.on('createMessage',(message,callback)=>{
    console.log('messageCreated '+ message.from);
    io.emit('newMessage',generateMessage(message.from,message.text))
    callback('This is from the server');
    
    // socket.broadcast.emit('newMessage',{
    //   from : message.from,
    //   text : message.text,
    //   createdAt : new Date().getTime()
    // })
  });

  socket.on('disconnect',()=>{
    console.log('user disconnected');
  })
});

server.listen(port,()=>{
  console.log('Server is up on the port '+port);
})

