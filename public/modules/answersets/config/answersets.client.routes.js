'use strict';

//Setting up route
angular.module('answersets').config(['$stateProvider',
	function($stateProvider) {
		// Answersets state routing
		$stateProvider.
		state('listAnswersets', {
			url: '/answersets',
			templateUrl: 'modules/answersets/views/list-answersets.client.view.html'
		}).
		state('createAnswerset', {
			url: '/answersets/create',
			templateUrl: 'modules/answersets/views/create-answerset.client.view.html'
		}).
		state('viewAnswerset', {
			url: '/answersets/:answersetId',
			templateUrl: 'modules/answersets/views/view-answerset.client.view.html'
		}).
		state('editAnswerset', {
			url: '/answersets/:answersetId/edit',
			templateUrl: 'modules/answersets/views/edit-answerset.client.view.html'
		});
	}
]);