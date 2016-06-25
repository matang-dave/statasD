---install node---
https://nodejs.org/en/download/package-manager/

--- install redis server---
apt-get install redis-server

--- install node packages ---
npm install statsd-client
npm install node-statsd
npm install redis


--- Run statsd client ---
node myStatsdClient.js

Client send increment of a counter to server periodically .

--- Run program ---
node myStatsdServer.js

Program creats a upd server and accepts increments of counters from the client.
Updates the value in redis and send the message to actual statsd server with a udp client.

-- Run actual statud server ---
node statsdServer/stats.js statsdServer/config.js
