var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var fs = require('fs');
var util = require('util');

var path = 'Images';
var FilePath = './dcmFiles/3456.dcm';
var app = express();

var tools = require('./tools.js');

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
	tools.resetDir();
});

app.post("/jpg-upload", function(req, res){
	upload(req, res, function(err){
		if(err){
			return res.end("Something went worng!\n" + err.toString());
		}
		// return res.end("File upload sucessfully!");
		return res.sendFile(__dirname + "/jpg-upload.html");
	});
});

app.get("/Convert", function(req, res){
	var today = new Date();
	var ID = req.query.PatientID;
	var NAME = req.query.PatientName;
	var BD = req.query.PatientBirthday;
	var SEX = req.query.PatientSex;
	var DATE = today.getFullYear() + "/" + (today.getMonth()+1) + "/" + today.getDate();
	var TIME = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	tools.xmlCreater(ID, NAME, BD, SEX, DATE, TIME);
	return res.sendFile(__dirname + "/download.html");

});

app.get("/download", function(req, res){
	var DName = req.query.dcmName;
	if(DName == ""){
		var FileName = 'Custom_jpg2dcm.dcm';
	}
	else{
		var FileName = DName;
	}
	return res.download(FilePath, FileName, function(err){
		if(err){
			return res.end('Some error!\n' + err.toString());
		}
		return res.end('Done');
	});
});

app.listen(3030, function(a){
	console.log('Listen to port 3030');
});