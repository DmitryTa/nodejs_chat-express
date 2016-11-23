var cookie = require('cookie');
var config = require('../config');
var async = require('async');
var sessionStore = require('../libs/sessionStore');
var HttpError = require('../error').HttpError;
var User = require('../models/user').User;
var cookieParser = require('cookie-parser');
var log = require('../libs/log')(module);

function loadSession(sid, callback) {
	sessionStore.load(sid, function(err, session) {
		if(arguments.length == 0) {
			return callback(null, null);
		}
		return callback(null, session);
	})
}
function loadUser(session, callback) {
	if(!session.user) {
		log.info('Session %s is anonymous', session.id);
		return callback(null, null);
	}
	User.findById(session.user, function(err, user) {
		if(err) 
			return callback(err);
		if(!user) 
			return callback(null, null);
		callback(null, user);
	})
}

module.exports = function(server) {

	var io = require('socket.io')(server);

	io.use(function(socket, next) {

		var handshakeData = socket.request;

		async.waterfall([
			function(callback) {
				
		    	  handshakeData.cookies = cookie.parse(handshakeData.headers.cookie || '');
		    	
		  		var sidCookie = handshakeData.cookies['connect.sid'];
	 	  		var sid = cookieParser.signedCookie(sidCookie, config.get('session:secret'));

	 	  		loadSession(sid, callback); 
			},
			function(session, callback) {
				if(!session) {
					callback(new HttpError(401, 'No session'));
				}
				handshakeData.session = session;
				loadUser(session, callback);
			},
			function(user, callback) {
				if(!user) {
					return callback(new HttpError(403, 'Anonymous session is not allowed'));
				}
			handshakeData.user = user;

			//console.log(handshakeData.user.get('username'));
			next();
			}

		], function(err) {
			if (err) 
				return next(err);
			})
	});


	io.on('connection', function (socket) {
	  var username = socket.request.user.get('username');

	  socket.broadcast.emit('join', username);

	  socket.on('message', function(text, callback) {
	    socket.broadcast.emit('message', username, text);
	    callback && callback();
	  });

	  socket.on('disconnect', function () {
	  	socket.broadcast.emit('leave', username);
	    console.log('user disconnected');
	  });
	});
	return io;
}