var http = require('http');
var url = require('url');
var fs = require('fs');

var serverDir = __dirname;
var server = http.createServer(function(request,response) {
	var path = url.parse(request.url).pathname;
	var handlerPath = serverDir + path + '.js';
	if (!fs.existsSync(handlerPath)) {
		console.log('Error: The file ' + handlerPath + ' is not exist');
		response.writeHead(404, {"Content-Type": "text/plain"});
		response.end();
		return;
	}
	
	var handler = require(handlerPath);
	handler.process(request, response, function(result) {
		response.writeHead(result.code, {"Content-Type": result.contentType});
		response.write(result.content);
		response.end();
	});
});
server.listen(8787);