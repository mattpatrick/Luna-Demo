var request = require('request');
var http = require('http'),
fs = require('fs'),
    index = fs.readFileSync(__dirname + '/index.html'),
    accounts = fs.readFileSync(__dirname + '/accounts.html');

// NEVER use a Sync function except at start-up!

var url = require('url');
var qs = require('querystring');
var Parse = require('parse').Parse;

// Send index.html to all requests
var app = http.createServer(function(req, res) {

            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(accounts);
    var path = url.parse(req.url).pathname;
    var fsCallback = function(error,data){
        if (error) throw error;
    }

    if (req.method == 'POST'){
    }

    switch(path){
    case '/request':
        console.log("Received request from arduino!!!!");
        sendhubRequest();

    case '/accounts':
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(accounts);

    case '/admin':
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(admin);        

    //comment

    }

});

// Socket.io server listens to our app
var io = require('socket.io').listen(app);

// Send current time to all connected clients
function sendTime() {
    io.sockets.emit('time', { time: new Date().toJSON()) });
}



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
function sendhubRequest(){

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


function verifyUser(authCode){

}

// Send current time every 10 secs
// setInterval(sendTime, 3000);

// This handles the socket connection 
io.sockets.on('connection', function(socket) {
    socket.emit('welcome', { message: 'Welcome!' });

    socket.on('i am client', console.log);
    socket.on('button', function(){
        socket.emit('success',{successMessage:'You have sent a successful ______ request'});

        sendhubRequest();
    });

    socket.on('formInfo', function(){

    });
});

// app.listen();
app.listen(8080);