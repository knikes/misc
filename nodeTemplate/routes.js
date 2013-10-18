var Deferred = require("JQDeferred");

/**************************************************************
					MAIN PAGE
***************************************************************/

var _main = function(req, resp){
	fs.readFile(__dirname + '/public/index.html', 'utf8', function(err, text){
        resp.send(text);
    });
}


/**********************************************************************************
	Test
	curl -i -X GET http://localhost:3000/test
***********************************************************************************/
var _test = function(req, resp){
	resp.send(200);
}

module.exports = {
	main: _main,
	test: _test
};
