var process = require('child_process');
process.exec('sh /Users/chenli08/projects/autoUpdate.sh',null,{},
  function (error,stdout,stderr) {
	if (error !== null) {
	  console.log('exec error: ' + error);
	}
	if (stdout !== null) {
		console.log(stdout);
	}
});