var express = require('express');
var app = express();
var http = require("http");
var url = require("url");

var staticDir = __dirname + '/static';
var r= express.Router();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// function onRequest(request, response) {
  // console.log("Request received."); 

   
  
  // response.writeHead(200, {"Content-Type": "application/json",  "Access-Control-Allow-Origin": "*"});
 
    
 // var queryObject = url.parse(request.url,true).query;  
  //response.write(queryObject.firstname + ' ' +  queryObject.lastname
  // var objToJson = { };
// objToJson.response = queryObject;
// response.write(JSON.stringify(objToJson));
  // response.end();
// }

app.post('/xxx', function(req, res){
	res.send(req.body.firstname + ' ' + req.body.lastname);
});

app.use(express.static(__dirname + '/static'));
app.use('/xxx',r);

//http.createServer(onRequest).listen(8080);

var server = app.listen('8080', function(){
	console.log('Listening on port ');
});