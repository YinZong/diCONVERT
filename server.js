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
//* FUNCTION 1 : Impelement jpg convert to dcm format file */
//設定存取jpg圖片的資料夾
var jpgStorage = multer.diskStorage({
	destination: function(req, file, callback){
		callback(null, "./Images");
	},
	filename: function(req, file, callback){
		callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
	}
});

var jpg_upload = multer({storage: jpgStorage}).single("ImgUploader");

app.get("/", function(req, res){
	res.sendFile(__dirname + "/index.html");
	tools.resetDir();
});

app.post("/jpg-upload", function(req, res){
	jpg_upload(req, res, function(err){
		if(err){
			return res.end("Something went worng!\n" + err.toString());
		}
		// return res.end("File upload sucessfully!");
		return res.sendFile(__dirname + "/jpg-upload.html");
	});
});

app.get("/jpg-upload", function(req, res){
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
//* FUNCTION 2 : Impelement dcm file convert to Image file */
//設定存取dcm檔案的資料夾
var dcmStorage = multer.diskStorage({
	destination: function(req, file, callback){
		callback(null, "./dcmFiles");
	},
	filename: function(req, file, callback){
		callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
	}
});

var dcm_upload = multer({storage: dcmStorage}).single("DcmUploader");

app.post("/dcm-download", function(req, res){
	dcm_upload(req, res, function(err){
		if(err){
			return res.end("Something went worng!\n" + err.toString());
		}
		else{
			tools.dcm2img();
			var jpg_Name = req.query.jpgName;
			console.log(jpg_Name)
			// return res.end("File upload sucessfully!");
			return res.sendFile(__dirname + "/dcm-upload.html");
		}
	});
});

app.get("/jpg-download", function(req, res){
	var jpg_Name = req.query.jpgName;
	if(jpg_Name == ""){
		var FileName = 'Custom_Image.jpg';
	}
	else{
		var FileName = jpg_Name;
	}
	return res.download('./Images/img.jpg', FileName, function(err){
		if(err){
			return res.end('Some error!\n' + err.toString());
		}
		return res.end('Done');
	});
});

app.listen(3030, function(a){
	console.log('Listen to port 3030');
});