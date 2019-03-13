let socket = io();
socket.on('connect',()=>{
  console.log('connected to server');
});
socket.on('disconnect',()=>{
  console.log('Disconnected from server');
})

socket.emit('createMessage',{
  from :'heloo',
  text: 'taht work for me'
});

socket.on('newMessage',(message)=>{
  console.log('newMessage ',message);
})