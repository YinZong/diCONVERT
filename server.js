var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = 'Images';
var app = express();
const { spawn } = require('child_process');


app.use(bodyParser.json());

function cmdRun(){
	var existFile = new Array(".jpg", ".jpeg");

	fs.readdir(path, function(err, files){
		if(err){
			console.log(err);
		}
		var ls = spawn('jpg2dcm', ['./Images/' + files[0], './dcmFiles/3456.dcm']);
		console.log(files[0]);
	});
}

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

app.get("/Convert", function(req, res){
	cmdRun();
	return res.end("DONE!");
});

app.listen(3030, function(a){
	console.log('Listen to port 3030');
});