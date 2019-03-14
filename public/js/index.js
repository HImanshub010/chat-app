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

socket.on('newLocationMessage',(message)=>{
  let li = jQuery('<li></li>')
  let a = jQuery('<a target ="_blank"> My current location</a>')
  li.text(`${message.from}: `);
  a.attr('href',message.url);
  li.append(a);
  jQuery('#messages').append(li);

})

$(document).ready(function(){
  jQuery('#message-form').on('submit',function(e){
    e.preventDefault();
    console.log('working');
    let messageTextBox = jQuery('[name=message]');
    socket.emit('createMessage',{
      from : 'User',
      text : messageTextBox.val()
    },()=>{
      messageTextBox.val('')
    }) 
  });

  let locationButton = jQuery('#send-location');
  locationButton.on('click',()=>{
    if(!navigator.geolocation){
      return alert('Geoloation not supported by your browser!!');
    }
    locationButton.attr('disabled','disabled').text('Sending location ...');
    navigator.geolocation.getCurrentPosition((position)=>{
      console.log(position); 
      locationButton.removeAttr('disabled').text('Send location');
      socket.emit('createLocationMessage',{
        latitude: position.coords.latitude,
        longitude:position.coords.longitude
      })
    },()=>{
      locationButton.removeAttr('disabled').text('Send location');
      alert('Unable to fetch Location');
    })
  })
});

 