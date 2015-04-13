var process = require('child_process');
var path = require('path');
var url = require('url');
var fs = require('fs');
var querystring = require('querystring');

var scriptDir = path.normalize(__dirname + '/../script');
var tmpDir = path.normalize(__dirname + '/../tmp');
var infoFile = tmpDir + '/branch_info';

exports.process = function(request, response, callback) {
	var query = url.parse(request.url).query;
	var dir = '';
	if (query) {
		var queryObj = querystring.parse(query);
		dir = queryObj.dir;
	}
	var script = 'sh ' + scriptDir + '/find.sh ' + dir;
	console.log(script);
	
	process.exec(script, {maxBuffer: 5000*1024},
	  function (error,stdout,stderr) {
		if (error !== null) {
		  console.log('exec error: ' + error);
		}
		if (stdout !== null) {
			console.log(stdout);
		}
		
		var retryTimes = 10;
		var interval = setInterval(function() {
			retryTimes --;
			if (fs.existsSync(infoFile)) {
				clearInterval(interval);
				fs.readFile(infoFile, function(err, data) {
					callback({
						code : 200,
						content : getHtml({dir:dir,data:data.toString()}),
						contentType : 'text/html'
					});
				});
			} else if (retryTimes==0) {
				clearInterval(interval);
				callback({
					code : 200,
					content : getHtml({dir:dir,data:'没有找到'}),
					contentType : 'text/html'
				});
			}
		}, 1000);
		
	});
};

function getHtml(params) {
	var html = '<style>.dir {width:400px} .update-input {width: 500px; height: 200px; margin-top: 20px;}</style>' + 
		'<form method="GET" action="/find">项目路径：<input class="dir" name="dir" value="'+(params.dir || '')+'"><button>查找</button></form>' + 
		'<div>'+params.data.replace(/\n/g,'\n<br>')+'</div>' + 
		'<form method="POST" action="/update"><textarea class="update-input" name="modules"></textarea><br><button>自动编译</button></form>';
	return html;
}