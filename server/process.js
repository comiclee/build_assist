var process = require('child_process');
var fs = require('fs');

var scriptDir = fs.realpathSync('.');
console.log(scriptDir);
process.exec('sh ' + scriptDir + '/../script/find.sh ~/projects/service',null,{},
  function (error,stdout,stderr) {
	if (error !== null) {
	  console.log('exec error: ' + error);
	}
	if (stdout !== null) {
		console.log(stdout);
	}
});