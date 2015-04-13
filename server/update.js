var process = require('child_process');
var path = require('path');
var url = require('url');
var fs = require('fs');
var querystring = require('querystring');

var scriptDir = path.normalize(__dirname + '/../script');
var tmpDir = path.normalize(__dirname + '/../tmp');
var processFile = tmpDir + '/compile_info';
var resultFile = tmpDir + '/op_result';

exports.process = function(request, response, callback) {
	if (request.method == "POST") {
		var postData = '';
 
		// 因为nodejs在处理post数据的时候，会将数据分成小包来序列处理
		// 所以必须监听每一个数据小包的结果
		request.addListener("data", function (postDataChunk) {
			postData += postDataChunk;
		});
 
		// 所有数据包接收完毕
		request.addListener("end", function () {
			// 解析post数据
			var objectPostData = querystring.parse(postData);
			console.log(objectPostData);
			
			// 如果没有resultFile，则说明在处理中，那就只轮询，不执行shell脚本
			if (fs.existsSync(resultFile)) {
				var content = fs.readFileSync(resultFile);
				if (content.toString().trim()=='working') {
					getResult(resultFile, callback);
					return;
				}
			}
			
			var fileData = objectPostData.modules;
			fs.writeFile(processFile, fileData, function() {
				var script = 'sh ' + scriptDir + '/autoUpdate.sh';
				console.log(script);
				process.exec(script, {maxBuffer: 5000*1024},
				  function (error,stdout,stderr) {
					if (error !== null) {
					  console.log('exec error: ' + error);
					}
					if (stdout !== null) {
						console.log(stdout);
					}
		
					getResult(resultFile, callback);
				});
			});
			
		});
	}
};

function getResult(resultFile, callback) {
	var retryTimes = 600;
	var interval = setInterval(function() {
		retryTimes --;
		if (fs.existsSync(resultFile)) {
			fs.readFile(resultFile, function(err, data) {
				if (data.toString().trim()=='working') {
					if (retryTimes==0) {
						clearInterval(interval);
						callback({
							code : 200,
							content : '执行超时',
							contentType : 'text/html'
						});
					}
				} else {
					clearInterval(interval);
					callback({
						code : 200,
						content : '执行成功',
						contentType : 'text/html'
					});
				}
			});
		}
	}, 1000);
}