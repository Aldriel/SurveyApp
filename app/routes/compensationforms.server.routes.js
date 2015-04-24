'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var compensationforms = require('../../app/controllers/compensationforms.server.controller');

	// Compensationforms Routes
	app.route('/compensationforms')
		.get(compensationforms.list)
		.post(compensationforms.create);

	app.route('/compensationforms/:compensationformId')
		.get(compensationforms.read)
		.put(users.requiresLogin, compensationforms.hasAuthorization, compensationforms.update)
		.delete(users.requiresLogin, compensationforms.hasAuthorization, compensationforms.delete);

	// Finish by binding the Compensationform middleware
	app.param('compensationformId', compensationforms.compensationformByID);
};
