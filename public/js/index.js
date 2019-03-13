let socket = io();
socket.on('connect',()=>{
  console.log('connected to server');
});
socket.on('disconnect',()=>{
  console.log('Disconnected from server');
})

socket.on('newMessage',(message)=>{
  console.log('newMessage ',message);
  let li = jQuery('<li></li>')
  li.text(`${message.from} : ${message.text}`);

  jQuery('#messages').append(li);
})

$(document).ready(function(){
  jQuery('#message-form').on('submit',function(e){
    e.preventDefault();
    console.log('working');
    socket.emit('createMessage',{
      from : 'User',
      text : jQuery('[name=message]').val()
    },()=>{
  
    }) 
  });
});

 