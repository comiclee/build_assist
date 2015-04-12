var process = require('child_process');
var path = require('path');

var scriptDir = path.normalize(__dirname + '/../script');

exports.process = function(request, response, callback) {
	process.exec('sh ' + scriptDir + '/find.sh ~/projects/service',
	  function (error,stdout,stderr) {
		if (error !== null) {
		  console.log('exec error: ' + error);
		}
		if (stdout !== null) {
			console.log(stdout);
		}
		console.log('process done');
		callback({
			code : 200,
			content : '运行成功',
			contentType : 'text/html'
		});
	});
};