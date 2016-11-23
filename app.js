var express = require('express');
var http = require('http');
var app = express();
var config = require('./config');
var log = require('./libs/log')(module);
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var cookie = require('cookie');
var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');
var HttpError = require('./error').HttpError;
var session = require('express-session');
var mongoose = require('./libs/mongoose');


app.engine('ejs', require('ejs-locals'));

app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');

app.set('port', config.get('port'));




//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));

app.use(bodyParser.json()); // req.body. ....
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

var sessionStore = require('./libs/sessionStore')

app.use(session({
	secret: config.get('session:secret'),
	resave: false,
  	saveUninitialized: true,
	cookie: config.get('session:cookie'),
	store: sessionStore
}));



app.use(require('./middleware/sendHttpError'));
app.use(require('./middleware/loadUser'));



require('./routes')(app);



var server = http.createServer(app);
server.listen(config.get('port'), function() {
	log.info('Server is running at ' +  config.get('port'));
});

var io = require('./socket')(server);
app.set('io', io);

app.use(function(err, req, res, next) {
	
	if (typeof err == 'number') {
		err = new HttpError(err);
	}

	if (err instanceof HttpError) {
		res.sendHttpError(err);
	} else {
		log.error(err);
		res.locals.message = err.message;
		res.locals.error = req.app.get('env') === 'development' ? err : {};

		 // render the error page
		res.status(err.status || 500);
		res.render('error');
	}
})


module.exports = app;




