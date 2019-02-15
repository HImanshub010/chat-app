let app = require('express')();
let http= require('http').Server(app);
var io =require('socket.io')

app.get('/', function(req, res) {
   res.sendFile(__dirname+'/index.html');
});


let users = {};
let names =[];
http.listen(3000, function() {
  console.log('listening on *>>>>>:3000');
});
