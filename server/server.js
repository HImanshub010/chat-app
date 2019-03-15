const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage,generateLocationMessage} = require('./utils/messages');
const {isRealString} = require('./utils/validation')
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT||3000;
let app  = express();
let server = http.createServer(app);
let io = socketIO(server);  
var users = new Users();

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
  console.log('user connected');

  socket.on('join',(params,callback)=>{
      if(!isRealString(params.name)|| !isRealString(params.room)){
           return callback('Inavalid room and name')
      }
      socket.join(params.room);
      users.removeUser(socket.id);
      users.addUser(socket.id,params.name,params.room)
      
      io.to(params.room).emit('updateUserList',users.getUserList(params.room));
      
      socket.emit('newMessage',generateMessage('Admin','welcome to the chat app'));

      socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined the room`));
    

    callback();
  })

  socket.on('createMessage',(message,callback)=>{
    console.log('messageCreated '+ message.from);
    io.emit('newMessage',generateMessage(message.from,message.text))
    callback();
  });

  socket.on('createLocationMessage',(coords)=>{
    io.emit('newLocationMessage',generateLocationMessage('admin',coords.latitude,coords.longitude));
  })

  socket.on('disconnect',()=>{
    let user = users.removeUser(socket.id);
    if(user){
      io.to(user.room).emit('updateUserList',users.getUserList(user.room));
      io.to(user.room).emit('newMessage',generateMessage('Admin',` ${user.name} has left the room`));
    }
    console.log('user disconnected');
  })
});

server.listen(port,()=>{
  console.log('Server is up on the port '+port);
})

