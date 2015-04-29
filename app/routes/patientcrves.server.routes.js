'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var patientcrves = require('../../app/controllers/patientcrves.server.controller');

	// Patientcrves Routes
	app.route('/patientcrves')
		.get(patientcrves.list)
		.post(users.requiresLogin, patientcrves.create);

	app.route('/patientcrves/:patientcrfId')
		.get(patientcrves.read)
		.put(patientcrves.update)
		.delete(users.requiresLogin, patientcrves.hasAuthorization, patientcrves.delete);

	// Finish by binding the Patientcrf middleware
	app.param('patientcrfId', patientcrves.patientcrfByID);
};
