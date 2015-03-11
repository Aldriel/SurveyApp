'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var choices = require('../../app/controllers/choices.server.controller');

	// Choices Routes
	app.route('/choices')
		.get(choices.list)
		.post(users.requiresLogin, choices.create);

	app.route('/choices/:choiceId')
		.get(choices.read)
		.put(users.requiresLogin, choices.hasAuthorization, choices.update)
		.delete(users.requiresLogin, choices.hasAuthorization, choices.delete);

	// Finish by binding the Choice middleware
	app.param('choiceId', choices.choiceByID);
};
