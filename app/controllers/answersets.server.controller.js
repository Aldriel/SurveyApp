'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Answerset = mongoose.model('Answerset'),
	_ = require('lodash');

/**
 * Create a Answerset
 */
exports.create = function(req, res) {
	var answerset = new Answerset(req.body);
	answerset.user = req.user;

	answerset.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(answerset);
		}
	});
};

/**
 * Show the current Answerset
 */
exports.read = function(req, res) {
	res.jsonp(req.answerset);
};

/**
 * Update a Answerset
 */
exports.update = function(req, res) {
	var answerset = req.answerset ;

	answerset = _.extend(answerset , req.body);

	answerset.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(answerset);
		}
	});
};

/**
 * Delete an Answerset
 */
exports.delete = function(req, res) {
	var answerset = req.answerset ;

	answerset.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(answerset);
		}
	});
};

/**
 * List of Answersets
 */
exports.list = function(req, res) { 
	Answerset.find().sort('-created').populate('user', 'displayName').exec(function(err, answersets) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(answersets);
		}
	});
};

/**
 * Answerset middleware
 */
exports.answersetByID = function(req, res, next, id) { 
	Answerset.findById(id).populate('user', 'displayName').exec(function(err, answerset) {
		if (err) return next(err);
		if (! answerset) return next(new Error('Failed to load Answerset ' + id));
		req.answerset = answerset ;
		next();
	});
};

/**
 * Answerset authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.answerset.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
