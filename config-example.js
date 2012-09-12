var config = {}

config.redis = {};
config.stats = {};

/*
	this is where the redis server will be found
	note that node will die if it can't connect to it
*/
config.redis.host = '127.0.0.1';
config.redis.port = 6379;

/*
	this is where the stats server will be available
	it's only used by the script graph.js
*/
config.stats.port = 1338;

module.exports = config;