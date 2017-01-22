'use strict';
var util 	= require('util');
var fs 		= require('fs');
var path 	= require('path');
module.exports = {
	get: function(req, res) {
		res.locals.csrftoken = req.csrfToken();
		console.log(res.locals.csrftoken);
		res.render('contactus');
	},

	validateInput: function(req, res, next) {
		req.checkBody('fullName', 'Where is the Full name?').notEmpty();
		req.checkBody('message', 'An empty message? Don\'t lose your words?').notEmpty();
		req.checkBody('suggestion', 'Select something').notEmpty().suggestionOrComplaint();

		req.getValidationResult().then(function(result) {
			if(!result.isEmpty()) {
				return next(new Error('There have been validation errors: ' + util.inspect(result.array())));
			}
			next();
		});
	},

	sanitizeInput: function(req, res, next) {
		req.sanitizeBody('fullName').toString();
		req.sanitizeBody('message').toString();
		req.sanitizeBody('suggestion').toString();
		req.finalMessage = {
			fullName: req.body.fullName,
			message: req.body.message,
			suggestion: req.body.suggestion,
			ip: req.ip
		};
		next();
	},

	saveMessage: function(req, res, next) {
		var localPath = path.join(global.appRoot, 'files/' + req.finalMessage.fullName + '_' + Date.now() + '.json');
		var finalJson = JSON.stringify(req.finalMessage, 0, 4);
		var writeStream = fs.createWriteStream(localPath);
		writeStream.write(finalJson, next);
	},

	respond: function(req, res) {
		res.redirect('/contactus/thankyou?fullName=' + req.body.fullName);
	},

	thankyouRedirection: function(req, res) {
		res.render('thankyou', {fullName: req.query.fullName});
	}

};