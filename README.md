node-resource-monitor
=====================

Node.js server resource monitor app

Scripts to check servers status, report to Redis db and graph info:
* monitor.js - checks periodically for the info and stores it into Redis.
* graph.js - answers to http requests with .html graph file, and json info to feed the graphs.

Currently using highcharts.com to graph data.