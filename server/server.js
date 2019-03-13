const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT||3000;
let app  = express();
let server = http.createServer(app);
let io = socketIO(server);  

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
  console.log('user connected');

  socket.emit('newMessage',{
    from : 'John',
    text : 'See you then',
    createdAt : 123
  })
  socket.on('createMessage',(data)=>{
    console.log('messageCreated '+ data.from);
  });

  socket.on('disconnect',()=>{
    console.log('user disconnected');
  })
});

server.listen(port,()=>{
  console.log('Server is up on the port '+port);
})

