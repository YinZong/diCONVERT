var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var app = express();
const { spawn } = require('child_process');

app.use(bodyParser.json());

var Storage = multer.diskStorage({
	destination: function(req, file, callback){
		callback(null, "./Images");
	},
	filename: function(req, file, callback){
		callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
	}
});

var upload = multer({storage: Storage}).single("ImgUploader");

app.get("/", function(req, res){
	res.sendFile(__dirname + "/index.html");
});

app.post("/upload", function(req, res){
	upload(req, res, function(err){
		if(err){
			return res.end("Something went worng!\n" + err.toString());
		}
		// return res.end("File upload sucessfully!");
		return res.sendFile(__dirname + "/upload.html");
	});
});

app.listen(3030, function(a){
	console.log('Listen to port 3030');
});