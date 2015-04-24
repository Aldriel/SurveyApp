'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Compensationform = mongoose.model('Compensationform'),
	_ = require('lodash');

/**
 * Create a Compensationform
 */
exports.create = function(req, res) {
	var compensationform = new Compensationform(req.body);

	compensationform.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(compensationform);
		}
	});
};

/**
 * Show the current Compensationform
 */
exports.read = function(req, res) {
	res.jsonp(req.compensationform);
};

/**
 * Update a Compensationform
 */
exports.update = function(req, res) {
	var compensationform = req.compensationform ;

	compensationform = _.extend(compensationform , req.body);

	compensationform.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(compensationform);
		}
	});
};

/**
 * Delete an Compensationform
 */
exports.delete = function(req, res) {
	var compensationform = req.compensationform ;

	compensationform.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(compensationform);
		}
	});
};

/**
 * List of Compensationforms
 */
exports.list = function(req, res) { 
	Compensationform.find().sort('-created').populate('user', 'displayName').exec(function(err, compensationforms) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(compensationforms);
		}
	});
};

/**
 * Compensationform middleware
 */
exports.compensationformByID = function(req, res, next, id) { 
	Compensationform.findById(id).populate('user', 'displayName').exec(function(err, compensationform) {
		if (err) return next(err);
		if (! compensationform) return next(new Error('Failed to load Compensationform ' + id));
		req.compensationform = compensationform ;
		next();
	});
};

/**
 * Compensationform authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.compensationform.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
