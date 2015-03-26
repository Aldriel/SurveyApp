'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Choice = mongoose.model('Choice'),
	_ = require('lodash');

/**
 * Create a Choice
 */
exports.create = function(req, res) {
	var choice = new Choice(req.body);

	choice.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(choice);
		}
	});
};

/**
 * Show the current Choice
 */
exports.read = function(req, res) {
	res.jsonp(req.choice);
};

/**
 * Update a Choice
 */
exports.update = function(req, res) {
	var choice = req.choice ;

	choice = _.extend(choice , req.body);

	choice.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(choice);
		}
	});
};

/**
 * Delete an Choice
 */
exports.delete = function(req, res) {
	var choice = req.choice ;

	choice.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(choice);
		}
	});
};

/**
 * List of Choices
 */
exports.list = function(req, res) { 
	Choice.find().sort('-created').populate('user', 'displayName').exec(function(err, choices) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(choices);
		}
	});
};

/**
 * Choice middleware
 */
exports.choiceByID = function(req, res, next, id) { 
	Choice.findById(id).populate('user', 'displayName').exec(function(err, choice) {
		if (err) return next(err);
		if (! choice) return next(new Error('Failed to load Choice ' + id));
		req.choice = choice ;
		next();
	});
};

/**
 * Choice authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.choice.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
