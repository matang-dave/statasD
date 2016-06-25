
//custom udp server ip-port
var SERVER_PORT = 1234;
var SERVER_HOST	='127.0.0.1';

//statsd server ip-port	
var STATSD_PORT	= 8125;
var STATSD_HOST	 = '127.0.0.1';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

//redis server connection
var redis = require('redis');
var redisClient = redis.createClient(); //creates a new client

//function parses data received from statsd client
//and saves data to redis server
function incrementInRedis(data) {
		
 var pipeIndex = data.lastIndexOf("|");
 if(pipeIndex == false)
	return false;

 //check for the operation type 	
 var operation = data.substring(pipeIndex+1);
 if(operation == 'c') {
	 
	 var counter = data.substring(0,data.indexOf(":"));
	 var increBy = data.substring(data.indexOf(":")+1,pipeIndex);
	 
	 redisClient.incrby(counter,increBy,function(err, reply) {
		 
        if(err) {
			throw err;
		}
		console.log("Value of counter " + reply);
				
    });
		return true;
	 }
	return false;
}

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
		
	//increment counter in redis
	if(incrementInRedis(message.toString())) {
			
		//after counter value incremented in redis , pass it on to statsd server
		var message = new Buffer(message);
		var client = dgram.createSocket('udp4');
		client.send(message, 0, message.length, STATSD_PORT, STATSD_HOST, function(err, bytes) {
		if (err) { 
			console.log("Error received " + err);
		}
		console.log( message +' sent to ' + STATSD_HOST +':'+ STATSD_PORT);
		client.close();
		
		});
	}
	else {
			console.log("Filed to update in redis");
	}
});

//listen to the port on host
server.bind(SERVER_PORT, SERVER_HOST);
