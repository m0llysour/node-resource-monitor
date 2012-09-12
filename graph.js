// modules
var http = require('http');
var url = require('url');
var fs = require('fs');
var redis = require('redis');
var _ = require('underscore');

// config file
var config = require('./config');

// redis client connect
client = redis.createClient(config.redis.port, config.redis.host);
client.on("error", function (err) {
    console.log("Error " + err);
});

var htmlFile;
fs.readFile(__dirname+'/live.html', function(err,data) {
	htmlFile = data;
});

// http server
http.createServer(function (req, res) {
	if(url.parse(req.url)['pathname'] == '/live.html') {
	  res.writeHead(200, {'Content-Type': 'text/html' });
	  res.end(htmlFile);
	} else {
		client.zrevrange('profileStats', 0, -1, 'withscores', function(err, members) {
		    var lists=_.groupBy(members, function(a,b) {
		        return Math.floor(b/2);
		    });
		    
		    res.writeHead(200, {'Content-Type': 'text/plain'});
		    
		    arr = _.toArray(lists);
			res.write(JSON.stringify(arr).replace(/\\"/g,''));
			
		    res.end();
		});	
	}
}).listen(config.stats.port);

// stdout log started
console.log('STATS Server running on port '+config.stats.port+'...');
