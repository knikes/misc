var express = require('express'),
    http = require('http'),
    routes = require('./routes');

// Config
var app = express();
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use('/public', express.static(__dirname + '/public'));

// Routes
app.get('/', routes.main);
app.get('/test', routes.test);

// Start Server
http.createServer(app).listen(3000);

console.log("Express server listening on port %d in %s mode", 3000, app.settings.env);