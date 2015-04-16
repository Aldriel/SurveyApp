'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Fentoracrf = mongoose.model('Fentoracrf'),
	_ = require('lodash');

/**
 * Create a Fentoracrf
 */
exports.create = function(req, res) {
	var fentoracrf = new Fentoracrf(req.body);
	fentoracrf.user = req.user;

	fentoracrf.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(fentoracrf);
		}
	});
};

/**
 * Show the current Fentoracrf
 */
exports.read = function(req, res) {
	res.jsonp(req.fentoracrf);
};

/**
 * Update a Fentoracrf
 */
exports.update = function(req, res) {
	var fentoracrf = req.fentoracrf ;

	fentoracrf = _.extend(fentoracrf , req.body);

	fentoracrf.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(fentoracrf);
		}
	});
};

/**
 * Delete an Fentoracrf
 */
exports.delete = function(req, res) {
	var fentoracrf = req.fentoracrf ;

	fentoracrf.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(fentoracrf);
		}
	});
};

/**
 * List of Fentoracrf
 */
exports.list = function(req, res) { 
	Fentoracrf.find().sort('-created').populate('user', 'displayName').exec(function(err, fentoracrf) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(fentoracrf);
		}
	});
};

/**
 * Fentoracrf middleware
 */
exports.fentoracrfByID = function(req, res, next, id) { 
	Fentoracrf.findById(id).populate('user', 'displayName').exec(function(err, fentoracrf) {
		if (err) return next(err);
		if (! fentoracrf) return next(new Error('Failed to load Fentoracrf ' + id));
		req.fentoracrf = fentoracrf ;
		next();
	});
};

/**
 * Fentoracrf authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.fentoracrf.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
