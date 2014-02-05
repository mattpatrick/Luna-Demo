var request = require('request');
var http = require('http'),
	fs = require('fs'),
    index = fs.readFileSync(__dirname + '/index.html'),
    accounts = fs.readFileSync(__dirname + '/accounts.html');

// NEVER use a Sync function except at start-up!

var url = require('url');
var qs = require('querystring');
var Parse = require('parse').Parse;

// Global variables - mainly API codes
var parseAppId = "i2cR1ovx22opix8dCEy53BG8BAJDBeVq6WlU8DqZ"; 
var parseJsId = "yKIG2eCXHBPBJD5FfbT2tggOmCDSv6Eov7sgkeZc";


// Send index.html to all requests
var app = http.createServer(function(req, res) {

            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(accounts);
    var path = url.parse(req.url).pathname;
    var query = req.url.split('?')[1];
    var queryParsed = qs.parse(query);
    var queryText = JSON.stringify(queryParsed); 
//    console.log("Query = " + queryText);
    var fsCallback = function(error,data){
        if (error) throw error;
    }

    if (req.method == 'POST'){
    }

    switch(path){
    case '/request':
        console.log("Received request with query" + queryText);
        //sendhubRequest();
	var userId = queryParsed.id;
	var timeStamp = queryParsed.time;	
	var bedState = queryParsed.bed;	
    console.log("userId = "+userId);
    console.log("timeStamp = "+timeStamp);
    console.log("bedState = "+bedState);

	// var authValid = authorizeCode(userId);
	// console.log("authValid = " + authValid);
	// if(authValid==true){
	// 	console.log("This id is valid");	
	// }
	// else {
	// 	console.log("This id is invalid");
	// }
//	newParseEntry (userId,timeStamp,bedState)

    case '/accounts':
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(accounts);

    // case '/admin':
    //     res.writeHead(200, {'Content-Type': 'text/html'});
    //     res.end(admin);        

    //comment

    }

});

// Socket.io server listens to our app
var io = require('socket.io').listen(app);

// Send current time to all connected clients
// function sendTime() {
//     io.sockets.emit('time', { time: new Date().toJSON() });
// }



/*****************************MESSAGING REQUESTS*******************************/ 

// This is if we want to send the email
function sendEmail() {
    var postmark = require("postmark")("1ec2a3f4-3601-4792-b9dc-a1bbeb6258c5");
    postmark.send({
        "From": "info@spamweir.com", 
        "To": "matthewleepatrick@gmail.com", 
        "Subject": "Test", 
        "TextBody": "Test Message"
    }
        , function(error, success) {
        if(error) {
            console.error("Unable to send via postmark: " + error.message);
            return;
        }
        console.info("Sent to postmark for delivery")
    });
}

// This works, should eventually take input phone number and message
function sendhubRequest(number){
    //number 

    var request = require("request");
    request({
        uri: 'https://api.sendhub.com/v1/messages/?username=7652129586\&api_key=9e893891e0de6a833c06a5b5d9a2b3b5a08e103c',
        header: {'Content-type': 'application/json'},
        method: "POST",
        body: JSON.stringify({ "contacts" : [ 9828938 ], "text" : "testing" })

        }, function(error, response, body) {
           if(error) {
            console.log("Unable to send via sendhub: " + error);
            }
        });
}






// Send current time every 10 secs
// setInterval(sendTime, 3000);

// This handles the socket connection 
io.sockets.on('connection', function(socket) {
    socket.emit('welcome', { message: 'Welcome!' });

    socket.on('i am client', console.log);
    socket.on('button', function(){
        socket.emit('success',{successMessage:'You have sent a successful ______ request'});

       // sendhubRequest();
    });

    socket.on('formInfo', function(){

    });
});

function newParseEntry (userId,timeStamp,bedState){


    Parse.initialize(parseAppId, parseJsId);

		 var LunaObject = Parse.Object.extend("lightData");
                    var lunaObject = new LunaObject();
			lunaObject.set("time",timeStamp);
			lunaObject.set(userId,bedState);
			lunaObject.save(null,{
				success: function(lunaObject){
				console.log('New object saved? with objectId: ' + lunaObject.id);
				},
				error: function(lunaObject, error){
				console.log('Failed to create new object, error:' + error.description);
			}
		});

}


function authorizeCode(authId) {	

Parse.initialize(parseAppId, parseJsId);
var AuthObject = Parse.Object.extend("authCode");
	var result = false;
	var query = new Parse.Query(AuthObject);
//	query.descending("auth");
//	query.equalTo("phone","7652129586");
	var numAuth = query.count();
		query.count({
		success: function(number){
			console.log("There are this many matching objects: " + number);
		var promise = Parse.Promise.as("The good result.");

	

		},
		error: function(error){
			alert("Error: " + error.code + " " + error.message);
		}		
		
	});
		console.log("numAuth = " + numAuth);
//		return numAuth; 
		return promise;
}
// app.listen();
app.listen(8080);
