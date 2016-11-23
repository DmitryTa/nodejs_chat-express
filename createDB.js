var mongoose = require('./libs/mongoose');
var async = require('async');
require('./models/user');
/*
var user = new User({
	username: 'Tester',
	password: 'secreq'
});

user.save(function(err, user, affected) {
	if(err) throw err;
	console.log(arguments);

})*/
mongoose.connection.on('open', function() {
	var db = mongoose.connection.db;

	db.dropDatabase(function(err) {

		if(err) throw err;

		async.parallel([
			
			function(callback) {
				var vasya = new mongoose.models.User({
					username: 'Tester',
					password: 's1234324req'
				});
				
				vasya.save(function(err) {
					callback(err, vasya);
				})
			},
			function(callback) {
				var petya = new mongoose.models.User({
					username: 'Tester2',
					password: 'se3ceq'
				});
				petya.save(function(err) {
					callback(err, petya);
					
				})
			},
			function(callback) {
				var user = new mongoose.models.User({
					username: 'Tester3',
					password: 'secr5q'
				});
				user.save(function(err) {
					callback(err, user);
					
				})
			},
			function(callback) {
				var user = new mongoose.models.User({
					username: 'Tester3',
					password: 'secr5q'
				});
				user.save(function(err) {
					callback(err, user);
					
				})
			}
		], function(err, results) {	
			  if(err) throw err;
				console.log(results);
				mongoose.disconnect();
			})
	})
})

