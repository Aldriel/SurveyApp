'use strict';

//Setting up route
angular.module('fentoracrf').config(['$stateProvider',
	function($stateProvider) {
		// Fentoracrf state routing
		$stateProvider.
		state('viewFentoracrf', {
			url: '/fentoracrf',
			templateUrl: 'modules/fentoracrf/views/fentoracrf.client.view.html'
		}).
		state('createFentoracrf', {
			url: '/fentoracrf/create',
			templateUrl: 'modules/fentoracrf/views/create-fentoracrf.client.view.html'
		}).
		state('editFentoracrf', {
			url: '/fentoracrf/:fentoracrfId/edit',
			templateUrl: 'modules/fentoracrf/views/edit-fentoracrf.client.view.html'
		});
	}
]);
