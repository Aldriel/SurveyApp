'use strict';

//Setting up route
angular.module('compensationforms').config(['$stateProvider',
	function($stateProvider) {
		// Compensationforms state routing
		$stateProvider.
		state('listCompensationforms', {
			url: '/compensationforms',
			templateUrl: 'modules/compensationforms/views/list-compensationforms.client.view.html'
		}).
		state('createCompensationform', {
			url: '/compensationforms/create',
			templateUrl: 'modules/compensationforms/views/create-compensationform.client.view.html'
		}).
		state('viewCompensationform', {
			url: '/compensationforms/:compensationformId',
			templateUrl: 'modules/compensationforms/views/view-compensationform.client.view.html'
		}).
		state('editCompensationform', {
			url: '/compensationforms/:compensationformId/edit',
			templateUrl: 'modules/compensationforms/views/edit-compensationform.client.view.html'
		});
	}
]);