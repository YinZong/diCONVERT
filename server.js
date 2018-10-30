var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var fs = require('fs');
var util = require('util');
var xml2js = require('xml2js');

var path = 'Images';
var FileName = 'Custom_jpg2dcm.dcm';
var FilePath = './dcmFiles/3456.dcm';
var app = express();
var parser = new xml2js.Parser();
var xmlBuilder = new xml2js.Builder();
const { spawn } = require('child_process');

app.use(bodyParser.json());

function reset(){
	fs.readdir(path, function(err, files){
		if(err){
			console.log(err);
		}
		var cls = spawn('rm', ['./Images/' + files[0], './dcmFiles/3456.dcm']);
	});
}

function dcmFile_Check(){
	var COUNTER = 0;
	fs.exists('/home/kevin/nodejs/upload/dcmFiles/3456.dcm', function(exists){
		console.log(exists ? "success" : "Fail");
	});

}

function cmdRun(){
	fs.readdir(path, function(err, files){
		if(err){
			console.log(err);
		}
		var ls = spawn('jpg2dcm', ['-f', './metadata/patient.xml', './Images/' + files[0], './dcmFiles/3456.dcm']);
		console.log(files[0]);
	});
}

function xmlCreater(id, name, bd, sex){
	fs.readFile("./metatemplate.xml", function(err, data){
		if(err){
			console.log('Fail to read file!\n' + err);
		}
		parser.parseString(data, function(err, res){
			if(err){
				console.log('Parser Fail!\n' + err);
			}
			// console.log(util.inspect(res, false, null));
			res.NativeDicomModel.DicomAttribute[0].Value = [{_: id, '$': {number: '1'}}];
			res.NativeDicomModel.DicomAttribute[1].Value = [{_: name, '$': {number: '1'}}];
			res.NativeDicomModel.DicomAttribute[2].Value = [{_: bd, '$': {number: '1'}}];
			res.NativeDicomModel.DicomAttribute[3].Value = [{_: sex, '$': {number: '1'}}];
			var xml_save = xmlBuilder.buildObject(res);
			fs.writeFile('./metadata/patient.xml', xml_save);
		});
	});
	cmdRun();
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
	reset();
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
	var ID = req.query.PatientID;
	var NAME = req.query.PatientName;
	var BD = req.query.PatientBirthday;
	var SEX = req.query.PatientSex;
	xmlCreater(ID, NAME, BD, SEX);
	return res.sendFile(__dirname + "/download.html");

});

app.get("/download", function(req, res){
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