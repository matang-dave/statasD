
var TIMEOUT = 2000;
//create status client 
var SDC = require('statsd-client'),
    sdc = new SDC({host:'localhost',port:1234,debug:true});

// send counter increments periodically 
function sendIncrement() 
{
	sdc.increment('counter');
	setTimeout(sendIncrement,TIMEOUT);
}

setTimeout(sendIncrement,TIMEOUT);
