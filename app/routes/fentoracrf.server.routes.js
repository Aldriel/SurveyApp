'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var fentoracrf = require('../controllers/fentoracrf.server.controller.js');

	// Fentoracrf Routes
	app.route('/fentoracrf')
		.post(users.requiresLogin, fentoracrf.create);

	app.route('/fentoracrf/:fentoracrfId')
		.get(fentoracrf.read)
		.put(users.requiresLogin, fentoracrf.update)
		.delete(users.requiresLogin, fentoracrf.delete);

	// Finish by binding the Fentoracrf middleware
	app.param('fentoracrfId', fentoracrf.fentoracrfByID);
};
