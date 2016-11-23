
  var socket = io.connect();
  var form = document.querySelector('.chat__form');
  var chat = document.querySelector('.chat__list');


  form.onsubmit = function() {
  	var input = this.elements[0];
  	var text = input.value;
  	if(text.length == 0) return false;
  	input.value = '';

  	socket.emit('message', text, function() {
  		var message = document.createElement('li');
  		var clearfix = document.createElement('span');
  		clearfix.classList.add('chat__message-clearfix');
	  	message.classList = 'chat__message chat__message_user';
	  	message.textContent = text;
	  	chat.appendChild(message);
	  	chat.appendChild(clearfix);
  	});


  	return false;
  } 
  socket.on('connect' ,function() {
  	console.log('connected');
  })
  socket.on('message', function (username, meassage) {
  	showMessage(username, meassage)
  });

  socket.on('join', function(username){
  	showOnline(username);
  });
  socket.on('leave', function(username){
  	var a;
  });

function showOnline(username) {
	var b;
	
};

function showMessage(username, meassage) {
	var message = document.createElement('li');
  	var clearfix = document.createElement('span');
  	clearfix.classList.add('chat__message-clearfix');
  	message.classList.add('chat__message');
  	message.textContent = username +': ' + meassage;
  	chat.appendChild(message);
	chat.appendChild(clearfix);	
};