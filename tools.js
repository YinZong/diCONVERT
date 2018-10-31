const fs = require('fs');
const xml2js = require('xml2js');
const {spawn} = require('child_process');

var parser = new xml2js.Parser();
var xmlBuilder = new xml2js.Builder();
var path = 'Images';

module.exports = {
	resetDir: function(){
		fs.readdir(path, function(err, files){
			if(err){
				console.log(err);
			}
			var cls = spawn('rm', ['./Images/' + files[0], './dcmFiles/3456.dcm']);
		});
	},
	xmlCreater: function(id, name, bd, sex, date, time){
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
				res.NativeDicomModel.DicomAttribute[4].Value = [{_: date, '$': {number: '1'}}];
				res.NativeDicomModel.DicomAttribute[5].Value = [{_: time, '$': {number: '1'}}];
				var xml_save = xmlBuilder.buildObject(res);
				fs.writeFile('./metadata/patient.xml', xml_save);
			});
		});
		cmdRun();
	}
}

function cmdRun(){
	fs.readdir(path, function(err, files){
		if(err){
			console.log(err);
		}
		var ls = spawn('jpg2dcm', ['-f', './metadata/patient.xml', './Images/' + files[0], './dcmFiles/3456.dcm']);
		// console.log(files[0]);
	});
}