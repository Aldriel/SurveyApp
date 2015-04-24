'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Patientcrf = mongoose.model('Patientcrf'),
	_ = require('lodash');

/**
 * Create a Patientcrf
 */
exports.create = function(req, res) {
	var patientcrf = new Patientcrf(req.body);
	patientcrf.user = req.user;

	patientcrf.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(patientcrf);
		}
	});
};

/**
 * Show the current Patientcrf
 */
exports.read = function(req, res) {
	res.jsonp(req.patientcrf);
};

/**
 * Update a Patientcrf
 */
exports.update = function(req, res) {
	var patientcrf = req.patientcrf ;

	patientcrf = _.extend(patientcrf , req.body);

	patientcrf.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(patientcrf);
		}
	});
};

/**
 * Delete an Patientcrf
 */
exports.delete = function(req, res) {
	var patientcrf = req.patientcrf ;

	patientcrf.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(patientcrf);
		}
	});
};

/**
 * List of Patientcrves
 */
exports.list = function(req, res) { 
	Patientcrf.find().sort('-created').populate('user', 'displayName').exec(function(err, patientcrves) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(patientcrves);
		}
	});
};

/**
 * Patientcrf middleware
 */
exports.patientcrfByID = function(req, res, next, id) { 
	Patientcrf.findById(id).populate('user', 'displayName').exec(function(err, patientcrf) {
		if (err) return next(err);
		if (! patientcrf) return next(new Error('Failed to load Patientcrf ' + id));
		req.patientcrf = patientcrf ;
		next();
	});
};

/**
 * Patientcrf authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.patientcrf.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
