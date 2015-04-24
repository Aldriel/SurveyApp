'use strict';

//Setting up route
angular.module('patientcrves').config(['$stateProvider',
	function($stateProvider) {
		// Patientcrves state routing
		$stateProvider.
		state('listPatientcrves', {
			url: '/patientcrves',
			templateUrl: 'modules/patientcrves/views/list-patientcrves.client.view.html'
		}).
		state('createPatientcrf', {
			url: '/patientcrves/create',
			templateUrl: 'modules/patientcrves/views/create-patientcrf.client.view.html'
		}).
		state('viewPatientcrf', {
			url: '/patientcrves/:patientcrfId',
			templateUrl: 'modules/patientcrves/views/view-patientcrf.client.view.html'
		}).
		state('editPatientcrf', {
			url: '/patientcrves/:patientcrfId/edit',
			templateUrl: 'modules/patientcrves/views/edit-patientcrf.client.view.html'
		});
	}
]);