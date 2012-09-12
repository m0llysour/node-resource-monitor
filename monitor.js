// modules
var fs = require('fs');
var redis = require('redis');

// config file
var config = require('./config');

// redis client connect
var client;
function redisConnect() {
	client = redis.createClient(config.redis.port, config.redis.host);
	client.on("error", function (err) {
	    console.log("Redis "+err);
	});
}
redisConnect();

// profiling
var timeOut = 5;
setInterval(function() {
	date = new Date();
	
	data = fs.readFileSync('/proc/stat', 'utf8');
	lines = data.split("\n");
	line = lines[0];
	line = line.replace(/ +/,' ').split(/ /);
	
	totalProc = line[1] + line[2] + line[3] + line[4];
	processor = 100 - (((totalProc - line[4]) * 100) / totalProc);
	
	var memTotal, memFree;
	
	data = fs.readFileSync('/proc/meminfo', 'utf8');
	lines = data.split("\n");
	memTotal = lines[0].replace(/[^0-9]/g, '');
	memFree = lines[1].replace(/[^0-9]/g, '')
	
	ts = Math.round(date.getTime() / 1000) + date.getTimezoneOffset() * 60;	
	mem = process.memoryUsage();
	memoryNode = (mem.rss / 1024);
	
	var profileData = {
		ts: ts,
	
		memRss: mem.rss,
		memHeapTotal: mem.heapTotal,
		memHeapUsed: mem.heapUsed,
		
		processor: processor,
		memory: 100 - ((memFree * 100) / memTotal),
		memoryNode: (memoryNode * 100) / memTotal,				
	};
	
	client.zadd('profileStats', String(ts), JSON.stringify(profileData));
	
	// data purge
	date = new Date();
	ts = Math.round(date.getTime() / 1000) + date.getTimezoneOffset() * 60;
	// removing older than 10 minutes (600 secs)
	ts -= 600;
	client.zremrangebyscore('profileStats', 0, ts);	
}, timeOut*1000);
