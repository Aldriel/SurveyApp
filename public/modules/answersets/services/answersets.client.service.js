'use strict';

//Answersets service used to communicate Answersets REST endpoints
angular.module('answersets').factory('Answersets', ['$resource',
	function($resource) {
		return $resource('answersets/:answersetId', { answersetId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);