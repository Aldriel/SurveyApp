'use strict';

//Setting up route
angular.module('choices').config(['$stateProvider',
	function($stateProvider) {
		// Choices state routing
		$stateProvider.
		state('listChoices', {
			url: '/choices',
			templateUrl: 'modules/choices/views/list-choices.client.view.html'
		}).
		state('createChoice', {
			url: '/choices/create',
			templateUrl: 'modules/choices/views/create-choice.client.view.html'
		}).
		state('viewChoice', {
			url: '/choices/:choiceId',
			templateUrl: 'modules/choices/views/view-choice.client.view.html'
		}).
		state('editChoice', {
			url: '/choices/:choiceId/edit',
			templateUrl: 'modules/choices/views/edit-choice.client.view.html'
		});
	}
]);