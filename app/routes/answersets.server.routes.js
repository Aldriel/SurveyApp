'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var answersets = require('../../app/controllers/answersets.server.controller');

	// Answersets Routes
	app.route('/answersets')
		.get(answersets.list)
		.post(answersets.create);

	app.route('/answersets/:answersetId')
		.get(answersets.read)
		.put(users.requiresLogin, answersets.hasAuthorization, answersets.update)
		.delete(users.requiresLogin, answersets.hasAuthorization, answersets.delete);

	// Finish by binding the Answerset middleware
	app.param('answersetId', answersets.answersetByID);
};
