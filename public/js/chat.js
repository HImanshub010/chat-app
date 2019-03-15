let socket = io();

function scrollToBottom(){
  //selectors
  let messages= jQuery('#messages');
  let newMessage = messages.children('li:last-child')
  //heights
  let clientHeight = messages.prop('clientHeight')
  let scrollTop = messages.prop('scrollTop')
  let scrollHeight = messages.prop('scrollHeight')
  let newMessageHeight = newMessage.innerHeight();
  let lastMessageHeight = newMessage.prev().innerHeight();
  if(clientHeight+scrollTop +newMessageHeight+lastMessageHeight >= scrollHeight){
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect',()=>{
  let params = jQuery.deparam(window.location.search)
  socket.emit('join', params,(err)=>{
    if(err){
      alert(err);
      window.location.href = '/'; 
    }else{
      console.log('No error');
    }
  })
});
socket.on('disconnect',()=>{
  console.log('Disconnected from server');
})

socket.on('updateUserList',(users)=>{
 let ol = jQuery('<ol></ol>')

 users.forEach((user)=>{
   ol.append(jQuery('<li></li>').text(user));
 }) 

 jQuery('#users').html(ol); 
})


socket.on('newMessage',(message)=>{
  let formattedTime = moment(message.createdAt).format('h:mm a'); 
  let template = jQuery('#message-template').html(); 
  let html = Mustache.render(template,{
    text : message.text,
    from :message.from,
    createdAt:formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
  // console.log('newMessage ',message);
  
  // let li = jQuery('<li></li>')
  // li.text(`${message.from} ${formattedTime}: ${message.text}`);

  // jQuery('#messages').append(li);
})

socket.on('newLocationMessage',(message)=>{
  let formattedTime = moment(message.createdAt).format('h:mm a'); 
  let template = jQuery('#location-message-template').html(); 
  let html = Mustache.render(template,{
    url : message.url,
    from :message.from,
    createdAt:formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
  // let li = jQuery('<li></li>')
  // let formattedTime = moment(message.createdAt).format('h:mm a'); 
  // let a = jQuery('<a target ="_blank"> My current location</a>')
  // li.text(`${message.from}: ${formattedTime}`);
  // a.attr('href',message.url);
  // li.append(a);
  // jQuery('#messages').append(li);

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

 